using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace WhatsApp.Backend.Services.AI;

/// <summary>
/// Service for managing specialized AI agents
/// Each agent has unique expertise and personality
/// </summary>
public class SpecializedAgentsService
{
    private readonly Kernel? _kernel;
    private readonly Dictionary<string, AgentProfile> _agents;

    public SpecializedAgentsService(Kernel? kernel = null)
    {
        _kernel = kernel;
        _agents = InitializeAgents();
    }

    /// <summary>
    /// Get response from a specific agent
    /// </summary>
    public async Task<AgentResponse> GetAgentResponseAsync(string agentName, string query)
    {
        if (!_agents.TryGetValue(agentName, out var agent))
        {
            return new AgentResponse
            {
                AgentName = "System",
                Response = $"Agent '{agentName}' not found",
                Confidence = 0
            };
        }

        if (_kernel == null)
        {
            return GetMockResponse(agent, query);
        }

        try
        {
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var chatHistory = new ChatHistory();

            // Add agent's system prompt
            chatHistory.AddSystemMessage(agent.SystemPrompt);
            chatHistory.AddUserMessage(query);

            var response = await chatService.GetChatMessageContentAsync(chatHistory);

            return new AgentResponse
            {
                AgentName = agent.Name,
                Response = response.Content ?? "No response",
                Confidence = 0.9,
                Expertise = agent.Expertise,
                Timestamp = DateTime.UtcNow
            };
        }
        catch
        {
            return GetMockResponse(agent, query);
        }
    }

    /// <summary>
    /// Get responses from multiple agents
    /// </summary>
    public async Task<List<AgentResponse>> GetMultipleAgentResponsesAsync(
        List<string> agentNames,
        string query)
    {
        var tasks = agentNames.Select(name => GetAgentResponseAsync(name, query));
        var responses = await Task.WhenAll(tasks);
        return responses.ToList();
    }

    /// <summary>
    /// Get responses from all agents
    /// </summary>
    public async Task<List<AgentResponse>> GetAllAgentResponsesAsync(string query)
    {
        var allAgentNames = _agents.Keys.ToList();
        return await GetMultipleAgentResponsesAsync(allAgentNames, query);
    }

    /// <summary>
    /// Get best agent for a specific task
    /// </summary>
    public string RecommendAgent(string taskDescription)
    {
        var lowerTask = taskDescription.ToLower();

        if (lowerTask.Contains("sell") || lowerTask.Contains("price") || lowerTask.Contains("deal"))
            return "Sales";

        if (lowerTask.Contains("problem") || lowerTask.Contains("help") || lowerTask.Contains("support"))
            return "Support";

        if (lowerTask.Contains("write") || lowerTask.Contains("content") || lowerTask.Contains("post"))
            return "Content";

        if (lowerTask.Contains("data") || lowerTask.Contains("analytics") || lowerTask.Contains("report"))
            return "Analytics";

        if (lowerTask.Contains("plan") || lowerTask.Contains("strategy") || lowerTask.Contains("roadmap"))
            return "Planning";

        if (lowerTask.Contains("code") || lowerTask.Contains("tech") || lowerTask.Contains("api"))
            return "Technical";

        return "Assistant"; // Default
    }

