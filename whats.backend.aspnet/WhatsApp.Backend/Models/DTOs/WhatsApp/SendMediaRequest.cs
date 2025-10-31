using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.WhatsApp;

public class SendMediaRequest
{
    [Required]
    public int DeviceId { get; set; }

    [Required]
    [Phone]
    public string To { get; set; } = string.Empty;

    [Required]
    [Url]
    public string MediaUrl { get; set; } = string.Empty;

    [Required]
    public string MediaType { get; set; } = "image"; // image, video, audio, document

    public string? Caption { get; set; }
}
