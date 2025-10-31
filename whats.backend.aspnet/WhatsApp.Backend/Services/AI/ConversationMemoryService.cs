#pragma warning disable SKEXP0001

using System.Collections.Concurrent;
using Microsoft.SemanticKernel.Memory;

namespace WhatsApp.Backend.Services.AI;

/// <summary>
/// Service for managing conversation memory and context
/// Allows AI to remember previous conversations and maintain context
/// </summary>
public class ConversationMemoryService
{
    private readonly ConcurrentDictionary<string, ConversationHistory> _conversations = new();
    private readonly ISemanticTextMemory? _semanticMemory;
    private const int MaxMessagesPerConversation = 50;
    private const int ContextWindowSize = 10; // Last 10 messages

    public ConversationMemoryService(ISemanticTextMemory? semanticMemory = null)
    {
        _semanticMemory = semanticMemory;
    }

    /// <summary>
    /// Add a message to conversation history
    /// </summary>
    public void AddMessage(string conversationId, string role, string message)
    {
        var history = _conversations.GetOrAdd(conversationId, _ => new ConversationHistory());

        history.Messages.Add(new ConversationMessage
        {
            Role = role,
            Content = message,
            Timestamp = DateTime.UtcNow
        });

        // Keep only recent messages to avoid memory overflow
        if (history.Messages.Count > MaxMessagesPerConversation)
        {
            history.Messages.RemoveAt(0);
        }
    }

    /// <summary>
    /// Get conversation context (recent messages)
    /// </summary>
    public string GetContext(string conversationId, int? messageCount = null)
    {
        if (!_conversations.TryGetValue(conversationId, out var history))
        {
            return string.Empty;
        }

        var count = messageCount ?? ContextWindowSize;
        var recentMessages = history.Messages
            .TakeLast(count)
            .Select(m => $"{m.Role}: {m.Content}")
            .ToList();

        return string.Join("\n", recentMessages);
    }

    /// <summary>
    /// Get full conversation history
    /// </summary>
    public List<ConversationMessage> GetHistory(string conversationId)
    {
        return _conversations.TryGetValue(conversationId, out var history)
            ? new List<ConversationMessage>(history.Messages)
            : new List<ConversationMessage>();
    }

    /// <summary>
    /// Clear conversation history
    /// </summary>
    public void ClearConversation(string conversationId)
    {
        _conversations.TryRemove(conversationId, out _);
    }

    /// <summary>
    /// Get summary of conversation
    /// </summary>
    public ConversationSummary GetSummary(string conversationId)
    {
        if (!_conversations.TryGetValue(conversationId, out var history))
        {
            return new ConversationSummary();
        }

        return new ConversationSummary
        {
            ConversationId = conversationId,
            MessageCount = history.Messages.Count,
            StartTime = history.Messages.FirstOrDefault()?.Timestamp,
            LastMessageTime = history.Messages.LastOrDefault()?.Timestamp,
            Participants = history.Messages
                .Select(m => m.Role)
                .Distinct()
                .ToList()
        };
    }

    /// <summary>
    /// Search conversations by content (if semantic memory is available)
    /// </summary>
    public async Task<List<ConversationMessage>> SearchAsync(
        string query,
        int limit = 5,
        double minRelevance = 0.7)
    {
        if (_semanticMemory == null)
        {
            // Fallback to simple text search
            var allMessages = _conversations.Values
                .SelectMany(h => h.Messages)
                .Where(m => m.Content.Contains(query, StringComparison.OrdinalIgnoreCase))
                .Take(limit)
                .ToList();

            return allMessages;
        }

        // Use semantic search if available
        var results = new List<ConversationMessage>();
        var memories = _semanticMemory.SearchAsync(
            "conversations",
            query,
            limit,
            minRelevance);

        await foreach (var memory in memories)
        {
            // Parse memory metadata to reconstruct conversation message
            if (memory.Metadata.AdditionalMetadata != null)
            {
                results.Add(new ConversationMessage
                {
                    Role = memory.Metadata.AdditionalMetadata,
                    Content = memory.Metadata.Text,
                    Timestamp = DateTime.Parse(memory.Metadata.Id)
                });
            }
        }

        return results;
    }

    /// <summary>
    /// Get active conversation count
    /// </summary>
    public int GetActiveConversationCount() => _conversations.Count;

    /// <summary>
    /// Get all conversation IDs
    /// </summary>
    public List<string> GetAllConversationIds() => _conversations.Keys.ToList();

    /// <summary>
    /// Save conversation to semantic memory for long-term storage
    /// </summary>
    public async Task SaveToSemanticMemoryAsync(string conversationId)
    {
        if (_semanticMemory == null || !_conversations.TryGetValue(conversationId, out var history))
        {
            return;
        }

        foreach (var message in history.Messages)
        {
            await _semanticMemory.SaveInformationAsync(
                collection: "conversations",
                text: message.Content,
                id: $"{conversationId}_{message.Timestamp:O}",
                description: $"Message from {message.Role}",
                additionalMetadata: message.Role
            );
        }
    }
}

/// <summary>
/// Conversation history container
/// </summary>
public class ConversationHistory
{
    public List<ConversationMessage> Messages { get; set; } = new();
}

/// <summary>
/// Single conversation message
/// </summary>
public class ConversationMessage
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

/// <summary>
/// Conversation summary
/// </summary>
public class ConversationSummary
{
    public string ConversationId { get; set; } = string.Empty;
    public int MessageCount { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? LastMessageTime { get; set; }
    public List<string> Participants { get; set; } = new();
}
