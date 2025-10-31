namespace WhatsApp.Backend.Models.DTOs.Agent;

public class MultiAgentResponse
{
    public string Result { get; set; } = string.Empty;
    public int RoundsCompleted { get; set; }
    public List<AgentMessage> Conversation { get; set; } = new();
}

public class AgentMessage
{
    public string AgentName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
