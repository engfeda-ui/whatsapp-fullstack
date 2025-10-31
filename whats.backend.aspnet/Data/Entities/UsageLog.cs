using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WhatsApp.Backend.Data.Entities;

public class UsageLog
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty; // message_sent, ai_request, api_call

    [MaxLength(100)]
    public string? ResourceType { get; set; } // semantic_kernel, autogen, whatsapp_api

    [MaxLength(100)]
    public string? ResourceId { get; set; }

    public int Tokens { get; set; } = 0;
    public decimal Cost { get; set; } = 0;

    [MaxLength(1000)]
    public string? Metadata { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys
    [Required]
    public string UserId { get; set; } = string.Empty;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; } = null!;
}
