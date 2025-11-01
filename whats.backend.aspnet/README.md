# WhatsApp Business Backend - ASP.NET Core with Microsoft Agent Framework

**A production-ready backend API built with ASP.NET Core, Microsoft Semantic Kernel, and AutoGen.Net for advanced AI-powered WhatsApp Business management.**

---

## 🚀 Why This Stack?

This backend leverages the **full power of Microsoft's AI ecosystem**:

| Feature | Capability |
|---------|------------|
| **Semantic Kernel** | Complete AI orchestration and planning |
| **AutoGen.Net** | Multi-agent conversations and collaboration |
| **Azure OpenAI** | GPT-4, GPT-3.5, and other advanced models |
| **Entity Framework Core** | Robust ORM with migrations |
| **ASP.NET Core Identity** | Built-in authentication and authorization |
| **SignalR** | Real-time bidirectional communication |
| **Swagger/OpenAPI** | Interactive API documentation |

---

## ✨ Key Features

### 🤖 AI & Agent Framework

- ✅ **Semantic Kernel** integration for AI planning and execution
- ✅ **AutoGen multi-agent** system for complex conversations
- ✅ **Azure OpenAI** GPT-4 integration
- ✅ **Intelligent chat** assistants
- ✅ **Content generation** and analysis
- ✅ **Sentiment analysis** and intent detection
- ✅ **Automated reply suggestions**
- ✅ **Multi-agent brainstorming**

### 🔐 Authentication & Security

- ✅ **JWT tokens** with refresh token support
- ✅ **ASP.NET Core Identity** for user management
- ✅ **Role-based** authorization
- ✅ **Secure password** hashing
- ✅ **Token encryption** (compatible with Angular frontend)

### 📱 WhatsApp Business Management

- ✅ **Device management** (CRUD operations)
- ✅ **Message sending** (single & bulk)
- ✅ **QR code generation** for device pairing
- ✅ **Session management**
- ✅ **Message history** tracking
- ✅ **Delivery status** monitoring

### 💾 Database & ORM

- ✅ **SQL Server** with Entity Framework Core
- ✅ **Code-first** migrations
- ✅ **Complex relationships** (Users, Devices, Messages, Subscriptions)
- ✅ **Optimized indexes**
- ✅ **Change tracking**

### ⚡ Real-Time Features

- ✅ **SignalR hubs** for live updates
- ✅ **Device status** notifications
- ✅ **Message delivery** tracking
- ✅ **QR code** updates

### 📊 Subscription Management

- ✅ **Plans** and pricing
- ✅ **User subscriptions**
- ✅ **Usage tracking**
- ✅ **Billing management**

---

## 📦 Tech Stack

### Core Technologies

- **Framework**: ASP.NET Core 9.0
- **Language**: C# 13
- **Database**: SQL Server 2019+
- **ORM**: Entity Framework Core 9.0

### AI & Agents

- **Microsoft.SemanticKernel** v1.66.0
- **Microsoft.SemanticKernel.Connectors.AzureOpenAI**
- **AutoGen.Core** v0.2.3
- **AutoGen.OpenAI**

### Authentication & Security

- **Microsoft.AspNetCore.Identity.EntityFrameworkCore**
- **Microsoft.AspNetCore.Authentication.JwtBearer**
- **System.IdentityModel.Tokens.Jwt**

### Real-Time

- **Microsoft.AspNetCore.SignalR**

### Documentation

- **Swashbuckle.AspNetCore** (Swagger/OpenAPI)

---

## 🗂️ Project Structure

```
WhatsApp.Backend/
├── Controllers/              # API endpoints
│   ├── AuthController.cs
│   ├── DeviceController.cs
│   ├── WhatsAppController.cs
│   ├── AgentController.cs    # AI Agent endpoints
│   └── ChatController.cs
│
├── Data/
│   ├── ApplicationDbContext.cs
│   ├── Entities/            # Database models
│   │   ├── User.cs
│   │   ├── Device.cs
│   │   ├── Message.cs
│   │   ├── Plan.cs
│   │   ├── Subscription.cs
│   │   └── RefreshToken.cs
│   └── Migrations/          # EF Core migrations
│
├── Services/
│   ├── Auth/
│   │   ├── IAuthService.cs
│   │   └── AuthService.cs
│   ├── Device/
│   │   ├── IDeviceService.cs
│   │   └── DeviceService.cs
│   ├── WhatsApp/
│   │   ├── IWhatsAppService.cs
│   │   └── WhatsAppService.cs
│   ├── AI/
│   │   ├── ISemanticKernelService.cs
│   │   ├── SemanticKernelService.cs
│   │   ├── IAutoGenService.cs
│   │   └── AutoGenService.cs
│   └── IAgentOrchestrator.cs
│
├── Models/
│   ├── DTOs/                # Data Transfer Objects
│   │   ├── Auth/
│   │   ├── Device/
│   │   ├── Message/
│   │   └── Agent/
│   └── ApiResponse.cs
│
├── Hubs/
│   └── WhatsAppHub.cs       # SignalR hub
│
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
│
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── README.md (this file)
```

