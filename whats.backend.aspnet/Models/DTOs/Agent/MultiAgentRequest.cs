using System.ComponentModel.DataAnnotations;

namespace WhatsApp.Backend.Models.DTOs.Agent;

public class MultiAgentRequest
{
    [Required]
    public string Task { get; set; } = string.Empty;

    public int MaxRounds { get; set; } = 5;

    public string[]? AgentRoles { get; set; }
}
