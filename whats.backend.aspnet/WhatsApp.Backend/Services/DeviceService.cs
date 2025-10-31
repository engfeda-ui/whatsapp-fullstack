using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using WhatsApp.Backend.Data;
using WhatsApp.Backend.Models.DTOs.Device;

namespace WhatsApp.Backend.Services;

public class DeviceService : IDeviceService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DeviceService> _logger;

    public DeviceService(ApplicationDbContext context, ILogger<DeviceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<DeviceDto>> GetAllAsync(string userId)
    {
        var devices = await _context.Devices
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();

        return devices.Select(MapToDto).ToList();
    }

    public async Task<DeviceDto?> GetByIdAsync(int id, string userId)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

        return device == null ? null : MapToDto(device);
    }

    public async Task<DeviceDto> CreateAsync(CreateDeviceRequest request, string userId)
    {
        // Check if phone number already exists for this user
        var existingDevice = await _context.Devices
            .FirstOrDefaultAsync(d => d.PhoneNumber == request.PhoneNumber && d.UserId == userId);

        if (existingDevice != null)
        {
            throw new InvalidOperationException("A device with this phone number already exists");
        }

        var device = new Data.Entities.Device
        {
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            ApiKey = GenerateApiKey(),
            Status = "pending",
            QRCode = GenerateDummyQRCode(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Devices.Add(device);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Device created: {DeviceId} for user {UserId}", device.Id, userId);
        return MapToDto(device);
    }

    public async Task<DeviceDto?> UpdateAsync(int id, UpdateDeviceRequest request, string userId)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

        if (device == null)
        {
            return null;
        }

        if (!string.IsNullOrEmpty(request.Name))
        {
            device.Name = request.Name;
        }

        if (!string.IsNullOrEmpty(request.PhoneNumber))
        {
            device.PhoneNumber = request.PhoneNumber;
        }

        if (request.IsActive.HasValue)
        {
            device.IsActive = request.IsActive.Value;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Device updated: {DeviceId}", device.Id);
        return MapToDto(device);
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

        if (device == null)
        {
            return false;
        }

        _context.Devices.Remove(device);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Device deleted: {DeviceId}", device.Id);
        return true;
    }

    public async Task<string> GetQRCodeAsync(int id, string userId)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

        if (device == null)
        {
            throw new InvalidOperationException("Device not found");
        }

        // Generate a new QR code (in real implementation, this would interact with WhatsApp API)
        var qrCode = GenerateDummyQRCode();
        device.QRCode = qrCode;
        device.Status = "pending";
        await _context.SaveChangesAsync();

        return qrCode;
    }

    public async Task<string> RegenerateApiKeyAsync(int id, string userId)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

        if (device == null)
        {
            throw new InvalidOperationException("Device not found");
        }

        device.ApiKey = GenerateApiKey();
        await _context.SaveChangesAsync();

        _logger.LogInformation("API key regenerated for device: {DeviceId}", device.Id);
        return device.ApiKey;
    }

    // Helper methods
    private static string GenerateApiKey()
    {
        var bytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    private static string GenerateDummyQRCode()
    {
        // In real implementation, this would generate actual WhatsApp QR code
        return $"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }

    private static DeviceDto MapToDto(Data.Entities.Device device)
    {
        return new DeviceDto
        {
            Id = device.Id,
            Name = device.Name,
            PhoneNumber = device.PhoneNumber,
            ApiKey = device.ApiKey,
            QRCode = device.QRCode,
            Status = device.Status,
            CreatedAt = device.CreatedAt,
            LastConnectedAt = device.LastConnectedAt,
            IsActive = device.IsActive,
            UserId = device.UserId
        };
    }
}
