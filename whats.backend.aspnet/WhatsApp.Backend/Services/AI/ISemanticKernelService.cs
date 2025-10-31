using WhatsApp.Backend.Models.DTOs.Agent;

namespace WhatsApp.Backend.Services.AI;

public interface ISemanticKernelService
{
    Task<ChatResponse> ChatAsync(ChatRequest request);
    Task<string> GenerateMessageAsync(string prompt, string? context = null);
    Task<string> SummarizeConversationAsync(string conversationText);
    Task<string> AnalyzeSentimentAsync(string text);
}
