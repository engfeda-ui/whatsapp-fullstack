using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsApp.Backend.Models;
using WhatsApp.Backend.Models.DTOs.Agent;
using WhatsApp.Backend.Services.AI;

namespace WhatsApp.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public partial class AgentController : ControllerBase
{
    private readonly ISemanticKernelService _semanticKernelService;
    private readonly IAutoGenService _autoGenService;
    private readonly ConversationMemoryService _memoryService;
    private readonly KnowledgeBaseService _knowledgeBaseService;
    private readonly SpecializedAgentsService _specializedAgentsService;
    private readonly ImageGenerationService _imageGenerationService;
    private readonly ILogger<AgentController> _logger;

    public AgentController(
        ISemanticKernelService semanticKernelService,
        IAutoGenService autoGenService,
        ConversationMemoryService memoryService,
        KnowledgeBaseService knowledgeBaseService,
        SpecializedAgentsService specializedAgentsService,
        ImageGenerationService imageGenerationService,
        ILogger<AgentController> logger)
    {
        _semanticKernelService = semanticKernelService;
        _autoGenService = autoGenService;
        _memoryService = memoryService;
        _knowledgeBaseService = knowledgeBaseService;
        _specializedAgentsService = specializedAgentsService;
        _imageGenerationService = imageGenerationService;
        _logger = logger;
    }

    /// <summary>
    /// Chat with AI using Semantic Kernel
    /// </summary>
    [HttpPost("chat")]
    public async Task<ActionResult<ApiResponse<ChatResponse>>> Chat([FromBody] ChatRequest request)
    {
        try
        {
            var response = await _semanticKernelService.ChatAsync(request);
            return Ok(ApiResponse<ChatResponse>.SuccessResponse(response, "Chat completed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in chat endpoint");
            return StatusCode(500, ApiResponse<ChatResponse>.ErrorResponse(
                ex.Message,
                "Chat failed"));
        }
    }

    /// <summary>
    /// Generate a message using AI
    /// </summary>
    [HttpPost("generate-message")]
    public async Task<ActionResult<ApiResponse<string>>> GenerateMessage([FromBody] GenerateMessageRequest request)
    {
        try
        {
            var message = await _semanticKernelService.GenerateMessageAsync(request.Prompt, request.Context);
            return Ok(ApiResponse<string>.SuccessResponse(message, "Message generated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating message");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(
                ex.Message,
                "Message generation failed"));
        }
    }

    /// <summary>
    /// Summarize a conversation using AI
    /// </summary>
    [HttpPost("summarize")]
    public async Task<ActionResult<ApiResponse<string>>> SummarizeConversation([FromBody] SummarizeRequest request)
    {
        try
        {
            var summary = await _semanticKernelService.SummarizeConversationAsync(request.ConversationText);
            return Ok(ApiResponse<string>.SuccessResponse(summary, "Conversation summarized successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error summarizing conversation");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(
                ex.Message,
                "Summarization failed"));
        }
    }

    /// <summary>
    /// Analyze sentiment of text using AI
    /// </summary>
    [HttpPost("analyze-sentiment")]
    public async Task<ActionResult<ApiResponse<string>>> AnalyzeSentiment([FromBody] AnalyzeSentimentRequest request)
    {
        try
        {
            var sentiment = await _semanticKernelService.AnalyzeSentimentAsync(request.Text);
            return Ok(ApiResponse<string>.SuccessResponse(sentiment, "Sentiment analyzed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing sentiment");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(
                ex.Message,
                "Sentiment analysis failed"));
        }
    }

    /// <summary>
    /// Run a multi-agent task using AutoGen
    /// </summary>
    [HttpPost("multi-agent")]
    public async Task<ActionResult<ApiResponse<MultiAgentResponse>>> RunMultiAgentTask([FromBody] MultiAgentRequest request)
    {
        try
        {
            var response = await _autoGenService.RunMultiAgentTaskAsync(request);
            return Ok(ApiResponse<MultiAgentResponse>.SuccessResponse(response, "Multi-agent task completed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in multi-agent task");
            return StatusCode(500, ApiResponse<MultiAgentResponse>.ErrorResponse(
                ex.Message,
                "Multi-agent task failed"));
        }
    }

    /// <summary>
    /// Get collaborative response from multiple agents
    /// </summary>
    [HttpPost("collaborative")]
    public async Task<ActionResult<ApiResponse<string>>> GetCollaborativeResponse([FromBody] CollaborativeRequest request)
    {
        try
        {
            var response = await _autoGenService.CollaborativeResponseAsync(request.Message, request.AgentRoles);
            return Ok(ApiResponse<string>.SuccessResponse(response, "Collaborative response generated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in collaborative response");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(
                ex.Message,
                "Collaborative response failed"));
        }
    }
}

