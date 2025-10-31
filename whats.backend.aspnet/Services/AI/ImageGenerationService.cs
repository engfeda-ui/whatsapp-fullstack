namespace WhatsApp.Backend.Services.AI;

/// <summary>
/// Simplified service for AI image generation using DALL-E
/// Returns mock/placeholder images until Azure OpenAI is configured
/// </summary>
public class ImageGenerationService
{
    private const string PlaceholderBaseUrl = "https://via.placeholder.com";

    /// <summary>
    /// Generate image from text prompt
    /// </summary>
    public async Task<ImageGenerationResult> GenerateImageAsync(
        string prompt,
        string? size = null,
        string? quality = null,
        string? style = null)
    {
        await Task.Delay(500); // Simulate API call
        return GetMockImageResult(prompt, size ?? "1024x1024");
    }

    /// <summary>
    /// Generate product image
    /// </summary>
    public async Task<ImageGenerationResult> GenerateProductImageAsync(
        string productName,
        string productDescription,
        string? style = null)
    {
        var prompt = $"Professional product photography of {productName}. {productDescription}. " +
                    "High quality, studio lighting, white background, commercial photography.";

        return await GenerateImageAsync(prompt, "1024x1024", "hd", style ?? "natural");
    }

    /// <summary>
    /// Generate marketing image
    /// </summary>
    public async Task<ImageGenerationResult> GenerateMarketingImageAsync(
        string campaign,
        string? style = null)
    {
        var prompt = $"Marketing campaign image for: {campaign}. " +
                    "Eye-catching, professional, suitable for social media and advertising.";

        return await GenerateImageAsync(prompt, "1024x1024", "hd", style ?? "vivid");
    }

    /// <summary>
    /// Generate social media post image
    /// </summary>
    public async Task<ImageGenerationResult> GenerateSocialMediaImageAsync(
        string topic,
        string platform = "instagram")
    {
        var size = platform.ToLower() switch
        {
            "instagram" => "1024x1024",
            "facebook" => "1024x1024",
            "twitter" => "1024x1024",
            _ => "1024x1024"
        };

        var prompt = $"Social media post image about: {topic}. " +
                    $"Optimized for {platform}, engaging, colorful, attention-grabbing.";

        return await GenerateImageAsync(prompt, size, "standard", "vivid");
    }

    /// <summary>
    /// Generate logo concept
    /// </summary>
    public async Task<ImageGenerationResult> GenerateLogoAsync(
        string companyName,
        string industry,
        string? colorScheme = null)
    {
        var prompt = $"Modern professional logo for {companyName}, a {industry} company. " +
                    (colorScheme != null ? $"Color scheme: {colorScheme}. " : "") +
                    "Clean, minimalist, memorable, suitable for business branding.";

        return await GenerateImageAsync(prompt, "1024x1024", "hd", "natural");
    }

    /// <summary>
    /// Generate illustration
    /// </summary>
    public async Task<ImageGenerationResult> GenerateIllustrationAsync(
        string description,
        string? artStyle = null)
    {
        var styleText = artStyle ?? "modern digital illustration";
        var prompt = $"{description}. Art style: {styleText}. High quality, detailed.";

        return await GenerateImageAsync(prompt, "1024x1024", "standard", "vivid");
    }

    /// <summary>
    /// Batch generate multiple variations
    /// </summary>
    public async Task<List<ImageGenerationResult>> GenerateVariationsAsync(
        string basePrompt,
        int count = 3)
    {
        var tasks = new List<Task<ImageGenerationResult>>();

        for (int i = 0; i < count; i++)
        {
            var variedPrompt = $"{basePrompt} (variation {i + 1})";
            tasks.Add(GenerateImageAsync(variedPrompt));
        }

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    /// <summary>
    /// List supported image sizes
    /// </summary>
    public List<string> GetSupportedSizes() => new()
    {
        "1024x1024",
        "1792x1024",
        "1024x1792"
    };

    /// <summary>
    /// List supported quality levels
    /// </summary>
    public List<string> GetSupportedQualities() => new()
    {
        "standard",
        "hd"
    };

    /// <summary>
    /// List supported styles
    /// </summary>
    public List<string> GetSupportedStyles() => new()
    {
        "vivid",
        "natural"
    };

    // Private helper methods

    private ImageGenerationResult GetMockImageResult(string prompt, string size)
    {
        var dimensions = size.Split('x');
        var width = dimensions.Length > 0 ? dimensions[0] : "1024";
        var height = dimensions.Length > 1 ? dimensions[1] : "1024";

        var truncatedPrompt = prompt.Length > 50 ? prompt.Substring(0, 50) : prompt;
        var encodedPrompt = Uri.EscapeDataString(truncatedPrompt);

        // Return placeholder image URL for testing without Azure OpenAI
        return new ImageGenerationResult
        {
            Success = true,
            ImageUrl = $"{PlaceholderBaseUrl}/{width}x{height}.png?text={encodedPrompt}",
            RevisedPrompt = prompt,
            Prompt = prompt,
            GeneratedAt = DateTime.UtcNow,
            IsMock = true
        };
    }
}

/// <summary>
/// Image generation result
/// </summary>
public class ImageGenerationResult
{
    public bool Success { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? RevisedPrompt { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsMock { get; set; } = false;
}
