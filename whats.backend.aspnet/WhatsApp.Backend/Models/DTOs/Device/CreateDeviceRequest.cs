using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.Device;

public class CreateDeviceRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Phone]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
}
