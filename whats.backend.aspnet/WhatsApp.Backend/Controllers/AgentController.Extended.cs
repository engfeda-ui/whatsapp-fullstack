using Microsoft.AspNetCore.Mvc;
using WhatsApp.Backend.Models;
using WhatsApp.Backend.Services.AI;

namespace WhatsApp.Backend.Controllers;

/// <summary>
/// Extended Agent Controller with new AI features
/// This partial class adds: Memory, Knowledge Base, Specialized Agents, and Image Generation
/// </summary>
public partial class AgentController
{
    // ==================== MEMORY & CONTEXT ====================

    /// <summary>
    /// Add message to conversation memory
    /// </summary>
    [HttpPost("memory/add")]
    public ActionResult<ApiResponse<string>> AddToMemory([FromBody] AddMemoryRequest request)
    {
        try
        {
            _memoryService.AddMessage(request.ConversationId, request.Role, request.Message);
            return Ok(ApiResponse<string>.SuccessResponse("Message added to memory", "Memory updated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding to memory");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Memory update failed"));
        }
    }

    /// <summary>
    /// Get conversation context
    /// </summary>
    [HttpGet("memory/context/{conversationId}")]
    public ActionResult<ApiResponse<string>> GetContext(string conversationId, [FromQuery] int? messageCount = null)
    {
        try
        {
            var context = _memoryService.GetContext(conversationId, messageCount);
            return Ok(ApiResponse<string>.SuccessResponse(context, "Context retrieved"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting context");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Context retrieval failed"));
        }
    }

    /// <summary>
    /// Get conversation history
    /// </summary>
    [HttpGet("memory/history/{conversationId}")]
    public ActionResult<ApiResponse<List<ConversationMessage>>> GetHistory(string conversationId)
    {
        try
        {
            var history = _memoryService.GetHistory(conversationId);
            return Ok(ApiResponse<List<ConversationMessage>>.SuccessResponse(history, "History retrieved"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting history");
            return StatusCode(500, ApiResponse<List<ConversationMessage>>.ErrorResponse(ex.Message, "History retrieval failed"));
        }
    }

    /// <summary>
    /// Clear conversation memory
    /// </summary>
    [HttpDelete("memory/clear/{conversationId}")]
    public ActionResult<ApiResponse<string>> ClearMemory(string conversationId)
    {
        try
        {
            _memoryService.ClearConversation(conversationId);
            return Ok(ApiResponse<string>.SuccessResponse("Memory cleared", "Operation successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing memory");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Clear failed"));
        }
    }

    // ==================== KNOWLEDGE BASE (RAG) ====================

    /// <summary>
    /// Upload PDF document to knowledge base
    /// </summary>
    [HttpPost("knowledge/upload-pdf")]
    public async Task<ActionResult<ApiResponse<string>>> UploadPdf(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<string>.ErrorResponse("No file provided", "Upload failed"));

            using var stream = file.OpenReadStream();
            var documentId = await _knowledgeBaseService.UploadPdfAsync(stream, file.FileName);

            return Ok(ApiResponse<string>.SuccessResponse(documentId, $"PDF '{file.FileName}' uploaded successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading PDF");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "PDF upload failed"));
        }
    }

    /// <summary>
    /// Upload Word document to knowledge base
    /// </summary>
    [HttpPost("knowledge/upload-word")]
    public async Task<ActionResult<ApiResponse<string>>> UploadWord(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<string>.ErrorResponse("No file provided", "Upload failed"));

            using var stream = file.OpenReadStream();
            var documentId = await _knowledgeBaseService.UploadWordAsync(stream, file.FileName);

            return Ok(ApiResponse<string>.SuccessResponse(documentId, $"Word document '{file.FileName}' uploaded successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading Word document");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Word upload failed"));
        }
    }