    /// <summary>
    /// Run agent collaboration (agents discuss and reach consensus)
    /// </summary>
    public async Task<CollaborationResult> CollaborateAsync(string task, List<string>? agentNames = null)
    {
        agentNames ??= new List<string> { "Sales", "Support", "Content" };

        var responses = await GetMultipleAgentResponsesAsync(agentNames, task);

        // Simple consensus: combine all responses
        var combinedResponse = string.Join("\n\n---\n\n", responses.Select(r =>
            $"**{r.AgentName}** ({r.Expertise}):\n{r.Response}"));

        return new CollaborationResult
        {
            Task = task,
            Participants = agentNames,
            IndividualResponses = responses,
            Consensus = combinedResponse,
            CompletedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// List all available agents
    /// </summary>
    public List<AgentProfile> ListAgents() => _agents.Values.ToList();

    // Private methods

    private Dictionary<string, AgentProfile> InitializeAgents()
    {
        return new Dictionary<string, AgentProfile>
        {
            ["Assistant"] = new AgentProfile
            {
                Name = "Assistant",
                DisplayName = "مساعد عام",
                Expertise = "General assistance and information",
                SystemPrompt = @"أنت مساعد AI ذكي ومفيد. تجيب على الأسئلة بوضوح ودقة.
تتحدث العربية بطلاقة وتساعد في جميع المجالات العامة.",
                Personality = "Helpful, friendly, informative"
            },

            ["Sales"] = new AgentProfile
            {
                Name = "Sales",
                DisplayName = "خبير مبيعات",
                Expertise = "Sales, negotiation, deals, pricing",
                SystemPrompt = @"أنت خبير مبيعات محترف. تساعد في:
- إغلاق الصفقات وإقناع العملاء
- تقديم عروض مغرية
- التفاوض على الأسعار
- بناء علاقات طويلة الأمد مع العملاء
أسلوبك حماسي وإيجابي ومركّز على المنفعة للعميل.",
                Personality = "Persuasive, enthusiastic, customer-focused"
            },

            ["Support"] = new AgentProfile
            {
                Name = "Support",
                DisplayName = "دعم فني",
                Expertise = "Customer support, problem-solving, troubleshooting",
                SystemPrompt = @"أنت موظف دعم فني ممتاز. تساعد في:
- حل المشاكل التقنية
- الإجابة على استفسارات العملاء
- تقديم حلول سريعة وفعالة
- التعامل مع الشكاوى بصبر واحترافية
أسلوبك صبور ومتعاطف ومركّز على حل المشكلة.",
                Personality = "Patient, empathetic, solution-oriented"
            },

            ["Content"] = new AgentProfile
            {
                Name = "Content",
                DisplayName = "صانع محتوى",
                Expertise = "Content creation, copywriting, social media",
                SystemPrompt = @"أنت صانع محتوى إبداعي. تساعد في:
- كتابة محتوى جذاب للسوشيال ميديا
- صياغة إعلانات تسويقية
- إنشاء مقالات ومدونات
- كتابة نصوص ترويجية
أسلوبك إبداعي ومبتكر ومؤثر.",
                Personality = "Creative, engaging, persuasive"
            },

            ["Analytics"] = new AgentProfile
            {
                Name = "Analytics",
                DisplayName = "محلل بيانات",
                Expertise = "Data analysis, reporting, insights",
                SystemPrompt = @"أنت محلل بيانات خبير. تساعد في:
- تحليل البيانات واستخراج الرؤى
- إنشاء تقارير تحليلية
- تقديم توصيات مبنية على البيانات
- تفسير الإحصائيات والاتجاهات
أسلوبك تحليلي ودقيق ومبني على الحقائق.",
                Personality = "Analytical, precise, data-driven"
            },

            ["Planning"] = new AgentProfile
            {
                Name = "Planning",
                DisplayName = "مخطط استراتيجي",
                Expertise = "Strategic planning, roadmaps, project management",
                SystemPrompt = @"أنت مخطط استراتيجي محترف. تساعد في:
- وضع الخطط الاستراتيجية
- إنشاء خرائط طريق للمشاريع
- تحديد الأهداف والأولويات
- إدارة الموارد والوقت
أسلوبك منظم واستراتيجي ومركّز على الأهداف طويلة المدى.",
                Personality = "Strategic, organized, goal-oriented"
            },

            ["Technical"] = new AgentProfile
            {
                Name = "Technical",
                DisplayName = "خبير تقني",
                Expertise = "Technical implementation, APIs, architecture",
                SystemPrompt = @"أنت خبير تقني متخصص. تساعد في:
- التصميم المعماري للأنظمة
- تطوير الـ APIs
- حل المشاكل التقنية المعقدة
- اقتراح أفضل الممارسات التقنية
أسلوبك تقني ودقيق ومبني على أفضل الممارسات.",
                Personality = "Technical, precise, best-practices focused"
            }
        };
    }

    private AgentResponse GetMockResponse(AgentProfile agent, string query)
    {
        var mockResponses = new Dictionary<string, string>
        {
            ["Assistant"] = $"كمساعد عام، يمكنني مساعدتك في: {query}. هل تريد المزيد من التفاصيل؟",
            ["Sales"] = $"من منظور المبيعات، هذا فرصة رائعة! بخصوص {query}، أنصح بالتركيز على القيمة المضافة للعميل.",
            ["Support"] = $"دعني أساعدك في حل هذا. بخصوص {query}، الخطوة الأولى هي تحديد المشكلة بدقة.",
            ["Content"] = $"فكرة رائعة! يمكنني كتابة محتوى جذاب عن {query}. سأركز على جعله مؤثراً وملهماً.",
            ["Analytics"] = $"من تحليل البيانات، نحتاج إلى قياس {query} باستخدام مؤشرات أداء محددة.",
            ["Planning"] = $"من الناحية الاستراتيجية، {query} يتطلب خطة مرحلية واضحة. دعني أضع خارطة طريق.",
            ["Technical"] = $"من الناحية التقنية، {query} يمكن تنفيذه باستخدام architecture مناسب وأفضل الممارسات."
        };

        return new AgentResponse
        {
            AgentName = agent.Name,
            Response = mockResponses.GetValueOrDefault(agent.Name, $"[{agent.Name}] Mock response for: {query}"),
            Confidence = 0.7,
            Expertise = agent.Expertise,
            Timestamp = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Agent profile definition
/// </summary>
public class AgentProfile
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Expertise { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string Personality { get; set; } = string.Empty;
}

/// <summary>
/// Single agent response
/// </summary>
public class AgentResponse
{
    public string AgentName { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Expertise { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

/// <summary>
/// Collaboration result from multiple agents
/// </summary>
public class CollaborationResult
{
    public string Task { get; set; } = string.Empty;
    public List<string> Participants { get; set; } = new();
    public List<AgentResponse> IndividualResponses { get; set; } = new();
    public string Consensus { get; set; } = string.Empty;
    public DateTime CompletedAt { get; set; }
}
