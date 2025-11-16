# FluentValidation Setup Guide

## Step 1: Install NuGet Package

```bash
dotnet add package FluentValidation
dotnet add package FluentValidation.AspNetCore
```

---

## Step 2: Update Program.cs

### Add using statement (at the top):
```csharp
using FluentValidation;
using FluentValidation.AspNetCore;
using WhatsApp.Backend.Validators;
```

### Add FluentValidation registration (after AddControllers):
```csharp
// Add Controllers
builder.Services.AddControllers();

// Add FluentValidation
builder.Services
    .AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters()
    .AddValidatorsFromAssemblyContaining<Program>();
```

---

## Step 3: Create DTOs (if not already created)

### Models/DTOs/Device/CreateDeviceRequest.cs
```csharp
namespace WhatsApp.Backend.Models.DTOs.Device;

public class CreateDeviceRequest
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}
```

### Models/DTOs/Device/UpdateDeviceRequest.cs
```csharp
namespace WhatsApp.Backend.Models.DTOs.Device;

public class UpdateDeviceRequest
{
    public string? Name { get; set; }
    public string? Status { get; set; }
}
```

---

## Step 4: Update Controllers to Use Validators

### Example: AuthController
```csharp
[HttpPost("register")]
[EnableRateLimiting("auth")]
public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(
    [FromBody] RegisterRequest request
)
{
    try
    {
        // Validation is automatic via FluentValidation
        var ipAddress = GetIpAddress();
        var result = await _authService.RegisterAsync(request, ipAddress);

        if (result == null)
        {
            return BadRequest(
                ApiResponse<AuthResponse>.ErrorResponse(
                    "Registration failed. Email may already be in use.",
                    "Registration Failed"
                )
            );
        }

        SetTokenCookie(result.RefreshToken);
        _logger.LogInformation("User registered successfully: {Email}", request.Email);
        return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Registration successful"));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during registration");
        return StatusCode(
            500,
            ApiResponse<AuthResponse>.ErrorResponse(ex.Message, "Internal server error")
        );
    }
}
```

---

## Step 5: Custom Error Response (Optional)

### Create a custom validation failure handler:

```csharp
// In Program.cs, after AddFluentValidation:

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
            );

        var response = new ApiResponse<object>
        {
            IsSuccess = false,
            Message = "Validation failed",
            Errors = errors,
            StatusCode = StatusCodes.Status400BadRequest
        };

        return new BadRequestObjectResult(response);
    };
});
```

---

## Step 6: Testing Validation

### Test with invalid email:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "pass123",
    "fullName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": {
    "Email": ["Email must be a valid email address"]
  },
  "statusCode": 400
}
```

### Test with short password:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123",
    "fullName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": {
    "Password": ["Password must be at least 6 characters long"]
  },
  "statusCode": 400
}
```

### Test with valid data:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "isSuccess": true,
  "message": "Registration successful",
  "data": {
    "token": "...",
    "refreshToken": "...",
    "expiresAt": "..."
  }
}
```

---

## Validators Created

1. ✅ **RegisterRequestValidator**
   - Email validation
   - Password validation (min 6 chars, must contain digit)
   - Full name validation
   - Phone number validation (optional)

2. ✅ **LoginRequestValidator**
   - Email validation
   - Password validation

3. ✅ **DeviceRequestValidator**
   - Device name validation
   - Phone number validation (E.164 format)

4. ✅ **UpdateDeviceRequestValidator**
   - Optional device name validation
   - Optional status validation

---

## Best Practices

1. **Always validate input** - Never trust client data
2. **Use meaningful error messages** - Help users understand what went wrong
3. **Validate on both client and server** - Client validation for UX, server for security
4. **Keep validators focused** - One validator per DTO
5. **Test validators** - Write unit tests for validators
6. **Document validation rules** - Help developers understand requirements

---

## Troubleshooting

### Issue: Validators not being called
**Solution:** Make sure `AddValidatorsFromAssemblyContaining<Program>()` is called

### Issue: Custom error messages not showing
**Solution:** Check that `InvalidModelStateResponseFactory` is configured correctly

### Issue: Validation errors not in expected format
**Solution:** Verify the custom error response handler is registered

---

## Next Steps

1. ✅ Install FluentValidation NuGet packages
2. ✅ Update Program.cs with FluentValidation registration
3. ✅ Create DTOs if not already created
4. ✅ Test validators with curl or Postman
5. ✅ Update API documentation with validation rules
6. ✅ Add unit tests for validators

---

**Status:** Ready for Implementation ✅
