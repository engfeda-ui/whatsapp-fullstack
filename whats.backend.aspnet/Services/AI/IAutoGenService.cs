using WhatsApp.Backend.Models.DTOs.Agent;

namespace WhatsApp.Backend.Services.AI;

public interface IAutoGenService
{
    Task<MultiAgentResponse> RunMultiAgentTaskAsync(MultiAgentRequest request);
    Task<string> CollaborativeResponseAsync(string userMessage, string[] agentRoles);
}
