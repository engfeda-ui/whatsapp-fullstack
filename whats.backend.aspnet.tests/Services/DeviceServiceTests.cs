using Microsoft.Extensions.Logging;
using Moq;
using WhatsApp.Backend.Data;
using WhatsApp.Backend.Models.DTOs.Device;
using WhatsApp.Backend.Services;
using Xunit;

namespace whats.backend.aspnet.tests.Services;

public class DeviceServiceTests
{
    private readonly Mock<ApplicationDbContext> _mockContext;
    private readonly Mock<ILogger<DeviceService>> _mockLogger;
    private readonly DeviceService _deviceService;

    public DeviceServiceTests()
    {
        _mockContext = new Mock<ApplicationDbContext>();
        _mockLogger = new Mock<ILogger<DeviceService>>();
        _deviceService = new DeviceService(_mockContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task CreateAsync_Should_Add_Device_To_Context()
    {
        // Arrange
        var request = new CreateDeviceRequest { Name = "Test Device" };
        var userId = "test-user-id";

        // Act
        await _deviceService.CreateAsync(request, userId);

        // Assert
        _mockContext.Verify(x => x.Devices.Add(It.IsAny<WhatsApp.Backend.Data.Entities.Device>()), Times.Once);
        _mockContext.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_Should_Remove_Device_From_Context()
    {
        // Arrange
        var device = new WhatsApp.Backend.Data.Entities.Device { Id = 1, UserId = "test-user-id" };
        _mockContext.Setup(x => x.Devices.FindAsync(1)).ReturnsAsync(device);

        // Act
        var result = await _deviceService.DeleteAsync(1, "test-user-id");

        // Assert
        Assert.True(result);
        _mockContext.Verify(x => x.Devices.Remove(device), Times.Once);
        _mockContext.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_Should_Return_False_If_Device_Not_Found()
    {
        // Arrange
        _mockContext.Setup(x => x.Devices.FindAsync(1)).ReturnsAsync((WhatsApp.Backend.Data.Entities.Device?)null);

        // Act
        var result = await _deviceService.DeleteAsync(1, "test-user-id");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task DeleteAsync_Should_Return_False_If_User_Is_Not_Authorized()
    {
        // Arrange
        var device = new WhatsApp.Backend.Data.Entities.Device { Id = 1, UserId = "other-user-id" };
        _mockContext.Setup(x => x.Devices.FindAsync(1)).ReturnsAsync(device);

        // Act
        var result = await _deviceService.DeleteAsync(1, "test-user-id");

        // Assert
        Assert.False(result);
    }
}
