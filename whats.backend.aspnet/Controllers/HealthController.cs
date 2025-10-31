using Microsoft.AspNetCore.Mvc;

namespace WhatsApp.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [Route("/health")]
    public IActionResult GetHealth() => Ok(new { status = "Healthy" });
}
