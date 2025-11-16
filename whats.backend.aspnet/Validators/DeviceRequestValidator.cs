using FluentValidation;
using WhatsApp.Backend.Models.DTOs.Device;

namespace WhatsApp.Backend.Validators;

/// <summary>
/// Validator for device creation/update requests
/// </summary>
public class DeviceRequestValidator : AbstractValidator<CreateDeviceRequest>
{
    public DeviceRequestValidator()
    {
        // Device name validation
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Device name is required")
            .MinimumLength(2)
            .WithMessage("Device name must be at least 2 characters long")
            .MaximumLength(100)
            .WithMessage("Device name must not exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9\s\-_]+$")
            .WithMessage(
                "Device name can only contain letters, numbers, spaces, hyphens, and underscores"
            );

        // Phone number validation
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Phone number is required")
            .MaximumLength(20)
            .WithMessage("Phone number must not exceed 20 characters")
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Phone number must be a valid E.164 format (e.g., +1234567890)");
    }
}
