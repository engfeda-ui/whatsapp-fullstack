using FluentValidation;
using WhatsApp.Backend.Models.DTOs.Auth;

namespace WhatsApp.Backend.Validators;

/// <summary>
/// Validator for user login requests
/// </summary>
public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
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
            .WithMessage("Password must not exceed 100 characters");
    }
}
