using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WhatsApp.Backend.Data.Entities;

public class Device
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ApiKey { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? QRCode { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "disconnected"; // connected, disconnected, pending

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastConnectedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Foreign Keys
    [Required]
    public string UserId { get; set; } = string.Empty;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
