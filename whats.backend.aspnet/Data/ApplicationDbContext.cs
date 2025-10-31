using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WhatsApp.Backend.Data.Entities;

namespace WhatsApp.Backend.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Plan> Plans => Set<Plan>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<MessageTemplate> MessageTemplates => Set<MessageTemplate>();
    public DbSet<UsageLog> UsageLogs => Set<UsageLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure ApplicationUser
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FullName).HasMaxLength(200);
        });

        // Configure Device
        builder.Entity<Device>(entity =>
        {
            entity.HasIndex(e => e.PhoneNumber);
            entity.HasIndex(e => e.ApiKey).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.PhoneNumber });

            entity.HasOne(e => e.User)
                .WithMany(u => u.Devices)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.PhoneNumber).IsRequired();
            entity.Property(e => e.ApiKey).IsRequired();
        });

        // Configure Message
        builder.Entity<Message>(entity =>
        {
            entity.HasIndex(e => e.From);
            entity.HasIndex(e => e.To);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.SentAt);
            entity.HasIndex(e => e.ConversationId);
            entity.HasIndex(e => new { e.DeviceId, e.SentAt });

            entity.HasOne(e => e.Device)
                .WithMany(d => d.Messages)
                .HasForeignKey(e => e.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.Type).HasDefaultValue("text");
            entity.Property(e => e.Status).HasDefaultValue("pending");
        });

        // Configure Plan
        builder.Entity<Plan>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.MaxDevices).HasDefaultValue(1);
            entity.Property(e => e.MaxMessagesPerDay).HasDefaultValue(100);
        });

        // Configure Subscription
        builder.Entity<Subscription>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => new { e.UserId, e.Status });

            entity.HasOne(e => e.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Plan)
                .WithMany(p => p.Subscriptions)
                .HasForeignKey(e => e.PlanId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.Status).HasDefaultValue("active");
        });

        // Configure RefreshToken
        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => e.UserId);

            entity.HasOne(e => e.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure MessageTemplate
        builder.Entity<MessageTemplate>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Category);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Content).IsRequired();
        });

        // Configure UsageLog
        builder.Entity<UsageLog>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Action);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });

            entity.HasOne(e => e.User)
                .WithMany(u => u.UsageLogs)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Cost).HasColumnType("decimal(18,4)");
        });

        // Seed initial Plans
        builder.Entity<Plan>().HasData(
            new Plan
            {
                Id = 1,
                Name = "Free",
                Description = "Basic plan for testing",
                Price = 0,
                MaxDevices = 1,
                MaxMessagesPerDay = 50,
                MaxAiRequests = 10,
                HasAiFeatures = false,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Plan
            {
                Id = 2,
                Name = "Starter",
                Description = "Perfect for small businesses",
                Price = 29.99m,
                MaxDevices = 3,
                MaxMessagesPerDay = 500,
                MaxAiRequests = 100,
                HasAiFeatures = true,
                HasSemanticKernel = true,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Plan
            {
                Id = 3,
                Name = "Professional",
                Description = "Advanced features for growing businesses",
                Price = 79.99m,
                MaxDevices = 10,
                MaxMessagesPerDay = 2000,
                MaxAiRequests = 500,
                HasAiFeatures = true,
                HasSemanticKernel = true,
                HasAutoGen = true,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Plan
            {
                Id = 4,
                Name = "Enterprise",
                Description = "Full features with multi-agent support",
                Price = 199.99m,
                MaxDevices = -1, // Unlimited
                MaxMessagesPerDay = -1, // Unlimited
                MaxAiRequests = -1, // Unlimited
                HasAiFeatures = true,
                HasSemanticKernel = true,
                HasAutoGen = true,
                HasMultiAgentSupport = true,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
