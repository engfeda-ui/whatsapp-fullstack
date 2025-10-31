using WhatsApp.Backend.Models.DTOs.Auth;

namespace WhatsApp.Backend.Services;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request, string ipAddress);
    Task<AuthResponse?> LoginAsync(LoginRequest request, string ipAddress);
    Task<AuthResponse?> RefreshTokenAsync(string token, string ipAddress);
    Task<bool> RevokeTokenAsync(string token, string ipAddress);
    Task<UserDto?> GetUserByIdAsync(string userId);
}
