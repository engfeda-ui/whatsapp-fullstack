#pragma warning disable SKEXP0001

using Microsoft.SemanticKernel.Memory;
using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text;

namespace WhatsApp.Backend.Services.AI;

/// <summary>
/// Service for managing knowledge base with RAG (Retrieval Augmented Generation)
/// Supports PDF and Word document upload and semantic search
/// </summary>
public class KnowledgeBaseService
{
    private readonly ISemanticTextMemory? _semanticMemory;
    private const string KnowledgeCollection = "knowledge_base";
    private readonly Dictionary<string, DocumentMetadata> _documentIndex = new();

    public KnowledgeBaseService(ISemanticTextMemory? semanticMemory = null)
    {
        _semanticMemory = semanticMemory;
    }

    /// <summary>
    /// Upload and index a PDF document
    /// </summary>
    public async Task<string> UploadPdfAsync(Stream pdfStream, string fileName)
    {
        var documentId = Guid.NewGuid().ToString();
        var chunks = ExtractTextFromPdf(pdfStream);

        await IndexDocumentChunksAsync(documentId, fileName, "pdf", chunks);

        _documentIndex[documentId] = new DocumentMetadata
        {
            Id = documentId,
            FileName = fileName,
            FileType = "pdf",
            UploadDate = DateTime.UtcNow,
            ChunkCount = chunks.Count
        };

        return documentId;
    }

    /// <summary>
    /// Upload and index a Word document
    /// </summary>
    public async Task<string> UploadWordAsync(Stream wordStream, string fileName)
    {
        var documentId = Guid.NewGuid().ToString();
        var chunks = ExtractTextFromWord(wordStream);

        await IndexDocumentChunksAsync(documentId, fileName, "docx", chunks);

        _documentIndex[documentId] = new DocumentMetadata
        {
            Id = documentId,
            FileName = fileName,
            FileType = "docx",
            UploadDate = DateTime.UtcNow,
            ChunkCount = chunks.Count
        };

        return documentId;
    }

    /// <summary>
    /// Upload plain text
    /// </summary>
    public async Task<string> UploadTextAsync(string text, string title)
    {
        var documentId = Guid.NewGuid().ToString();
        var chunks = ChunkText(text);

        await IndexDocumentChunksAsync(documentId, title, "text", chunks);

        _documentIndex[documentId] = new DocumentMetadata
        {
            Id = documentId,
            FileName = title,
            FileType = "text",
            UploadDate = DateTime.UtcNow,
            ChunkCount = chunks.Count
        };

        return documentId;
    }

    /// <summary>
    /// Search knowledge base and return relevant information
    /// </summary>
    public async Task<List<KnowledgeSearchResult>> SearchAsync(
        string query,
        int limit = 5,
        double minRelevance = 0.7)
    {
        if (_semanticMemory == null)
        {
            return new List<KnowledgeSearchResult>
            {
                new KnowledgeSearchResult
                {
                    Text = "Knowledge base search is not available. Please configure Azure OpenAI.",
                    Relevance = 0,
                    Source = "System"
                }
            };
        }

        var results = new List<KnowledgeSearchResult>();
        var memories = _semanticMemory.SearchAsync(
            KnowledgeCollection,
            query,
            limit,
            minRelevance);

        await foreach (var memory in memories)
        {
            results.Add(new KnowledgeSearchResult
            {
                Text = memory.Metadata.Text,
                Relevance = memory.Relevance,
                Source = memory.Metadata.Description ?? "Unknown",
                DocumentId = memory.Metadata.Id.Split('_')[0]
            });
        }

        return results;
    }

    /// <summary>
    /// Get answer from knowledge base
    /// </summary>
    public async Task<string> GetAnswerAsync(string question, int contextLimit = 3)
    {
        var relevantChunks = await SearchAsync(question, contextLimit, 0.7);

        if (relevantChunks.Count == 0)
        {
            return "لم أجد معلومات ذات صلة في قاعدة المعرفة.";
        }

        var context = string.Join("\n\n", relevantChunks.Select(r => r.Text));
        var sources = string.Join(", ", relevantChunks.Select(r => r.Source).Distinct());

        return $"بناءً على المعلومات المتاحة:\n\n{context}\n\nالمصادر: {sources}";
    }

