namespace WhatsApp.Backend.Models.DTOs.Agent;

public class CollaborativeRequest
{
    public string Message { get; set; } = string.Empty;
    public string[] AgentRoles { get; set; } = Array.Empty<string>();
}
