namespace WhatsApp.Backend.Models.DTOs.WhatsApp;

public class MessageDto
{
    public int Id { get; set; }
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsAiGenerated { get; set; }
    public string? AiModel { get; set; }
    public int DeviceId { get; set; }
}