    /// <summary>
    /// Upload text to knowledge base
    /// </summary>
    [HttpPost("knowledge/upload-text")]
    public async Task<ActionResult<ApiResponse<string>>> UploadText([FromBody] UploadTextRequest request)
    {
        try
        {
            var documentId = await _knowledgeBaseService.UploadTextAsync(request.Text, request.Title);
            return Ok(ApiResponse<string>.SuccessResponse(documentId, $"Text '{request.Title}' uploaded successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading text");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Text upload failed"));
        }
    }

    /// <summary>
    /// Search knowledge base
    /// </summary>
    [HttpPost("knowledge/search")]
    public async Task<ActionResult<ApiResponse<List<KnowledgeSearchResult>>>> SearchKnowledge([FromBody] SearchKnowledgeRequest request)
    {
        try
        {
            var results = await _knowledgeBaseService.SearchAsync(request.Query, request.Limit, request.MinRelevance);
            return Ok(ApiResponse<List<KnowledgeSearchResult>>.SuccessResponse(results, "Search completed"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching knowledge base");
            return StatusCode(500, ApiResponse<List<KnowledgeSearchResult>>.ErrorResponse(ex.Message, "Search failed"));
        }
    }

    /// <summary>
    /// Get answer from knowledge base
    /// </summary>
    [HttpPost("knowledge/ask")]
    public async Task<ActionResult<ApiResponse<string>>> AskKnowledge([FromBody] AskKnowledgeRequest request)
    {
        try
        {
            var answer = await _knowledgeBaseService.GetAnswerAsync(request.Question, request.ContextLimit);
            return Ok(ApiResponse<string>.SuccessResponse(answer, "Answer generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting answer from knowledge base");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Answer generation failed"));
        }
    }

    /// <summary>
    /// List all documents in knowledge base
    /// </summary>
    [HttpGet("knowledge/documents")]
    public ActionResult<ApiResponse<List<DocumentMetadata>>> ListDocuments()
    {
        try
        {
            var documents = _knowledgeBaseService.ListDocuments();
            return Ok(ApiResponse<List<DocumentMetadata>>.SuccessResponse(documents, "Documents listed"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing documents");
            return StatusCode(500, ApiResponse<List<DocumentMetadata>>.ErrorResponse(ex.Message, "List failed"));
        }
    }

    // ==================== SPECIALIZED AGENTS ====================

    /// <summary>
    /// Get response from a specific specialized agent
    /// </summary>
    [HttpPost("agents/{agentName}")]
    public async Task<ActionResult<ApiResponse<AgentResponse>>> GetAgentResponse(string agentName, [FromBody] AgentQueryRequest request)
    {
        try
        {
            var response = await _specializedAgentsService.GetAgentResponseAsync(agentName, request.Query);
            return Ok(ApiResponse<AgentResponse>.SuccessResponse(response, $"{agentName} response generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting {agentName} response");
            return StatusCode(500, ApiResponse<AgentResponse>.ErrorResponse(ex.Message, "Agent response failed"));
        }
    }

    /// <summary>
    /// Get responses from multiple agents
    /// </summary>
    [HttpPost("agents/multiple")]
    public async Task<ActionResult<ApiResponse<List<AgentResponse>>>> GetMultipleAgentResponses([FromBody] MultipleAgentsRequest request)
    {
        try
        {
            var responses = await _specializedAgentsService.GetMultipleAgentResponsesAsync(request.AgentNames, request.Query);
            return Ok(ApiResponse<List<AgentResponse>>.SuccessResponse(responses, "Multiple agent responses generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting multiple agent responses");
            return StatusCode(500, ApiResponse<List<AgentResponse>>.ErrorResponse(ex.Message, "Multiple agent response failed"));
        }
    }

    /// <summary>
    /// Get responses from all available agents
    /// </summary>
    [HttpPost("agents/all")]
    public async Task<ActionResult<ApiResponse<List<AgentResponse>>>> GetAllAgentResponses([FromBody] AllAgentsRequest request)
    {
        try
        {
            var responses = await _specializedAgentsService.GetAllAgentResponsesAsync(request.Query);
            return Ok(ApiResponse<List<AgentResponse>>.SuccessResponse(responses, "All agent responses generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all agent responses");
            return StatusCode(500, ApiResponse<List<AgentResponse>>.ErrorResponse(ex.Message, "All agent response failed"));
        }
    }

    /// <summary>
    /// Recommend best agent for a task
    /// </summary>
    [HttpPost("agents/recommend")]
    public ActionResult<ApiResponse<string>> RecommendAgent([FromBody] RecommendAgentRequest request)
    {
        try
        {
            var agentName = _specializedAgentsService.RecommendAgent(request.TaskDescription);
            return Ok(ApiResponse<string>.SuccessResponse(agentName, "Agent recommended"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recommending agent");
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Recommendation failed"));
        }
    }

    /// <summary>
    /// Run agent collaboration
    /// </summary>
    [HttpPost("agents/collaborate")]
    public async Task<ActionResult<ApiResponse<CollaborationResult>>> CollaborateAgents([FromBody] CollaborateRequest request)
    {
        try
        {
            var result = await _specializedAgentsService.CollaborateAsync(request.Task, request.AgentNames);
            return Ok(ApiResponse<CollaborationResult>.SuccessResponse(result, "Collaboration completed"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in agent collaboration");
            return StatusCode(500, ApiResponse<CollaborationResult>.ErrorResponse(ex.Message, "Collaboration failed"));
        }
    }

    /// <summary>
    /// List all available agents
    /// </summary>
    [HttpGet("agents/list")]
    public ActionResult<ApiResponse<List<AgentProfile>>> ListAgents()
    {
        try
        {
            var agents = _specializedAgentsService.ListAgents();
            return Ok(ApiResponse<List<AgentProfile>>.SuccessResponse(agents, "Agents listed"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing agents");
            return StatusCode(500, ApiResponse<List<AgentProfile>>.ErrorResponse(ex.Message, "List failed"));
        }
    }

    // ==================== IMAGE GENERATION (DALL-E) ====================

    /// <summary>
    /// Generate image from text prompt
    /// </summary>
    [HttpPost("image/generate")]
    public async Task<ActionResult<ApiResponse<ImageGenerationResult>>> GenerateImage([FromBody] GenerateImageRequest request)
    {
        try
        {
            var result = await _imageGenerationService.GenerateImageAsync(
                request.Prompt,
                request.Size,
                request.Quality,
                request.Style);

            return Ok(ApiResponse<ImageGenerationResult>.SuccessResponse(result, "Image generated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating image");
            return StatusCode(500, ApiResponse<ImageGenerationResult>.ErrorResponse(ex.Message, "Image generation failed"));
        }
    }

    /// <summary>
    /// Generate product image
    /// </summary>
    [HttpPost("image/product")]
    public async Task<ActionResult<ApiResponse<ImageGenerationResult>>> GenerateProductImage([FromBody] ProductImageRequest request)
    {
        try
        {
            var result = await _imageGenerationService.GenerateProductImageAsync(
                request.ProductName,
                request.ProductDescription,
                request.Style);

            return Ok(ApiResponse<ImageGenerationResult>.SuccessResponse(result, "Product image generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating product image");
            return StatusCode(500, ApiResponse<ImageGenerationResult>.ErrorResponse(ex.Message, "Product image generation failed"));
        }
    }

    /// <summary>
    /// Generate marketing image
    /// </summary>
    [HttpPost("image/marketing")]
    public async Task<ActionResult<ApiResponse<ImageGenerationResult>>> GenerateMarketingImage([FromBody] MarketingImageRequest request)
    {
        try
        {
            var result = await _imageGenerationService.GenerateMarketingImageAsync(request.Campaign, request.Style);
            return Ok(ApiResponse<ImageGenerationResult>.SuccessResponse(result, "Marketing image generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating marketing image");
            return StatusCode(500, ApiResponse<ImageGenerationResult>.ErrorResponse(ex.Message, "Marketing image generation failed"));
        }
    }

    /// <summary>
    /// Generate social media image
    /// </summary>
    [HttpPost("image/social")]
    public async Task<ActionResult<ApiResponse<ImageGenerationResult>>> GenerateSocialImage([FromBody] SocialImageRequest request)
    {
        try
        {
            var result = await _imageGenerationService.GenerateSocialMediaImageAsync(request.Topic, request.Platform);
            return Ok(ApiResponse<ImageGenerationResult>.SuccessResponse(result, "Social media image generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating social image");
            return StatusCode(500, ApiResponse<ImageGenerationResult>.ErrorResponse(ex.Message, "Social image generation failed"));
        }
    }
}

// ==================== REQUEST DTOs ====================

public class AddMemoryRequest
{
    public string ConversationId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class UploadTextRequest
{
    public string Text { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
}

public class SearchKnowledgeRequest
{
    public string Query { get; set; } = string.Empty;
    public int Limit { get; set; } = 5;
    public double MinRelevance { get; set; } = 0.7;
}

public class AskKnowledgeRequest
{
    public string Question { get; set; } = string.Empty;
    public int ContextLimit { get; set; } = 3;
}

public class AgentQueryRequest
{
    public string Query { get; set; } = string.Empty;
}

public class MultipleAgentsRequest
{
    public List<string> AgentNames { get; set; } = new();
    public string Query { get; set; } = string.Empty;
}

public class AllAgentsRequest
{
    public string Query { get; set; } = string.Empty;
}

public class RecommendAgentRequest
{
    public string TaskDescription { get; set; } = string.Empty;
}

public class CollaborateRequest
{
    public string Task { get; set; } = string.Empty;
    public List<string>? AgentNames { get; set; }
}

public class GenerateImageRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string? Size { get; set; }
    public string? Quality { get; set; }
    public string? Style { get; set; }
}

public class ProductImageRequest
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductDescription { get; set; } = string.Empty;
    public string? Style { get; set; }
}

public class MarketingImageRequest
{
    public string Campaign { get; set; } = string.Empty;
    public string? Style { get; set; }
}

public class SocialImageRequest
{
    public string Topic { get; set; } = string.Empty;
    public string Platform { get; set; } = "instagram";
}
