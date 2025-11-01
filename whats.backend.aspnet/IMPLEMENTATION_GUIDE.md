# 🚀 ASP.NET Core Backend with Microsoft Agent Framework

## Complete Implementation Guide

## 📋 Project Overview

This guide will help you build a **production-ready ASP.NET Core backend** with:

- ✅ **Microsoft Semantic Kernel** - Full AI orchestration
- ✅ **AutoGen.Net** - Multi-agent system
- ✅ **Azure OpenAI** - GPT-4 integration
- ✅ **Entity Framework Core** - Database ORM
- ✅ **JWT Authentication** - Secure auth
- ✅ **SignalR** - Real-time updates
- ✅ **Swagger** - API documentation
- ✅ **WhatsApp Integration** - Via external library

---

## 🎯 Why This Stack is Better for Microsoft Agent Framework

| Feature | ASP.NET Core | NestJS |
|---------|--------------|--------|
| **Semantic Kernel** | ✅ Full support | ⚠️ Limited |
| **AutoGen** | ✅ AutoGen.Net | ❌ Not available |
| **Performance** | ✅ Faster | ✅ Fast |
| **Microsoft Integration** | ✅ Native | ⚠️ REST APIs only |
| **Future-proof** | ✅ First-class | ⚠️ Slower updates |

---

## 📦 Packages Already Installed

✅ **Microsoft.EntityFrameworkCore.SqlServer**
✅ **Microsoft.EntityFrameworkCore.Tools**
✅ **Microsoft.AspNetCore.Identity.EntityFrameworkCore**
✅ **Microsoft.AspNetCore.Authentication.JwtBearer**
✅ **Microsoft.SemanticKernel** (v1.66.0)
✅ **Microsoft.SemanticKernel.Connectors.AzureOpenAI**
✅ **AutoGen.Core** (v0.2.3)
✅ **AutoGen.OpenAI**

---

## 🗂️ Project Structure (To Be Created)

```
WhatsApp.Backend/
├── Controllers/
│   ├── AuthController.cs              # Authentication endpoints
│   ├── DeviceController.cs            # Device management
│   ├── WhatsAppController.cs          # WhatsApp integration
│   ├── AgentController.cs             # AI Agent endpoints
│   └── ChatController.cs              # Conversational AI
│
├── Data/
│   ├── ApplicationDbContext.cs        # EF Core context
│   ├── Entities/                      # Database models
│   │   ├── User.cs
│   │   ├── Device.cs
│   │   ├── Message.cs
│   │   ├── Plan.cs
│   │   ├── Subscription.cs
│   │   └── RefreshToken.cs
│   └── Migrations/                    # EF migrations
│
├── Services/
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── IDeviceService.cs
│   ├── DeviceService.cs
│   ├── IWhatsAppService.cs
│   ├── WhatsAppService.cs
│   ├── ISemanticKernelService.cs      # Semantic Kernel
│   ├── SemanticKernelService.cs
│   ├── IAutoGenService.cs             # AutoGen multi-agent
│   ├── AutoGenService.cs
│   └── IAgentOrchestrator.cs          # Agent orchestration
│       └── AgentOrchestrator.cs
│
├── Models/
│   ├── DTOs/                          # Data Transfer Objects
│   │   ├── Auth/
│   │   ├── Device/
│   │   ├── Message/
│   │   └── Agent/
│   └── ApiResponse.cs                 # Standard response
│
├── Hubs/
│   └── WhatsAppHub.cs                 # SignalR hub
│
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
│
├── appsettings.json
├── appsettings.Development.json
└── Program.cs                         # Startup configuration
```

---

## 🚀 Quick Start Commands

### 1. Setup Database

```bash
# Install SQL Server (if not installed)
# Windows: Download from microsoft.com
# Or use SQL Server Express (free)

# Update connection string in appsettings.json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WhatsAppBusinessDb;Trusted_Connection=true"
}
```

### 2. Create Initial Migration

