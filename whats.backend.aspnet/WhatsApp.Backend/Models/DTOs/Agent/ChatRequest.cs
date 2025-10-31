using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.Agent;

public class ChatRequest
{
    [Required]
    public string Message { get; set; } = string.Empty;

    public string? ConversationId { get; set; }

    public string? SystemPrompt { get; set; }

    public double Temperature { get; set; } = 0.7;

    public int MaxTokens { get; set; } = 1000;
}
