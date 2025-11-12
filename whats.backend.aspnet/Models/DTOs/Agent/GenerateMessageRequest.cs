namespace WhatsApp.Backend.Models.DTOs.Agent;

public class GenerateMessageRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string? Context { get; set; }
}
