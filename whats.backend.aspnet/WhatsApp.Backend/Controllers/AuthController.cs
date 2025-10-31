using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsApp.Backend.Models;
using WhatsApp.Backend.Models.DTOs.Auth;
using WhatsApp.Backend.Services;

namespace WhatsApp.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var ipAddress = GetIpAddress();
            var result = await _authService.RegisterAsync(request, ipAddress);

            if (result == null)
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse(
                    "Registration failed. Email may already be in use.",
                    "Registration Failed"));
            }

            SetTokenCookie(result.RefreshToken);

            _logger.LogInformation("User registered successfully: {Email}", request.Email);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Registration successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse(
                ex.Message,
                "Internal server error"));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var ipAddress = GetIpAddress();
            var result = await _authService.LoginAsync(request, ipAddress);

            if (result == null)
            {
                return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse(
                    "Invalid email or password",
                    "Login Failed"));
            }

            SetTokenCookie(result.RefreshToken);

            _logger.LogInformation("User logged in successfully: {Email}", request.Email);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Login successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse(
                ex.Message,
                "Internal server error"));
        }
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var token = request.RefreshToken ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse(
                    "Refresh token is required",
                    "Invalid Request"));
            }

            var ipAddress = GetIpAddress();
            var result = await _authService.RefreshTokenAsync(token, ipAddress);

            if (result == null)
            {
                return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse(
                    "Invalid or expired refresh token",
                    "Token Refresh Failed"));
            }

            SetTokenCookie(result.RefreshToken);

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Token refreshed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse(
                ex.Message,
                "Internal server error"));
        }
    }

    [Authorize]
    [HttpPost("revoke-token")]
    public async Task<ActionResult<ApiResponse<bool>>> RevokeToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var token = request.RefreshToken ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(ApiResponse<bool>.ErrorResponse(
                    "Refresh token is required",
                    "Invalid Request"));
            }

            var ipAddress = GetIpAddress();
            var result = await _authService.RevokeTokenAsync(token, ipAddress);

            if (!result)
            {
                return BadRequest(ApiResponse<bool>.ErrorResponse(
                    "Token revocation failed",
                    "Revocation Failed"));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Token revoked successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token revocation");
            return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                ex.Message,
                "Internal server error"));
        }
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<UserDto>.ErrorResponse(
                    "User not found",
                    "Unauthorized"));
            }

            var user = await _authService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound(ApiResponse<UserDto>.ErrorResponse(
                    "User not found",
                    "Not Found"));
            }

            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "User retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user");
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse(
                ex.Message,
                "Internal server error"));
        }
    }

    // Helper methods
    private void SetTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            SameSite = SameSiteMode.Strict,
            Secure = true // Only use HTTPS
        };

        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string GetIpAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            return Request.Headers["X-Forwarded-For"].ToString();
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}