```bash
cd D:/angular/whats.backend.aspnet/WhatsApp.Backend

# Add EF Core tools (if not installed)
dotnet tool install --global dotnet-ef

# Create first migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### 3. Run the Project

```bash
dotnet run
```

**API will be available at:**

- **HTTP**: <https://localhost:7000>
- **HTTPS**: <https://localhost:7001>
- **Swagger**: <https://localhost:7001/swagger>

---

## 🛠️ Implementation Steps

### Phase 1: Database Setup (Priority 1)

#### Step 1.1: Create Entity Models

Create `/Data/Entities/User.cs`:

```csharp
using Microsoft.AspNetCore.Identity;

namespace WhatsApp.Backend.Data.Entities;

public class ApplicationUser : IdentityUser<int>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsEmailVerified { get; set; }
    public DateTime? EmailVerifiedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
```

Create `/Data/Entities/Device.cs`:

```csharp
namespace WhatsApp.Backend.Data.Entities;

public class Device
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string ApiKey { get; set; } = string.Empty;
    public string Status { get; set; } = "disconnected"; // disconnected, connecting, connected, error
    public string? QrCode { get; set; }
    public DateTime? LastConnectedAt { get; set; }
    public string? SessionData { get; set; } // JSON
    public string? WebhookUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
```

*(Similar files for Message, Plan, Subscription, RefreshToken)*

#### Step 1.2: Create DbContext

Create `/Data/ApplicationDbContext.cs`:

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WhatsApp.Backend.Data.Entities;

namespace WhatsApp.Backend.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Device> Devices { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Plan> Plans { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<MessageTemplate> MessageTemplates { get; set; }
    public DbSet<UsageLog> UsageLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure relationships
        builder.Entity<Device>()
            .HasOne(d => d.User)
            .WithMany(u => u.Devices)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>()
            .HasOne(m => m.Device)
            .WithMany(d => d.Messages)
            .HasForeignKey(m => m.DeviceId)
            .OnDelete(DeleteBehavior.Cascade);

        // Add indexes
        builder.Entity<Device>()
            .HasIndex(d => d.ApiKey)
            .IsUnique();

        builder.Entity<Device>()
            .HasIndex(d => d.UserId);

        builder.Entity<Message>()
            .HasIndex(m => m.DeviceId);

        builder.Entity<Message>()
            .HasIndex(m => m.Status);

        builder.Entity<Message>()
            .HasIndex(m => m.CreatedAt);
    }
}
```

---

### Phase 2: Authentication with JWT (Priority 1)

#### Step 2.1: Create Auth DTOs

```csharp
// Models/DTOs/Auth/RegisterRequest.cs
public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

// Models/DTOs/Auth/LoginRequest.cs
public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

// Models/DTOs/Auth/AuthResponse.cs
public class AuthResponse
{
    public UserDto User { get; set; } = null!;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
```

#### Step 2.2: Create Auth Service

```csharp
// Services/IAuthService.cs
public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(int userId);
}

// Services/AuthService.cs
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _configuration = configuration;
        _context = context;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            throw new ApplicationException(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        var tokens = await GenerateTokensAsync(user);

        return new AuthResponse
        {
            User = new UserDto(user),
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken
        };
    }

    private async Task<(string AccessToken, string RefreshToken)> GenerateTokensAsync(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        // Generate refresh token
        var refreshToken = Guid.NewGuid().ToString();

        _context.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return (accessToken, refreshToken);
    }
}
```

---

### Phase 3: Semantic Kernel Integration (Priority 2)

#### Step 3.1: Create Semantic Kernel Service

