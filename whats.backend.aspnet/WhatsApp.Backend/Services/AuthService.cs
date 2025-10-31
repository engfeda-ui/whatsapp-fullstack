using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WhatsApp.Backend.Data;
using WhatsApp.Backend.Data.Entities;
using WhatsApp.Backend.Models.DTOs.Auth;

namespace WhatsApp.Backend.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request, string ipAddress)
    {
        // Check if user exists
        if (await _userManager.FindByEmailAsync(request.Email) != null)
        {
            return null;
        }

        var user = new ApplicationUser
        {
            FullName = request.FullName,
            Email = request.Email,
            UserName = request.Email,
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return null;
        }

        // Generate tokens
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken(ipAddress);

        // Save refresh token
        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes()),
            User = MapToUserDto(user)
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request, string ipAddress)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return null;
        }

        if (!user.IsActive)
        {
            return null;
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        // Generate tokens
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken(ipAddress);

        // Remove old refresh tokens
        RemoveOldRefreshTokens(user);

        // Save new refresh token
        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes()),
            User = MapToUserDto(user)
        };
    }

    public async Task<AuthResponse?> RefreshTokenAsync(string token, string ipAddress)
    {
        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

        if (user == null)
        {
            return null;
        }

        var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

        if (!refreshToken.IsActive)
        {
            return null;
        }

        // Replace old refresh token with new one
        var newRefreshToken = GenerateRefreshToken(ipAddress);
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        refreshToken.ReplacedByToken = newRefreshToken.Token;

        user.RefreshTokens.Add(newRefreshToken);

        RemoveOldRefreshTokens(user);

        await _context.SaveChangesAsync();

        // Generate new JWT token
        var jwtToken = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = jwtToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes()),
            User = MapToUserDto(user)
        };
    }

    public async Task<bool> RevokeTokenAsync(string token, string ipAddress)
    {
        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

        if (user == null)
        {
            return false;
        }

        var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

        if (!refreshToken.IsActive)
        {
            return false;
        }

        // Revoke token
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UserDto?> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user == null ? null : MapToUserDto(user);
    }

    // Private helper methods

    private string GenerateJwtToken(ApplicationUser user)
    {
        var secret = _configuration["JwtSettings:Secret"]
            ?? throw new InvalidOperationException("JWT Secret not configured");
        var issuer = _configuration["JwtSettings:Issuer"];
        var audience = _configuration["JwtSettings:Audience"];

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes()),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private RefreshToken GenerateRefreshToken(string ipAddress)
    {
        using var rng = RandomNumberGenerator.Create();
        var randomBytes = new byte[64];
        rng.GetBytes(randomBytes);

        var expiryDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpiryInDays"] ?? "7");

        return new RefreshToken
        {
            Token = Convert.ToBase64String(randomBytes),
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };
    }

    private void RemoveOldRefreshTokens(ApplicationUser user)
    {
        // Remove old inactive refresh tokens (keep only last 5)
        var tokensToRemove = user.RefreshTokens
            .Where(x => !x.IsActive)
            .OrderBy(x => x.CreatedAt)
            .Take(Math.Max(0, user.RefreshTokens.Count(x => !x.IsActive) - 5))
            .ToList();

        foreach (var token in tokensToRemove)
        {
            user.RefreshTokens.Remove(token);
        }
    }

    private int GetJwtExpiryMinutes()
    {
        return int.Parse(_configuration["JwtSettings:ExpiryInMinutes"] ?? "60");
    }

    private static UserDto MapToUserDto(ApplicationUser user)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        };
    }
}
