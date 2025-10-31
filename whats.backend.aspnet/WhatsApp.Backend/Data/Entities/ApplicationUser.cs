using Microsoft.AspNetCore.Identity;

namespace WhatsApp.Backend.Data.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public virtual ICollection<UsageLog> UsageLogs { get; set; } = new List<UsageLog>();
}