```csharp
// Services/ISemanticKernelService.cs
public interface ISemanticKernelService
{
    Task<string> ChatAsync(string message, string? conversationId = null);
    Task<string> GenerateContentAsync(string prompt);
    Task<string> AnalyzeMessageAsync(string message);
    Task<List<string>> SuggestRepliesAsync(string message);
}

// Services/SemanticKernelService.cs
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;

public class SemanticKernelService : ISemanticKernelService
{
    private readonly Kernel _kernel;
    private readonly ILogger<SemanticKernelService> _logger;

    public SemanticKernelService(IConfiguration configuration, ILogger<SemanticKernelService> logger)
    {
        _logger = logger;

        // Build Semantic Kernel
        var builder = Kernel.CreateBuilder();

        builder.AddAzureOpenAIChatCompletion(
            deploymentName: configuration["AzureOpenAI:DeploymentName"]!,
            endpoint: configuration["AzureOpenAI:Endpoint"]!,
            apiKey: configuration["AzureOpenAI:ApiKey"]!
        );

        _kernel = builder.Build();
    }

    public async Task<string> ChatAsync(string message, string? conversationId = null)
    {
        var chatFunction = _kernel.CreateFunctionFromPrompt(
            @"You are a helpful WhatsApp Business assistant.
            Respond to the following message in a professional and friendly manner:
            {{$message}}",
            new AzureOpenAIPromptExecutionSettings
            {
                Temperature = 0.7,
                MaxTokens = 500
            }
        );

        var result = await _kernel.InvokeAsync(chatFunction, new()
        {
            ["message"] = message
        });

        return result.ToString();
    }

    public async Task<string> GenerateContentAsync(string prompt)
    {
        var contentFunction = _kernel.CreateFunctionFromPrompt(
            @"Generate professional business content based on:
            {{$prompt}}",
            new AzureOpenAIPromptExecutionSettings
            {
                Temperature = 0.8,
                MaxTokens = 1000
            }
        );

        var result = await _kernel.InvokeAsync(contentFunction, new()
        {
            ["prompt"] = prompt
        });

        return result.ToString();
    }

    public async Task<string> AnalyzeMessageAsync(string message)
    {
        var analysisFunction = _kernel.CreateFunctionFromPrompt(
            @"Analyze the sentiment and intent of this message:
            {{$message}}

            Provide: sentiment (positive/negative/neutral) and intent (question/complaint/praise/other)",
            new AzureOpenAIPromptExecutionSettings
            {
                Temperature = 0.3,
                MaxTokens = 200
            }
        );

        var result = await _kernel.InvokeAsync(analysisFunction, new()
        {
            ["message"] = message
        });

        return result.ToString();
    }

    public async Task<List<string>> SuggestRepliesAsync(string message)
    {
        var suggestionsFunction = _kernel.CreateFunctionFromPrompt(
            @"Suggest 3 professional reply options for this message:
            {{$message}}

            Return as numbered list (1. 2. 3.)",
            new AzureOpenAIPromptExecutionSettings
            {
                Temperature = 0.7,
                MaxTokens = 300
            }
        );

        var result = await _kernel.InvokeAsync(suggestionsFunction, new()
        {
            ["message"] = message
        });

        var suggestions = result.ToString()
            .Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(s => s.StartsWith("1.") || s.StartsWith("2.") || s.StartsWith("3."))
            .Select(s => s.Substring(s.IndexOf('.') + 1).Trim())
            .ToList();

        return suggestions;
    }
}
```

---

### Phase 4: AutoGen Multi-Agent System (Priority 2)

#### Step 4.1: Create AutoGen Service

