namespace WhatsApp.Backend.Models.DTOs.Agent;

public class ChatResponse
{
    public string Response { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public int TokensUsed { get; set; }
    public string Model { get; set; } = string.Empty;
}
