using WhatsApp.Backend.Models.DTOs.Agent;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace WhatsApp.Backend.Services.AI;

public class AutoGenService : IAutoGenService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AutoGenService> _logger;
    private readonly Kernel _kernel;

    public AutoGenService(IConfiguration configuration, ILogger<AutoGenService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        var endpoint = _configuration["AzureOpenAI:Endpoint"]
            ?? throw new InvalidOperationException("Azure OpenAI Endpoint not configured");
        var apiKey = _configuration["AzureOpenAI:ApiKey"]
            ?? throw new InvalidOperationException("Azure OpenAI API Key not configured");
        var deploymentName = _configuration["AzureOpenAI:DeploymentName"] ?? "gpt-4";

        var builder = Kernel.CreateBuilder();
        builder.AddAzureOpenAIChatCompletion(deploymentName, endpoint, apiKey);
        _kernel = builder.Build();
    }

    public async Task<MultiAgentResponse> RunMultiAgentTaskAsync(MultiAgentRequest request)
    {
        try
        {
            var conversation = new List<AgentMessage>();
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();

            // Agent 1: Assistant
            var assistantHistory = new ChatHistory();
            assistantHistory.AddSystemMessage("You are a helpful WhatsApp Business assistant that coordinates with other agents.");
            assistantHistory.AddUserMessage(request.Task);
            var assistantResponse = await chatService.GetChatMessageContentAsync(assistantHistory, kernel: _kernel);
            
            conversation.Add(new AgentMessage
            {
                AgentName = "Assistant",
                Message = assistantResponse.Content ?? string.Empty,
                Timestamp = DateTime.UtcNow
            });

            // Agent 2: Marketing Expert
            var marketingHistory = new ChatHistory();
            marketingHistory.AddSystemMessage("You are a marketing expert for WhatsApp Business campaigns.");
            marketingHistory.AddUserMessage($"Based on this task: {request.Task}\nAnd this assistant's response: {assistantResponse.Content}\nProvide marketing insights.");
            var marketingResponse = await chatService.GetChatMessageContentAsync(marketingHistory, kernel: _kernel);
            
            conversation.Add(new AgentMessage
            {
                AgentName = "MarketingExpert",
                Message = marketingResponse.Content ?? string.Empty,
                Timestamp = DateTime.UtcNow
            });

            // Agent 3: Customer Service
            var csHistory = new ChatHistory();
            csHistory.AddSystemMessage("You are a customer service specialist.");
            csHistory.AddUserMessage($"Task: {request.Task}\nMarketing input: {marketingResponse.Content}\nProvide customer service perspective.");
            var csResponse = await chatService.GetChatMessageContentAsync(csHistory, kernel: _kernel);
            
            conversation.Add(new AgentMessage
            {
                AgentName = "CustomerService",
                Message = csResponse.Content ?? string.Empty,
                Timestamp = DateTime.UtcNow
            });

            return new MultiAgentResponse
            {
                Result = csResponse.Content ?? string.Empty,
                RoundsCompleted = 3,
                Conversation = conversation
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in multi-agent task");
            throw;
        }
    }

    public async Task<string> CollaborativeResponseAsync(string userMessage, string[] agentRoles)
    {
        try
        {
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var responses = new List<string>();

            foreach (var role in agentRoles.Take(3))
            {
                var systemMessage = role.ToLower() switch
                {
                    "marketing" => "You are a marketing expert for WhatsApp Business.",
                    "support" => "You are a customer support specialist.",
                    "sales" => "You are a sales expert focused on conversions.",
                    _ => "You are a helpful business assistant."
                };

                var chatHistory = new ChatHistory();
                chatHistory.AddSystemMessage(systemMessage);
                chatHistory.AddUserMessage(userMessage);

                var response = await chatService.GetChatMessageContentAsync(chatHistory, kernel: _kernel);
                responses.Add($"[{role}]: {response.Content}");
            }

            return string.Join("\n\n", responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in collaborative response");
            throw;
        }
    }
}
