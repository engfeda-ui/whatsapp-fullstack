using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WhatsApp.Backend.Models;
using WhatsApp.Backend.Models.DTOs.Device;
using WhatsApp.Backend.Services;

namespace WhatsApp.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DeviceController : ControllerBase
{
    private readonly IDeviceService _deviceService;
    private readonly ILogger<DeviceController> _logger;

    public DeviceController(IDeviceService deviceService, ILogger<DeviceController> logger)
    {
        _deviceService = deviceService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<DeviceDto>>>> GetAll()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var devices = await _deviceService.GetAllAsync(userId);
            return Ok(ApiResponse<List<DeviceDto>>.SuccessResponse(devices, "Devices retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving devices");
            return StatusCode(500, ApiResponse<List<DeviceDto>>.ErrorResponse(ex.Message, "Failed to retrieve devices"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<DeviceDto>>> GetById(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var device = await _deviceService.GetByIdAsync(id, userId);

            if (device == null)
            {
                return NotFound(ApiResponse<DeviceDto>.ErrorResponse("Device not found", "Not Found"));
            }

            return Ok(ApiResponse<DeviceDto>.SuccessResponse(device, "Device retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving device {DeviceId}", id);
            return StatusCode(500, ApiResponse<DeviceDto>.ErrorResponse(ex.Message, "Failed to retrieve device"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<DeviceDto>>> Create([FromBody] CreateDeviceRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var device = await _deviceService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(GetById), new { id = device.Id },
                ApiResponse<DeviceDto>.SuccessResponse(device, "Device created successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<DeviceDto>.ErrorResponse(ex.Message, "Creation failed"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating device");
            return StatusCode(500, ApiResponse<DeviceDto>.ErrorResponse(ex.Message, "Failed to create device"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<DeviceDto>>> Update(int id, [FromBody] UpdateDeviceRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var device = await _deviceService.UpdateAsync(id, request, userId);

            if (device == null)
            {
                return NotFound(ApiResponse<DeviceDto>.ErrorResponse("Device not found", "Not Found"));
            }

            return Ok(ApiResponse<DeviceDto>.SuccessResponse(device, "Device updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating device {DeviceId}", id);
            return StatusCode(500, ApiResponse<DeviceDto>.ErrorResponse(ex.Message, "Failed to update device"));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var result = await _deviceService.DeleteAsync(id, userId);

            if (!result)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Device not found", "Not Found"));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Device deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting device {DeviceId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse(ex.Message, "Failed to delete device"));
        }
    }

    [HttpGet("{id}/qrcode")]
    public async Task<ActionResult<ApiResponse<string>>> GetQRCode(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var qrCode = await _deviceService.GetQRCodeAsync(id, userId);
            return Ok(ApiResponse<string>.SuccessResponse(qrCode, "QR code generated successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<string>.ErrorResponse(ex.Message, "Not Found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QR code for device {DeviceId}", id);
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Failed to generate QR code"));
        }
    }

    [HttpPost("{id}/regenerate-apikey")]
    public async Task<ActionResult<ApiResponse<string>>> RegenerateApiKey(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();

            var apiKey = await _deviceService.RegenerateApiKeyAsync(id, userId);
            return Ok(ApiResponse<string>.SuccessResponse(apiKey, "API key regenerated successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<string>.ErrorResponse(ex.Message, "Not Found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error regenerating API key for device {DeviceId}", id);
            return StatusCode(500, ApiResponse<string>.ErrorResponse(ex.Message, "Failed to regenerate API key"));
        }
    }
}