---

## 🚀 Getting Started

### Prerequisites

- **NET 9.0 SDK** or higher ([Download](https://dotnet.microsoft.com/download))
- **SQL Server** 2019+ or SQL Server Express ([Download](https://www.microsoft.com/sql-server/sql-server-downloads))
- **Visual Studio 2022** or **VS Code** with C# extension
- **Azure OpenAI** account (or OpenAI API key)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/whatsapp-backend.git
cd whatsapp-backend/WhatsApp.Backend
```

#### 2. Install .NET EF Tool (if not installed)

```bash
dotnet tool install --global dotnet-ef
```

#### 3. Update Configuration

Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WhatsAppBusinessDb;Trusted_Connection=true"
  },
  "Jwt": {
    "Secret": "YOUR-SUPER-SECRET-KEY-AT-LEAST-32-CHARACTERS-LONG",
    "Issuer": "WhatsAppBusinessAPI",
    "Audience": "WhatsAppBusinessClient"
  },
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "YOUR-AZURE-OPENAI-API-KEY",
    "DeploymentName": "gpt-4"
  }
}
```

#### 4. Create Database

```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

#### 5. Run the Application

```bash
dotnet run
```

The API will be available at:

- **HTTPS**: <https://localhost:7001>
- **HTTP**: <http://localhost:5000>
- **Swagger UI**: <https://localhost:7001/swagger>

---

## 🔧 Configuration

### Database Connection

**SQL Server (Production):**

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=your-server;Database=WhatsAppBusinessDb;User Id=your-user;Password=your-password;TrustServerCertificate=true"
}
```

**LocalDB (Development):**

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WhatsAppBusinessDb;Trusted_Connection=true"
}
```

### Azure OpenAI Setup

1. Create Azure OpenAI resource in Azure Portal
2. Deploy a model (GPT-4 or GPT-3.5-Turbo)
3. Copy the endpoint and API key
4. Update `appsettings.json`

### JWT Configuration

⚠️ **Important**: Change the JWT secret before production!

```json
"Jwt": {
  "Secret": "CHANGE-THIS-TO-A-STRONG-RANDOM-KEY-AT-LEAST-32-CHARS",
  "Issuer": "WhatsAppBusinessAPI",
  "Audience": "WhatsAppBusinessClient",
  "ExpirationHours": 1,
  "RefreshExpirationDays": 7
}
```

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |

### Device Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/device` | Create device |
| GET | `/api/device` | Get all user devices |
| GET | `/api/device/{id}` | Get device by ID |
| PUT | `/api/device/{id}` | Update device |
| DELETE | `/api/device/{id}` | Delete device |
| PUT | `/api/device/{id}/regenerate-key` | Regenerate API key |

### WhatsApp

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/whatsapp/qr/{deviceId}` | Get QR code |
| POST | `/api/whatsapp/send` | Send message |
| POST | `/api/whatsapp/send-bulk` | Send bulk messages |
| POST | `/api/whatsapp/{deviceId}/connect` | Connect device |
| POST | `/api/whatsapp/{deviceId}/disconnect` | Disconnect device |

### AI Agents (NEW! 🤖)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent/chat` | Chat with AI assistant |
| POST | `/api/agent/generate-content` | Generate content |
| POST | `/api/agent/analyze` | Analyze message sentiment |
| POST | `/api/agent/suggest-replies` | Get reply suggestions |
| POST | `/api/agent/multi-agent-chat` | Multi-agent conversation |
| POST | `/api/agent/expert-analysis` | Expert analysis |
| POST | `/api/agent/brainstorm` | Brainstorm ideas |

---

## 🤖 Using the Agent Framework

### Example 1: Simple Chat

```bash
curl -X POST https://localhost:7001/api/agent/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve customer engagement?"
  }'
```

### Example 2: Content Generation

```bash
curl -X POST https://localhost:7001/api/agent/generate-content \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a marketing email for a new product launch"
  }'
```

### Example 3: Multi-Agent Conversation

```bash
curl -X POST https://localhost:7001/api/agent/multi-agent-chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help planning a marketing campaign"
  }'
```

**Response:** Multiple AI agents collaborate to provide comprehensive advice!

### Example 4: Reply Suggestions

```bash
curl -X POST https://localhost:7001/api/agent/suggest-replies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am not happy with your service"
  }'
```

**Response:** 3 professional reply options generated by AI!

---

## 🔄 SignalR Real-Time Events

Connect to SignalR hub at `/hubs/whatsapp`:

```typescript
// Angular example
const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7001/hubs/whatsapp', {
    accessTokenFactory: () => this.authService.getToken()
  })
  .build();

// Listen for events
connection.on('DeviceStatusChanged', (deviceId, status) => {
  console.log(`Device ${deviceId} status: ${status}`);
});

connection.on('MessageDelivered', (messageId, status) => {
  console.log(`Message ${messageId} delivered: ${status}`);
});

connection.on('QRCodeUpdated', (deviceId, qrCode) => {
  console.log(`New QR code for device ${deviceId}`);
});
```

---

## 🧪 Testing

### Run Tests

```bash
dotnet test
```

### Test with Swagger

1. Navigate to <https://localhost:7001/swagger>
2. Click "Authorize" and enter JWT token
3. Test any endpoint interactively

### Test with Postman

Import the OpenAPI specification from `/swagger/v1/swagger.json`

---

## 📈 Performance

### Benchmarks

- **Simple API call**: ~50ms
- **Database query**: ~100ms
- **Semantic Kernel chat**: ~1-3s (depends on model)
- **Multi-agent conversation**: ~5-10s (multiple AI calls)

### Optimization Tips

1. **Use caching** for frequently accessed data
2. **Implement request throttling** for AI endpoints
3. **Use async/await** throughout
4. **Enable response compression**
5. **Configure connection pooling** for database

---

## 🚢 Deployment

### Deploy to Azure

```bash
# Install Azure CLI
az login

# Create App Service
az webapp up --name whatsapp-backend --resource-group MyResourceGroup

# Configure connection strings in Azure Portal
```

### Deploy to IIS

1. Publish the application: `dotnet publish -c Release`
2. Copy files from `bin/Release/net9.0/publish/` to IIS
3. Create application pool (.NET CLR Version: No Managed Code)
4. Configure web.config
5. Set proper permissions

### Docker (Optional)

**Run with the Angular frontend (recommended):**

```bash
# from the workspace root (../whats.app)
cp .env.example .env          # first time only
docker compose up --build backend frontend
```

**Build backend image only:**

```bash
# Build image
docker build -t whatsapp-backend .

# Run container
docker run -p 5000:8080 whatsapp-backend
```

---

## 🔒 Security Best Practices

⚠️ **Before Production:**

1. ✅ Change JWT secret to a strong random key
2. ✅ Use HTTPS only
3. ✅ Enable rate limiting
4. ✅ Implement request validation
5. ✅ Use Azure Key Vault for secrets
6. ✅ Enable CORS only for trusted origins
7. ✅ Implement logging and monitoring
8. ✅ Regular security audits
9. ✅ Keep packages updated
10. ✅ Use parameterized queries (EF Core handles this)

---

## 📖 Documentation

- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Complete implementation guide
- **[API_REFERENCE.md](API_REFERENCE.md)** - Detailed API documentation
- **[AGENT_GUIDE.md](AGENT_GUIDE.md)** - Using Microsoft Agent Framework
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and private.

---

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Open an issue on GitHub
- **Questions**: Contact support team

---

## 🎉 What's Next?

After setting up the backend, you can:

1. ✅ Connect Angular frontend
2. ✅ Test all AI features
3. ✅ Deploy to production
4. ✅ Monitor performance
5. ✅ Add more agent capabilities
6. ✅ Integrate with other services

---

## 🌟 Features Comparison

| Feature | NestJS Backend | ASP.NET Backend |
|---------|----------------|-----------------|
| Semantic Kernel | ⚠️ Limited | ✅ Full Support |
| AutoGen | ❌ Not Available | ✅ Full Support |
| Multi-Agent | ⚠️ Basic | ✅ Advanced |
| Performance | ✅ Fast | ✅ Faster |
| AI Integration | ⚠️ REST APIs | ✅ Native SDKs |
| Microsoft Ecosystem | ⚠️ Good | ✅ Excellent |
| Future Updates | ⚠️ Slower | ✅ First Priority |

**Result:** ASP.NET Core with Microsoft Agent Framework is the **best choice** for AI-powered applications! 🚀

---

**Built with ❤️ using ASP.NET Core, Semantic Kernel, and AutoGen.Net**

*For questions or support, please open an issue on GitHub.*