    /// <summary>
    /// List all uploaded documents
    /// </summary>
    public List<DocumentMetadata> ListDocuments()
    {
        return _documentIndex.Values.OrderByDescending(d => d.UploadDate).ToList();
    }

    /// <summary>
    /// Delete a document from knowledge base
    /// </summary>
    public async Task<bool> DeleteDocumentAsync(string documentId)
    {
        if (!_documentIndex.ContainsKey(documentId))
        {
            return false;
        }

        // Remove from memory (if available)
        if (_semanticMemory != null)
        {
            // Note: SemanticTextMemory doesn't have built-in delete by prefix
            // In production, you'd implement custom deletion logic
        }

        _documentIndex.Remove(documentId);
        return true;
    }

    // Private helper methods

    private List<string> ExtractTextFromPdf(Stream pdfStream)
    {
        var allText = new StringBuilder();

        try
        {
            using var document = PdfDocument.Open(pdfStream);
            foreach (var page in document.GetPages())
            {
                allText.AppendLine(page.Text);
            }
        }
        catch
        {
            // Fallback for invalid PDFs
            return new List<string> { "Unable to extract text from PDF. File may be corrupted or encrypted." };
        }

        return ChunkText(allText.ToString());
    }

    private List<string> ExtractTextFromWord(Stream wordStream)
    {
        var allText = new StringBuilder();

        try
        {
            using var document = WordprocessingDocument.Open(wordStream, false);
            var body = document.MainDocumentPart?.Document.Body;

            if (body != null)
            {
                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    allText.AppendLine(paragraph.InnerText);
                }
            }
        }
        catch
        {
            return new List<string> { "Unable to extract text from Word document. File may be corrupted." };
        }

        return ChunkText(allText.ToString());
    }

    private List<string> ChunkText(string text, int chunkSize = 1000, int overlap = 200)
    {
        var chunks = new List<string>();
        var words = text.Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);

        var currentChunk = new StringBuilder();
        var currentSize = 0;

        foreach (var word in words)
        {
            if (currentSize + word.Length > chunkSize && currentSize > 0)
            {
                chunks.Add(currentChunk.ToString().Trim());

                // Keep last 'overlap' characters for context
                var overlapText = currentChunk.ToString();
                if (overlapText.Length > overlap)
                {
                    overlapText = overlapText.Substring(overlapText.Length - overlap);
                }

                currentChunk.Clear();
                currentChunk.Append(overlapText);
                currentSize = overlapText.Length;
            }

            currentChunk.Append(word).Append(' ');
            currentSize += word.Length + 1;
        }

        if (currentChunk.Length > 0)
        {
            chunks.Add(currentChunk.ToString().Trim());
        }

        return chunks;
    }

    private async Task IndexDocumentChunksAsync(
        string documentId,
        string fileName,
        string fileType,
        List<string> chunks)
    {
        if (_semanticMemory == null)
        {
            return;
        }

        for (int i = 0; i < chunks.Count; i++)
        {
            await _semanticMemory.SaveInformationAsync(
                collection: KnowledgeCollection,
                text: chunks[i],
                id: $"{documentId}_{i}",
                description: $"{fileName} (Part {i + 1}/{chunks.Count})",
                additionalMetadata: fileType
            );
        }
    }
}

/// <summary>
/// Document metadata
/// </summary>
public class DocumentMetadata
{
    public string Id { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public DateTime UploadDate { get; set; }
    public int ChunkCount { get; set; }
}

/// <summary>
/// Knowledge search result
/// </summary>
public class KnowledgeSearchResult
{
    public string Text { get; set; } = string.Empty;
    public double Relevance { get; set; }
    public string Source { get; set; } = string.Empty;
    public string DocumentId { get; set; } = string.Empty;
}
