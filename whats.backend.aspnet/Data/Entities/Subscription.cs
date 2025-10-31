using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WhatsApp.Backend.Data.Entities;

public class Subscription
{
    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime StartDate { get; set; } = DateTime.UtcNow;

    [Required]
    public DateTime EndDate { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "active"; // active, expired, cancelled

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public int PlanId { get; set; }

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; } = null!;

    [ForeignKey(nameof(PlanId))]
    public virtual Plan Plan { get; set; } = null!;
}
