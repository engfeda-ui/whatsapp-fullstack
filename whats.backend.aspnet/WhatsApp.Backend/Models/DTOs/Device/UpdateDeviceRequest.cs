using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.Device;

public class UpdateDeviceRequest
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [Phone]
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    public bool? IsActive { get; set; }
}
