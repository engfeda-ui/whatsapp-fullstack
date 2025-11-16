# Program.cs Updates Required

## Step 1: Add Security Headers Middleware

### Location: After line 12 (after using statements)
Add this import:
```csharp
using WhatsApp.Backend.Middleware;
```

### Location: After line 180 (after error handling middleware)
Replace this section:
```csharp
// Add custom error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
```

With this:
```csharp
// Add custom error handling middleware (must be first)
app.UseMiddleware<ErrorHandlingMiddleware>();

// Add security headers middleware
app.UseMiddleware<SecurityHeadersMiddleware>();

// Conditional HTTPS redirection based on environment
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
```

---

## Step 2: Update CORS Configuration (Optional but Recommended)

### Location: Around line 95 (CORS configuration)
Update the CORS policy to be more restrictive:

```csharp
// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins =
            builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[]
            {
                "http://localhost:4200",
            };

        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("X-Total-Count", "X-Page-Number"); // Expose custom headers if needed
    });
});
```

---

## Step 3: Add Request Size Limits (Optional but Recommended)

### Location: After line 120 (after AddControllers)
Add this:

```csharp
// Add request size limits
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 104857600; // 100 MB
});

builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 104857600; // 100 MB
});
```

---

## Complete Updated Section

Here's the complete updated middleware section:

```csharp
// Configure the HTTP request pipeline
// Enable Swagger for debugging (always available except in staging)
if (!app.Environment.IsEnvironment("Staging"))
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WhatsApp Backend API v1");
        c.RoutePrefix = string.Empty; // Swagger at root
    });
}

// Add custom error handling middleware (must be first)
app.UseMiddleware<ErrorHandlingMiddleware>();

// Add security headers middleware
app.UseMiddleware<SecurityHeadersMiddleware>();

// Conditional HTTPS redirection based on environment
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR Hub
app.MapHub<WhatsAppHub>("/hubs/whatsapp");

app.Run();
```

---

## Verification

After making these changes:

1. Build the project:
   ```bash
   dotnet build
   ```

2. Run the project:
   ```bash
   dotnet run
   ```

3. Check security headers in browser:
   - Open DevTools (F12)
   - Go to Network tab
   - Make a request
   - Check Response Headers for security headers

4. Expected headers:
   - ✅ X-Content-Type-Options: nosniff
   - ✅ X-Frame-Options: DENY
   - ✅ X-XSS-Protection: 1; mode=block
   - ✅ Strict-Transport-Security: max-age=31536000
   - ✅ Content-Security-Policy: ...
   - ✅ Referrer-Policy: strict-origin-when-cross-origin
   - ✅ Permissions-Policy: ...

---

## Notes

- The SecurityHeadersMiddleware must be registered BEFORE UseHttpsRedirection()
- HTTPS redirection is now conditional (only in non-development environments)
- All security headers follow OWASP best practices
- CSP policy is configured to allow necessary resources while blocking unsafe content
