using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.Auth;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
