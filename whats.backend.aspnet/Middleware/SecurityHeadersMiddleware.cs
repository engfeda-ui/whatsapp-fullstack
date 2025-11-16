namespace WhatsApp.Backend.Middleware;

/// <summary>
/// Middleware to add security headers to HTTP responses
/// Implements OWASP security best practices
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<SecurityHeadersMiddleware> _logger;

    public SecurityHeadersMiddleware(
        RequestDelegate next,
        ILogger<SecurityHeadersMiddleware> logger
    )
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Add security headers
            AddSecurityHeaders(context.Response);
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SecurityHeadersMiddleware");
            throw;
        }
    }

    /// <summary>
    /// Add security headers to response
    /// </summary>
    private static void AddSecurityHeaders(HttpResponse response)
    {
        // Prevent MIME type sniffing
        response.Headers["X-Content-Type-Options"] = "nosniff";

        // Prevent clickjacking attacks
        response.Headers["X-Frame-Options"] = "DENY";

        // Enable XSS protection in older browsers
        response.Headers["X-XSS-Protection"] = "1; mode=block";

        // Enforce HTTPS
        response.Headers["Strict-Transport-Security"] =
            "max-age=31536000; includeSubDomains; preload";

        // Content Security Policy - restrict resource loading
        response.Headers["Content-Security-Policy"] =
            "default-src 'self'; "
            + "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            + "style-src 'self' 'unsafe-inline'; "
            + "img-src 'self' data: https:; "
            + "font-src 'self' data:; "
            + "connect-src 'self' https:; "
            + "frame-ancestors 'none'; "
            + "base-uri 'self'; "
            + "form-action 'self'";

        // Referrer Policy - control referrer information
        response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        // Permissions Policy (formerly Feature Policy)
        response.Headers["Permissions-Policy"] =
            "geolocation=(), "
            + "microphone=(), "
            + "camera=(), "
            + "payment=(), "
            + "usb=(), "
            + "magnetometer=(), "
            + "gyroscope=(), "
            + "accelerometer=()";

        // Remove server header to avoid information disclosure
        response.Headers.Remove("Server");
        response.Headers["Server"] = "WhatsApp API";

        // Disable caching for sensitive content
        response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
        response.Headers["Pragma"] = "no-cache";
        response.Headers["Expires"] = "0";

        // Additional security headers
        response.Headers["X-Permitted-Cross-Domain-Policies"] = "none";
        response.Headers["X-UA-Compatible"] = "IE=edge";
    }
}
