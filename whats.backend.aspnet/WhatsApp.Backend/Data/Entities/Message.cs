using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WhatsApp.Backend.Data.Entities;

public class Message
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string From { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string To { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Type { get; set; } = "text"; // text, image, video, audio, document

    [MaxLength(500)]
    public string? MediaUrl { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "pending"; // pending, sent, delivered, read, failed

    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeliveredAt { get; set; }
    public DateTime? ReadAt { get; set; }

    [MaxLength(500)]
    public string? ErrorMessage { get; set; }

    // AI-related fields
    public bool IsAiGenerated { get; set; } = false;
    [MaxLength(100)]
    public string? AiModel { get; set; }
    [MaxLength(50)]
    public string? ConversationId { get; set; }

    // Foreign Keys
    [Required]
    public int DeviceId { get; set; }

    // Navigation properties
    [ForeignKey(nameof(DeviceId))]
    public virtual Device Device { get; set; } = null!;
}
