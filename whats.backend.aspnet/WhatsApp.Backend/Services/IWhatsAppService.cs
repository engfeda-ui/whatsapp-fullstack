using WhatsApp.Backend.Models.DTOs.WhatsApp;

namespace WhatsApp.Backend.Services;

public interface IWhatsAppService
{
    Task<MessageDto> SendMessageAsync(SendMessageRequest request, string userId);
    Task<MessageDto> SendMediaMessageAsync(SendMediaRequest request, string userId);
    Task<List<MessageDto>> SendBulkMessagesAsync(int deviceId, List<string> recipients, string message, string userId);
    Task<List<MessageDto>> GetMessagesAsync(int deviceId, string userId, int limit = 50);
    Task<MessageDto?> GetMessageByIdAsync(int messageId, string userId);
}
