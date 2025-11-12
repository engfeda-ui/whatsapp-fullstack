using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WhatsApp.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        ?? throw new UnauthorizedAccessException("User identifier not found in token.");
}
