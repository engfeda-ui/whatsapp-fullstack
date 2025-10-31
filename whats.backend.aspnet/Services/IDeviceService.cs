using WhatsApp.Backend.Models.DTOs.Device;

namespace WhatsApp.Backend.Services;

public interface IDeviceService
{
    Task<List<DeviceDto>> GetAllAsync(string userId);
    Task<DeviceDto?> GetByIdAsync(int id, string userId);
    Task<DeviceDto> CreateAsync(CreateDeviceRequest request, string userId);
    Task<DeviceDto?> UpdateAsync(int id, UpdateDeviceRequest request, string userId);
    Task<bool> DeleteAsync(int id, string userId);
    Task<string> GetQRCodeAsync(int id, string userId);
    Task<string> RegenerateApiKeyAsync(int id, string userId);
}
