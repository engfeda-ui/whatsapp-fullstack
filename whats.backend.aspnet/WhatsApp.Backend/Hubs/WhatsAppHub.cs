using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WhatsApp.Backend.Hubs;

[Authorize]
public class WhatsAppHub : Hub
{
    private readonly ILogger<WhatsAppHub> _logger;

    public WhatsAppHub(ILogger<WhatsAppHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        _logger.LogInformation("User connected to WhatsApp Hub: {UserId}", userId);

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        _logger.LogInformation("User disconnected from WhatsApp Hub: {UserId}", userId);

        if (userId != null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Client can subscribe to device updates
    public async Task SubscribeToDevice(int deviceId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"device_{deviceId}");
        _logger.LogInformation("User subscribed to device {DeviceId}", deviceId);
    }

    public async Task UnsubscribeFromDevice(int deviceId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"device_{deviceId}");
        _logger.LogInformation("User unsubscribed from device {DeviceId}", deviceId);
    }

    // Methods to be called from server to broadcast updates
    public async Task NotifyMessageReceived(int deviceId, string from, string message)
    {
        await Clients.Group($"device_{deviceId}").SendAsync("MessageReceived", new
        {
            DeviceId = deviceId,
            From = from,
            Message = message,
            Timestamp = DateTime.UtcNow
        });
    }

    public async Task NotifyMessageStatusChanged(int messageId, string status)
    {
        await Clients.All.SendAsync("MessageStatusChanged", new
        {
            MessageId = messageId,
            Status = status,
            Timestamp = DateTime.UtcNow
        });
    }

    public async Task NotifyDeviceStatusChanged(int deviceId, string status)
    {
        await Clients.Group($"device_{deviceId}").SendAsync("DeviceStatusChanged", new
        {
            DeviceId = deviceId,
            Status = status,
            Timestamp = DateTime.UtcNow
        });
    }
}
