namespace WhatsApp.Backend.Models.DTOs.Device;

public class DeviceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string? QRCode { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastConnectedAt { get; set; }
    public bool IsActive { get; set; }
    public string UserId { get; set; } = string.Empty;
}
