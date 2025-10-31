using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using WhatsApp.Backend.Models.DTOs.Agent;

namespace WhatsApp.Backend.Services.AI;

public class SemanticKernelService : ISemanticKernelService
{
    private readonly Kernel _kernel;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SemanticKernelService> _logger;

    public SemanticKernelService(IConfiguration configuration, ILogger<SemanticKernelService> logger)
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

    public async Task<ChatResponse> ChatAsync(ChatRequest request)
    {
        try
        {
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var chatHistory = new ChatHistory();

            if (!string.IsNullOrEmpty(request.SystemPrompt))
            {
                chatHistory.AddSystemMessage(request.SystemPrompt);
            }
            else
            {
                chatHistory.AddSystemMessage("You are a helpful WhatsApp Business assistant. Provide professional and friendly responses.");
            }

            chatHistory.AddUserMessage(request.Message);

            var settings = new AzureOpenAIPromptExecutionSettings
            {
                Temperature = request.Temperature,
                MaxTokens = request.MaxTokens
            };

            var result = await chatService.GetChatMessageContentAsync(
                chatHistory,
                settings,
                _kernel);

            var conversationId = request.ConversationId ?? Guid.NewGuid().ToString();

            return new ChatResponse
            {
                Response = result.Content ?? string.Empty,
                ConversationId = conversationId,
                TokensUsed = result.Metadata?.TryGetValue("Usage", out var usage) == true
                    ? Convert.ToInt32(usage)
                    : 0,
                Model = _configuration["AzureOpenAI:ModelId"] ?? "gpt-4"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Semantic Kernel chat");
            throw;
        }
    }

    public async Task<string> GenerateMessageAsync(string prompt, string? context = null)
    {
        try
        {
            var fullPrompt = context != null
                ? $"Context: {context}\n\nTask: {prompt}"
                : prompt;

            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var chatHistory = new ChatHistory();
            chatHistory.AddSystemMessage("You are a creative WhatsApp message generator. Generate professional and engaging messages.");
            chatHistory.AddUserMessage(fullPrompt);

            var result = await chatService.GetChatMessageContentAsync(chatHistory, kernel: _kernel);
            return result.Content ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating message");
            throw;
        }
    }

    public async Task<string> SummarizeConversationAsync(string conversationText)
    {
        try
        {
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var chatHistory = new ChatHistory();
            chatHistory.AddSystemMessage("You are an expert at summarizing conversations. Provide concise and accurate summaries.");
            chatHistory.AddUserMessage($"Summarize the following conversation:\n\n{conversationText}");

            var settings = new AzureOpenAIPromptExecutionSettings
            {
                Temperature = 0.3,
                MaxTokens = 500
            };

            var result = await chatService.GetChatMessageContentAsync(
                chatHistory,
                settings,
                _kernel);

            return result.Content ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error summarizing conversation");
            throw;
        }
    }

    public async Task<string> AnalyzeSentimentAsync(string text)
    {
        try
        {
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var chatHistory = new ChatHistory();
            chatHistory.AddSystemMessage("You are a sentiment analysis expert. Analyze the sentiment of text and respond with: Positive, Negative, or Neutral, followed by a brief explanation.");
            chatHistory.AddUserMessage($"Analyze the sentiment of this message:\n\n{text}");

            var settings = new AzureOpenAIPromptExecutionSettings
            {
                Temperature = 0.2,
                MaxTokens = 200
            };

            var result = await chatService.GetChatMessageContentAsync(
                chatHistory,
                settings,
                _kernel);

            return result.Content ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing sentiment");
            throw;
        }
    }
}
