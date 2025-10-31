using Microsoft.EntityFrameworkCore;
using WhatsApp.Backend.Data;
using WhatsApp.Backend.Data.Entities;
using WhatsApp.Backend.Models.DTOs.WhatsApp;

namespace WhatsApp.Backend.Services;

public class WhatsAppService : IWhatsAppService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<WhatsAppService> _logger;

    public WhatsAppService(ApplicationDbContext context, ILogger<WhatsAppService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<MessageDto> SendMessageAsync(SendMessageRequest request, string userId)
    {
        // Verify device belongs to user
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == request.DeviceId && d.UserId == userId);

        if (device == null)
        {
            throw new InvalidOperationException("Device not found or access denied");
        }

        if (device.Status != "connected")
        {
            throw new InvalidOperationException("Device is not connected");
        }

        // Create message record
        var message = new Message
        {
            From = device.PhoneNumber,
            To = request.To,
            Content = request.Message,
            Type = "text",
            Status = "pending",
            DeviceId = device.Id,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // In real implementation, this would send via WhatsApp API
        // For now, we'll simulate success
        message.Status = "sent";
        message.DeliveredAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Message sent: {MessageId} from device {DeviceId}", message.Id, device.Id);
        return MapToDto(message);
    }

    public async Task<MessageDto> SendMediaMessageAsync(SendMediaRequest request, string userId)
    {
        // Verify device belongs to user
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == request.DeviceId && d.UserId == userId);

        if (device == null)
        {
            throw new InvalidOperationException("Device not found or access denied");
        }

        if (device.Status != "connected")
        {
            throw new InvalidOperationException("Device is not connected");
        }

        // Create message record
        var message = new Message
        {
            From = device.PhoneNumber,
            To = request.To,
            Content = request.Caption ?? string.Empty,
            Type = request.MediaType,
            MediaUrl = request.MediaUrl,
            Status = "pending",
            DeviceId = device.Id,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Simulate sending
        message.Status = "sent";
        message.DeliveredAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Media message sent: {MessageId}", message.Id);
        return MapToDto(message);
    }

    public async Task<List<MessageDto>> SendBulkMessagesAsync(int deviceId, List<string> recipients, string message, string userId)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == deviceId && d.UserId == userId);

        if (device == null)
        {
            throw new InvalidOperationException("Device not found or access denied");
        }

        if (device.Status != "connected")
        {
            throw new InvalidOperationException("Device is not connected");
        }

        var messages = new List<Message>();

        foreach (var recipient in recipients)
        {
            var msg = new Message
            {
                From = device.PhoneNumber,
                To = recipient,
                Content = message,
                Type = "text",
                Status = "pending",
                DeviceId = device.Id,
                SentAt = DateTime.UtcNow
            };

            messages.Add(msg);
        }

        _context.Messages.AddRange(messages);
        await _context.SaveChangesAsync();

        // Simulate sending
        foreach (var msg in messages)
        {
            msg.Status = "sent";
            msg.DeliveredAt = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync();

        _logger.LogInformation("Bulk messages sent: {Count} messages from device {DeviceId}",
            messages.Count, device.Id);

        return messages.Select(MapToDto).ToList();
    }

    public async Task<List<MessageDto>> GetMessagesAsync(int deviceId, string userId, int limit = 50)
    {
        // Verify device belongs to user
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == deviceId && d.UserId == userId);

        if (device == null)
        {
            throw new InvalidOperationException("Device not found or access denied");
        }

        var messages = await _context.Messages
            .Where(m => m.DeviceId == deviceId)
            .OrderByDescending(m => m.SentAt)
            .Take(limit)
            .ToListAsync();

        return messages.Select(MapToDto).ToList();
    }

    public async Task<MessageDto?> GetMessageByIdAsync(int messageId, string userId)
    {
        var message = await _context.Messages
            .Include(m => m.Device)
            .FirstOrDefaultAsync(m => m.Id == messageId && m.Device.UserId == userId);

        return message == null ? null : MapToDto(message);
    }

    private static MessageDto MapToDto(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            From = message.From,
            To = message.To,
            Content = message.Content,
            Type = message.Type,
            MediaUrl = message.MediaUrl,
            Status = message.Status,
            SentAt = message.SentAt,
            DeliveredAt = message.DeliveredAt,
            ReadAt = message.ReadAt,
            ErrorMessage = message.ErrorMessage,
            IsAiGenerated = message.IsAiGenerated,
            AiModel = message.AiModel,
            DeviceId = message.DeviceId
        };
    }
}