```csharp
// Services/IAutoGenService.cs
public interface IAutoGenService
{
    Task<string> RunMultiAgentConversationAsync(string userMessage);
    Task<string> AnalyzeWithExpertsAsync(string content);
    Task<List<string>> BrainstormIdeasAsync(string topic);
}

// Services/AutoGenService.cs
using AutoGen.Core;
using AutoGen.OpenAI;

public class AutoGenService : IAutoGenService
{
    private readonly ILogger<AutoGenService> _logger;
    private readonly IConfiguration _configuration;

    public AutoGenService(IConfiguration configuration, ILogger<AutoGenService> logger)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<string> RunMultiAgentConversationAsync(string userMessage)
    {
        // Create OpenAI config
        var config = new OpenAIConfig(
            apiKey: _configuration["AzureOpenAI:ApiKey"]!,
            modelId: _configuration["AzureOpenAI:DeploymentName"]!
        );

        // Create multiple agents
        var assistantAgent = new GPTAgent(
            name: "Assistant",
            systemMessage: "You are a helpful WhatsApp Business assistant.",
            config: config
        );

        var marketingAgent = new GPTAgent(
            name: "MarketingExpert",
            systemMessage: "You are a marketing expert specialized in WhatsApp Business campaigns.",
            config: config
        );

        var customerServiceAgent = new GPTAgent(
            name: "CustomerService",
            systemMessage: "You are a customer service expert for WhatsApp Business.",
            config: config
        );

        // Create group chat
        var groupChat = new GroupChat(
            agents: new[] { assistantAgent, marketingAgent, customerServiceAgent },
            admin: assistantAgent
        );

        // Run conversation
        var result = await groupChat.SendAsync(userMessage, maxRound: 5);

        return result?.GetContent() ?? "No response";
    }

    public async Task<string> AnalyzeWithExpertsAsync(string content)
    {
        // Multi-agent analysis implementation
        // Similar to above but with specialized agents for analysis
        return await Task.FromResult("Analysis from multiple expert agents");
    }

    public async Task<List<string>> BrainstormIdeasAsync(string topic)
    {
        // Multi-agent brainstorming implementation
        return await Task.FromResult(new List<string>
        {
            "Idea 1 from Creative Agent",
            "Idea 2 from Marketing Agent",
            "Idea 3 from Technical Agent"
        });
    }
}
```

---

### Phase 5: Agent Controllers (Priority 2)

#### Step 5.1: Create Agent Controller

```csharp
// Controllers/AgentController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgentController : ControllerBase
{
    private readonly ISemanticKernelService _semanticKernel;
    private readonly IAutoGenService _autoGen;

    public AgentController(
        ISemanticKernelService semanticKernel,
        IAutoGenService autoGen)
    {
        _semanticKernel = semanticKernel;
        _autoGen = autoGen;
    }

    [HttpPost("chat")]
    public async Task<ActionResult<ApiResponse<string>>> Chat([FromBody] ChatRequest request)
    {
        var response = await _semanticKernel.ChatAsync(request.Message, request.ConversationId);
        return ApiResponse<string>.Success(response, "Chat completed");
    }

    [HttpPost("generate-content")]
    public async Task<ActionResult<ApiResponse<string>>> GenerateContent([FromBody] GenerateRequest request)
    {
        var response = await _semanticKernel.GenerateContentAsync(request.Prompt);
        return ApiResponse<string>.Success(response, "Content generated");
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<ApiResponse<string>>> Analyze([FromBody] AnalyzeRequest request)
    {
        var response = await _semanticKernel.AnalyzeMessageAsync(request.Message);
        return ApiResponse<string>.Success(response, "Analysis completed");
    }

    [HttpPost("suggest-replies")]
    public async Task<ActionResult<ApiResponse<List<string>>>> SuggestReplies([FromBody] SuggestRequest request)
    {
        var suggestions = await _semanticKernel.SuggestRepliesAsync(request.Message);
        return ApiResponse<List<string>>.Success(suggestions, "Suggestions generated");
    }

    [HttpPost("multi-agent-chat")]
    public async Task<ActionResult<ApiResponse<string>>> MultiAgentChat([FromBody] ChatRequest request)
    {
        var response = await _autoGen.RunMultiAgentConversationAsync(request.Message);
        return ApiResponse<string>.Success(response, "Multi-agent chat completed");
    }

    [HttpPost("expert-analysis")]
    public async Task<ActionResult<ApiResponse<string>>> ExpertAnalysis([FromBody] AnalyzeRequest request)
    {
        var response = await _autoGen.AnalyzeWithExpertsAsync(request.Content);
        return ApiResponse<string>.Success(response, "Expert analysis completed");
    }

    [HttpPost("brainstorm")]
    public async Task<ActionResult<ApiResponse<List<string>>>> Brainstorm([FromBody] BrainstormRequest request)
    {
        var ideas = await _autoGen.BrainstormIdeasAsync(request.Topic);
        return ApiResponse<List<string>>.Success(ideas, "Brainstorming completed");
    }
}
```

