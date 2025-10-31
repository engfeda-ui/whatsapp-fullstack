using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WhatsApp.Backend.Models;
using WhatsApp.Backend.Models.DTOs.WhatsApp;
using WhatsApp.Backend.Services;

namespace WhatsApp.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WhatsAppController : ControllerBase
{
    private readonly IWhatsAppService _whatsAppService;
    private readonly ILogger<WhatsAppController> _logger;

    public WhatsAppController(IWhatsAppService whatsAppService, ILogger<WhatsAppController> logger)
    {
        _whatsAppService = whatsAppService;
        _logger = logger;
    }

    [HttpPost("send-message")]
    public async Task<ActionResult<ApiResponse<MessageDto>>> SendMessage([FromBody] SendMessageRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var message = await _whatsAppService.SendMessageAsync(request, userId);
            return Ok(ApiResponse<MessageDto>.SuccessResponse(message, "Message sent successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<MessageDto>.ErrorResponse(ex.Message, "Failed to send message"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, ApiResponse<MessageDto>.ErrorResponse(ex.Message, "Failed to send message"));
        }
    }

    [HttpPost("send-media")]
    public async Task<ActionResult<ApiResponse<MessageDto>>> SendMediaMessage([FromBody] SendMediaRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var message = await _whatsAppService.SendMediaMessageAsync(request, userId);
            return Ok(ApiResponse<MessageDto>.SuccessResponse(message, "Media message sent successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<MessageDto>.ErrorResponse(ex.Message, "Failed to send media message"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending media message");
            return StatusCode(500, ApiResponse<MessageDto>.ErrorResponse(ex.Message, "Failed to send media message"));
        }
    }

    [HttpPost("send-bulk")]
    public async Task<ActionResult<ApiResponse<List<MessageDto>>>> SendBulkMessages([FromBody] SendBulkMessagesRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var messages = await _whatsAppService.SendBulkMessagesAsync(
                request.DeviceId,
                request.Recipients,
                request.Message,
                userId);

            return Ok(ApiResponse<List<MessageDto>>.SuccessResponse(
                messages,
                $"{messages.Count} messages sent successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<List<MessageDto>>.ErrorResponse(ex.Message, "Failed to send bulk messages"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending bulk messages");
            return StatusCode(500, ApiResponse<List<MessageDto>>.ErrorResponse(ex.Message, "Failed to send bulk messages"));
        }
    }

    [HttpGet("messages/{deviceId}")]
    public async Task<ActionResult<ApiResponse<List<MessageDto>>>> GetMessages(int deviceId, [FromQuery] int limit = 50)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var messages = await _whatsAppService.GetMessagesAsync(deviceId, userId, limit);
            return Ok(ApiResponse<List<MessageDto>>.SuccessResponse(messages, "Messages retrieved successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<List<MessageDto>>.ErrorResponse(ex.Message, "Failed to retrieve messages"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving messages");
            return StatusCode(500, ApiResponse<List<MessageDto>>.ErrorResponse(ex.Message, "Failed to retrieve messages"));
        }
    }

    [HttpGet("message/{messageId}")]
    public async Task<ActionResult<ApiResponse<MessageDto>>> GetMessageById(int messageId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var message = await _whatsAppService.GetMessageByIdAsync(messageId, userId);

            if (message == null)
            {
                return NotFound(ApiResponse<MessageDto>.ErrorResponse("Message not found", "Not Found"));
            }

            return Ok(ApiResponse<MessageDto>.SuccessResponse(message, "Message retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving message {MessageId}", messageId);
            return StatusCode(500, ApiResponse<MessageDto>.ErrorResponse(ex.Message, "Failed to retrieve message"));
        }
    }
}

public class SendBulkMessagesRequest
{
    public int DeviceId { get; set; }
    public List<string> Recipients { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}
