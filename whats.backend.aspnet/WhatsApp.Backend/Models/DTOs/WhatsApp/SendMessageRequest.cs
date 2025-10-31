using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.WhatsApp;

public class SendMessageRequest
{
    [Required]
    public int DeviceId { get; set; }

    [Required]
    [Phone]
    public string To { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;
}