---

### Phase 6: Configuration (Priority 1)

#### Step 6.1: Update appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WhatsAppBusinessDb;Trusted_Connection=true"
  },
  "Jwt": {
    "Secret": "your-super-secret-jwt-key-change-in-production-min-32-chars",
    "Issuer": "WhatsAppBusinessAPI",
    "Audience": "WhatsAppBusinessClient",
    "ExpirationHours": 1,
    "RefreshExpirationDays": 7
  },
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-azure-openai-api-key",
    "DeploymentName": "gpt-4"
  },
  "OpenAI": {
    "ApiKey": "sk-your-openai-api-key"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200"]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

#### Step 6.2: Update Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WhatsApp.Backend.Data;
using WhatsApp.Backend.Data.Entities;
using WhatsApp.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WhatsApp Business API with Microsoft Agent Framework",
        Version = "v1",
        Description = "Complete API with Semantic Kernel and AutoGen.Net"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IWhatsAppService, WhatsAppService>();
builder.Services.AddSingleton<ISemanticKernelService, SemanticKernelService>();
builder.Services.AddSingleton<IAutoGenService, AutoGenService>();

// SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SignalR Hub
app.MapHub<WhatsAppHub>("/hubs/whatsapp");

app.Run();
```

---

## 📝 Next Steps

### Immediate (Required)

1. ☐ **Create all Entity models** in `/Data/Entities/`
2. ☐ **Create ApplicationDbContext.cs**
3. ☐ **Run migrations**: `dotnet ef migrations add InitialCreate`
4. ☐ **Update database**: `dotnet ef database update`
5. ☐ **Create Auth services and controllers**
6. ☐ **Test authentication with Swagger**

### Short Term

7. ☐ **Implement Device management**
8. ☐ **Integrate Semantic Kernel**
9. ☐ **Integrate AutoGen**
10. ☐ **Create Agent controllers**
11. ☐ **Setup SignalR for real-time**

### Long Term

12. ☐ **WhatsApp integration** (external library)
13. ☐ **Message history**
14. ☐ **Subscription system**
15. ☐ **Analytics**

---

## 🎯 Testing the Agent Framework

### Test Semantic Kernel

```bash
curl -X POST https://localhost:7001/api/agent/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my WhatsApp Business marketing?"
  }'
```

### Test AutoGen Multi-Agent

```bash
curl -X POST https://localhost:7001/api/agent/multi-agent-chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a marketing campaign for my new product"
  }'
```

---

## 🔑 Azure OpenAI Setup

1. **Create Azure OpenAI resource** in Azure Portal
2. **Deploy a model** (GPT-4 or GPT-3.5-turbo)
3. **Get API key and endpoint**
4. **Update appsettings.json**

---

## 📚 Resources

- **Semantic Kernel Docs**: <https://learn.microsoft.com/en-us/semantic-kernel/>
- **AutoGen.Net**: <https://microsoft.github.io/autogen/>
- **ASP.NET Core**: <https://learn.microsoft.com/en-us/aspnet/core/>
- **Azure OpenAI**: <https://learn.microsoft.com/en-us/azure/ai-services/openai/>

---

## ✅ Summary

You now have:

- ✅ **Project structure defined**
- ✅ **All packages installed**
- ✅ **Complete implementation guide**
- ✅ **Code examples for all major features**
- ✅ **Semantic Kernel integration**
- ✅ **AutoGen multi-agent system**
- ✅ **JWT authentication**
- ✅ **Database setup guide**

**Estimated time to complete:** 2-3 days of focused work

**Difficulty:** Intermediate to Advanced

**Result:** Production-ready backend with full Microsoft Agent Framework capabilities!

---

**Ready to start coding?** 🚀

Follow the steps above in order, and you'll have a powerful AI-powered backend!
