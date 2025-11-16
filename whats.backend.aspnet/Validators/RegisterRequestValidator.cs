using FluentValidation;
using WhatsApp.Backend.Models.DTOs.Auth;

namespace WhatsApp.Backend.Validators;

/// <summary>
/// Validator for user registration requests
/// </summary>
public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        // Email validation
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Email must be a valid email address")
            .MaximumLength(256)
            .WithMessage("Email must not exceed 256 characters");

        // Password validation
        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long")
            .MaximumLength(100)
            .WithMessage("Password must not exceed 100 characters")
            .Matches(@"[0-9]")
            .WithMessage("Password must contain at least one digit");

        // Full name validation
        RuleFor(x => x.FullName)
            .NotEmpty()
            .WithMessage("Full name is required")
            .MinimumLength(2)
            .WithMessage("Full name must be at least 2 characters long")
            .MaximumLength(200)
            .WithMessage("Full name must not exceed 200 characters")
            .Matches(@"^[a-zA-Z\s'-]+$")
            .WithMessage("Full name can only contain letters, spaces, hyphens, and apostrophes");

        // Phone number validation (optional)
        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20)
            .WithMessage("Phone number must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber))
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Phone number must be a valid E.164 format")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));
    }
}
