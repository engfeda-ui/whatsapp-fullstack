using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Data.Entities;

public class Plan
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public int MaxDevices { get; set; }

    [Required]
    public int MaxMessagesPerDay { get; set; }

    public int MaxAiRequests { get; set; } = 0;

    public bool HasAiFeatures { get; set; } = false;
    public bool HasMultiAgentSupport { get; set; } = false;
    public bool HasSemanticKernel { get; set; } = false;
    public bool HasAutoGen { get; set; } = false;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
