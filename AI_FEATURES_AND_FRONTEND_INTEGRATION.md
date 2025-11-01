# 🤖 AI Features & Microsoft Agent Framework Frontend Integration Guide

**التاريخ:** نوفمبر 1, 2025
**الإصدار:** 1.0 - Comprehensive Analysis & Integration Plan
**الحالة:** ✅ Ready for Implementation
**اللغة:** Arabic & English

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Available AI Features](#available-ai-features)
3. [Architecture Overview](#architecture-overview)
4. [Frontend Integration Roadmap](#frontend-integration-roadmap)
5. [API Reference](#api-reference)
6. [Implementation Examples](#implementation-examples)
7. [Advanced Features](#advanced-features)
8. [Security & Best Practices](#security--best-practices)
9. [Future Enhancements](#future-enhancements)

---

## 🎯 Executive Summary

The WhatsApp Business application backend has a **production-ready Microsoft Agent Framework** implementation with comprehensive AI capabilities. The framework supports:

- ✅ **Semantic Kernel** (GPT-4 integration via Azure OpenAI)
- ✅ **Multi-Agent System** (AutoGen with 3 collaborative agents)
- ✅ **Specialized Agents** (7 domain experts: Sales, Support, Content, Analytics, Planning, Technical, Assistant)
- ✅ **Conversation Memory** (Context-aware conversations with history)
- ✅ **Knowledge Base (RAG)** (PDF, Word, Text document retrieval)
- ✅ **Image Generation** (DALL-E integration)
- ✅ **WhatsApp Integration** (AI-powered message generation)

**Key Stat:** 15+ API endpoints ready for frontend consumption

---

## 🚀 Available AI Features

### 1. Semantic Kernel Chat (GPT-4)

**Purpose:** Direct chat with OpenAI's GPT-4 model
**Backend Service:** `SemanticKernelService`
**Configuration:** Azure OpenAI credentials in `appsettings.json`

#### Features
- Real-time chat completion
- Conversation context support
- Configurable temperature (0.7 default)
- Token usage tracking
- Message generation for WhatsApp
- Conversation summarization
- Sentiment analysis

#### Request Format
```json
{
  "message": "What are the best practices for WhatsApp marketing?",
  "conversationId": "conv-123",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "response": "Based on WhatsApp marketing best practices...",
    "conversationId": "conv-123",
    "tokensUsed": 250,
    "model": "gpt-4"
  },
  "message": "Chat completed successfully"
}
```

#### Frontend Integration
```typescript
// In Angular service
async chatWithAI(message: string, conversationId?: string): Promise<ChatResponse> {
  const request: ChatRequest = {
    message,
    conversationId: conversationId || this.generateConversationId(),
    temperature: 0.7,
    maxTokens: 1000
  };

  return this.http.post<ApiResponse<ChatResponse>>(
    `${this.apiUrl}/api/agent/chat`,
    request,
    { headers: this.getAuthHeaders() }
  ).toPromise();
}
```

---

### 2. Multi-Agent Collaboration (AutoGen)

**Purpose:** Get multiple perspectives on a task from different agent roles
**Backend Service:** `AutoGenService`
**Agents:** Assistant, Marketing Expert, Customer Service

#### Features
- Agent-to-agent conversation
- Sequential round-robin discussion (up to 5 rounds)
- Consensus building
- Each agent has unique expertise and personality
- Suitable for complex decisions requiring multiple viewpoints

#### Request Format
```json
{
  "task": "Plan a marketing campaign for a new WhatsApp business feature",
  "maxRounds": 5,
  "agentRoles": ["Marketing Expert", "Assistant"]
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "result": "Campaign proposal combining marketing and general insights...",
    "roundsCompleted": 3,
    "conversation": [
      {
        "agent": "Marketing Expert",
        "message": "I recommend targeting SMEs...",
        "round": 1
      },
      {
        "agent": "Assistant",
        "message": "Building on that, we should also...",
        "round": 1
      }
    ]
  }
}
```

#### Use Cases
- Strategic decision making
- Product feature planning
- Campaign strategy
- Issue resolution requiring multiple perspectives
- Problem brainstorming

---

### 3. Specialized Agents (7 Domain Experts)

**Purpose:** Get expert responses from agents specialized in specific domains
**Backend Service:** `SpecializedAgentsService`

#### Available Agents

| Agent | Expertise | Personality | Use Case |
|-------|-----------|-------------|----------|
| **Assistant** (مساعد عام) | General assistance | Helpful, friendly | General questions, guidance |
| **Sales** (خبير مبيعات) | Sales & negotiation | Persuasive, enthusiastic | Sales strategies, pitch creation |
| **Support** (دعم فني) | Problem solving | Patient, empathetic | Customer issues, troubleshooting |
| **Content** (صانع محتوى) | Content creation | Creative, engaging | Social media posts, copywriting |
| **Analytics** (محلل بيانات) | Data analysis | Analytical, precise | Reporting, insights, metrics |
| **Planning** (مخطط) | Strategic planning | Strategic, organized | Roadmaps, project planning |
| **Technical** (خبير تقني) | Technical expertise | Precise, best-practices | Architecture, APIs, implementation |

#### Request Format (Single Agent)
```json
{
  "agentName": "Sales",
  "query": "How should we pitch our WhatsApp marketing feature to enterprise clients?"
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "agentName": "Sales",
    "response": "For enterprise clients, I recommend emphasizing ROI...",
    "confidence": 0.95,
    "expertise": "Sales & Negotiation",
    "timestamp": "2025-11-01T12:00:00Z"
  }
}
```

#### Request Format (Multiple Agents)
```json
{
  "agentNames": ["Sales", "Content", "Technical"],
  "query": "How should we launch our new API feature?"
}
```

#### Response Format
```json
{
  "success": true,
  "data": [
    {
      "agentName": "Sales",
      "response": "Target enterprise segment first...",
      "confidence": 0.92
    },
    {
      "agentName": "Content",
      "response": "Create a blog series covering...",
      "confidence": 0.88
    },
    {
      "agentName": "Technical",
      "response": "Ensure API documentation includes...",
      "confidence": 0.95
    }
  ]
}
```

#### Request Format (Agent Recommendation)
```json
{
  "taskDescription": "We need help creating a social media campaign for our new feature"
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "recommendedAgent": "Content",
    "confidence": 0.98,
    "reasoning": "Content creation and social media expertise matches this task perfectly"
  }
}
```

---

### 4. Conversation Memory & Context

**Purpose:** Maintain conversation history and context awareness
**Backend Service:** `ConversationMemoryService`
**Storage:** In-memory (per conversation max 50 messages)

#### Features
- Automatic conversation history tracking
- Context window retrieval (last 10 messages)
- Conversation summarization
- Memory management with overflow prevention
- Multi-conversation support

#### Add to Memory
```json
{
  "conversationId": "conv-123",
  "role": "user",
  "message": "I need help with WhatsApp integration",
  "metadata": {
    "timestamp": "2025-11-01T12:00:00Z",
    "userId": "user-456"
  }
}
```

#### Get Context
```
GET /api/agent/memory/context/conv-123
Response:
{
  "success": true,
  "data": {
    "conversationId": "conv-123",
    "context": [
      {
        "role": "user",
        "message": "Previous message...",
        "timestamp": "2025-11-01T11:55:00Z"
      },
      ...
    ]
  }
}
```

#### Get Full History
```
GET /api/agent/memory/history/conv-123
Response: [All messages in conversation]
```

#### Clear Memory
```
DELETE /api/agent/memory/clear/conv-123
Response: {"success": true, "message": "Conversation cleared"}
```

---

### 5. Knowledge Base (RAG - Retrieval Augmented Generation)

**Purpose:** Enable AI to answer questions based on company documents
**Backend Service:** `KnowledgeBaseService`
**Supported Formats:** PDF, Word (.docx), Plain Text

#### Features
- Document upload and indexing
- Semantic search in documents
- Answer questions with source citations
- Multi-document support
- Automatic text extraction

#### Upload PDF
```json
{
  "file": "<binary PDF data>",
  "metadata": {
    "title": "WhatsApp API Documentation",
    "category": "Technical"
  }
}
```

#### Upload Word Document
```json
{
  "file": "<binary Word data>",
  "metadata": {
    "title": "Company Policies",
    "category": "Administrative"
  }
}
```

#### Search Knowledge Base
```json
{
  "query": "What is the maximum message size?",
  "limit": 5,
  "threshold": 0.5
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "content": "Maximum message size is 16 MB including media...",
        "source": "WhatsApp API Documentation",
        "relevanceScore": 0.95,
        "pageNumber": 3
      }
    ]
  }
}
```

#### Ask Question (RAG)
```json
{
  "question": "How do we handle customer complaints?",
  "conversationId": "conv-123",
  "maxSources": 3
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "answer": "Based on our documentation, customer complaints should be...",
    "sources": [
      {
        "documentTitle": "Company Policies",
        "excerpt": "Complaint handling procedure...",
        "confidence": 0.92
      }
    ]
  }
}
```

#### List Documents
```
GET /api/agent/knowledge/documents
Response: [
  {
    "id": "doc-1",
    "title": "API Documentation",
    "uploadDate": "2025-11-01T10:00:00Z",
    "pageCount": 25,
    "category": "Technical"
  }
]
```

---

### 6. Image Generation (DALL-E)

**Purpose:** Generate images for marketing and social media
**Backend Service:** `ImageGenerationService`
**Integration:** Azure OpenAI DALL-E 3

#### Features
- Custom image generation
- Product mockup creation
- Marketing material generation
- Social media image templates
- Multiple size options (1024x1024, 1792x1024, 1024x1792)
- Quality levels: standard, hd
- Styles: vivid, natural

#### Generate Custom Image
```json
{
  "prompt": "A modern WhatsApp business dashboard with AI features",
  "style": "vivid",
  "quality": "hd",
  "size": "1024x1024"
}
```

#### Generate Product Image
```json
{
  "productName": "WhatsApp Marketing Suite",
  "description": "AI-powered message automation",
  "style": "vivid",
  "quantity": 3
}
```

#### Generate Marketing Image
```json
{
  "campaignName": "Q4 Product Launch",
  "theme": "Modern, Professional, Tech-focused",
  "size": "1792x1024"
}
```

#### Generate Social Media Image
```json
{
  "platform": "instagram",
  "caption": "Supercharge your WhatsApp business with AI",
  "theme": "Trending, Eye-catching",
  "style": "vivid"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://...generated-image.png",
    "size": "1024x1024",
    "createdAt": "2025-11-01T12:00:00Z",
    "prompt": "Original prompt used"
  }
}
```

---

## 🏗️ Architecture Overview

### Service Layer Structure

```
┌─────────────────────────────────────────────┐
│        Angular Frontend (whats.frontend)     │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST + JWT Token
                   ▼
┌─────────────────────────────────────────────┐
│      ASP.NET Core Backend (API Layer)        │
│              AgentController                 │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    ┌─────────┐ ┌──────────┐ ┌─────────────────┐
    │ Semantic│ │ AutoGen  │ │  Specialized    │
    │ Kernel  │ │ Service  │ │  Agents Service │
    └──────┬──┘ └────┬─────┘ └────────┬────────┘
           │         │                 │
           └─────────┼─────────────────┘
                     ▼
        ┌────────────────────────────┐
        │ Conversation Memory Service │
        │ Knowledge Base Service      │
        │ Image Generation Service    │
        └────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │    Azure OpenAI (GPT-4)     │
        │    DALL-E (Image Gen)       │
        └────────────────────────────┘
```

### Request/Response Flow

```
1. Frontend sends request with JWT Token
   ↓
2. Authorization middleware validates JWT
   ↓
3. Request routed to AgentController
   ↓
4. Controller selects appropriate service:
   - SemanticKernelService (for chat)
   - AutoGenService (for multi-agent)
   - SpecializedAgentsService (for experts)
   - KnowledgeBaseService (for RAG)
   - ImageGenerationService (for images)
   ↓
5. Service processes request:
   - Formats prompts
   - Manages context/memory
   - Calls Azure OpenAI API
   ↓
6. Response stored in ConversationMemoryService (if applicable)
   ↓
7. Response wrapped in ApiResponse<T>
   ↓
8. JSON response sent to Frontend
   ↓
9. Frontend displays result to user
```

### Key Services

#### ISemanticKernelService
- **Purpose:** Direct OpenAI integration
- **Methods:**
  - `ChatAsync(ChatRequest)` - Single turn chat
  - `GenerateMessageAsync(prompt, context)` - Message generation
  - `SummarizeConversationAsync(text)` - Summarization
  - `AnalyzeSentimentAsync(text)` - Sentiment analysis

#### IAutoGenService
- **Purpose:** Multi-agent collaboration
- **Methods:**
  - `RunMultiAgentConversationAsync(task, maxRounds)` - Collaborative discussion
  - `GetCollaborativeResponseAsync(task, agents)` - Get multiple perspectives

#### SpecializedAgentsService
- **Purpose:** Domain-specific expertise
- **Methods:**
  - `GetAgentResponseAsync(agentName, query)` - Single agent
  - `GetMultipleAgentResponsesAsync(names, query)` - Multiple agents
  - `GetRecommendedAgentAsync(taskDescription)` - Agent recommendation
  - `GetCollaborationAsync(agents, task)` - Agent collaboration

#### ConversationMemoryService
- **Purpose:** Conversation history management
- **Methods:**
  - `AddAsync(conversationId, role, message)` - Add to memory
  - `GetContextAsync(conversationId, messageCount)` - Get recent context
  - `GetHistoryAsync(conversationId)` - Get full history
  - `ClearAsync(conversationId)` - Clear memory

#### KnowledgeBaseService
- **Purpose:** RAG (Retrieval Augmented Generation)
- **Methods:**
  - `UploadPdfAsync(stream, metadata)` - Upload PDF
  - `UploadWordAsync(stream, metadata)` - Upload Word doc
  - `SearchAsync(query, limit)` - Search documents
  - `AskQuestionAsync(question, conversationId)` - RAG-based Q&A

#### ImageGenerationService
- **Purpose:** DALL-E integration
- **Methods:**
  - `GenerateImageAsync(prompt, style, quality, size)` - Generate custom image
  - `GenerateProductImageAsync(productName, description)` - Product images
  - `GenerateMarketingImageAsync(campaign, theme)` - Marketing images
  - `GenerateSocialImageAsync(platform, caption, theme)` - Social media images

---

## 📱 Frontend Integration Roadmap

### Phase 1: Basic Integration (Week 1-2)

**Goal:** Implement core chat and memory functionality

#### Components to Create
1. **AgentChatComponent**
   - Text input for user messages
   - Conversation display area
   - Typing indicator
   - Error handling

2. **AgentService** (Angular)
   - HTTP methods for chat endpoints
   - Token management
   - Error handling
   - Response formatting

#### Implementation Checklist
- [ ] Create `agent.service.ts`
- [ ] Create `agent-chat.component.ts`
- [ ] Create `agent-chat.component.html`
- [ ] Add styling
- [ ] Test basic chat flow
- [ ] Add token usage display
- [ ] Add conversation ID management
- [ ] Test memory persistence

#### Key Files to Create
```
src/app/
├── core/services/
│   └── agent.service.ts          ← New service
├── pages/
│   └── agent-chat/
│       ├── agent-chat.component.ts       ← New component
│       ├── agent-chat.component.html     ← New template
│       └── agent-chat.component.scss     ← New styles
└── shared/models/
    └── agent-models.ts           ← New interfaces
```

#### Example: AgentService

```typescript
// src/app/core/services/agent.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

interface ChatRequest {
  message: string;
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatResponse {
  response: string;
  conversationId: string;
  tokensUsed: number;
  model: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/agent`;

  // Chat with AI
  chatWithAI(request: ChatRequest) {
    return this.http.post<ApiResponse<ChatResponse>>(
      `${this.apiUrl}/chat`,
      request
    );
  }

  // Add to conversation memory
  addToMemory(conversationId: string, role: string, message: string) {
    return this.http.post(
      `${this.apiUrl}/memory/add`,
      { conversationId, role, message }
    );
  }

  // Get conversation context
  getContext(conversationId: string) {
    return this.http.get(
      `${this.apiUrl}/memory/context/${conversationId}`
    );
  }

  // Get full history
  getHistory(conversationId: string) {
    return this.http.get(
      `${this.apiUrl}/memory/history/${conversationId}`
    );
  }

  // Clear conversation
  clearMemory(conversationId: string) {
    return this.http.delete(
      `${this.apiUrl}/memory/clear/${conversationId}`
    );
  }
}
```

---

### Phase 2: Specialized Agents (Week 3-4)

**Goal:** Implement specialized agent selection and responses

#### Components to Create
1. **AgentSelectorComponent**
   - List of available agents
   - Agent details display
   - Agent selection UI
   - Quick action buttons

2. **AgentResponseComponent**
   - Display single agent response
   - Show confidence level
   - Show expertise area
   - Compare multiple agents

#### Implementation Checklist
- [ ] Create `agent-selector.component.ts`
- [ ] Fetch agent list from backend
- [ ] Display agents with icons/avatars
- [ ] Create individual agent chat interface
- [ ] Create multi-agent comparison view
- [ ] Add agent recommendation feature
- [ ] Test all 7 agents

---

### Phase 3: Knowledge Base Integration (Week 5-6)

**Goal:** Implement document upload and RAG-based Q&A

#### Components to Create
1. **KnowledgeBaseComponent**
   - File upload interface
   - Document list display
   - Search functionality

2. **RAGChatComponent**
   - Ask questions about documents
   - Display answers with sources
   - Citation handling

#### Implementation Checklist
- [ ] Create knowledge base service methods
- [ ] Create file upload UI
- [ ] Implement drag-and-drop upload
- [ ] Display uploaded documents
- [ ] Create search interface
- [ ] Create RAG Q&A interface
- [ ] Display source citations
- [ ] Test with various document types

---

### Phase 4: Advanced Features (Week 7-8)

**Goal:** Implement image generation, multi-agent collaboration, and analytics

#### Components to Create
1. **ImageGeneratorComponent**
   - Image generation form
   - Template selection
   - Size/quality options
   - Image gallery display

2. **MultiAgentComponent**
   - Task input
   - Agent selection
   - Round-by-round discussion display
   - Consensus view

3. **AgentAnalyticsComponent**
   - Token usage tracking
   - Agent performance metrics
   - Conversation analytics

#### Implementation Checklist
- [ ] Create image generation service
- [ ] Create image generator component
- [ ] Test product image generation
- [ ] Test marketing image generation
- [ ] Create multi-agent collaboration UI
- [ ] Display agent conversation rounds
- [ ] Create analytics dashboard
- [ ] Add data visualization

---

## 🔌 API Reference

### Base URL
```
https://your-api-domain.com/api/agent
```

### Authentication
All endpoints require JWT Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Semantic Kernel Endpoints

#### POST /chat
Chat with GPT-4
```bash
curl -X POST https://api.example.com/api/agent/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how can AI help me?",
    "conversationId": "conv-123",
    "temperature": 0.7,
    "maxTokens": 1000
  }'
```

#### POST /generate-message
Generate a message
```bash
curl -X POST https://api.example.com/api/agent/generate-message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Suggest a WhatsApp message to a customer",
    "context": "Customer inquired about pricing"
  }'
```

#### POST /summarize
Summarize a conversation
```bash
curl -X POST https://api.example.com/api/agent/summarize \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationText": "Full conversation text here..."
  }'
```

### Specialized Agents Endpoints

#### GET /agents/list
Get list of all agents
```bash
curl https://api.example.com/api/agent/agents/list \
  -H "Authorization: Bearer <token>"
```

#### POST /agents/{agentName}
Get response from specific agent
```bash
curl -X POST https://api.example.com/api/agent/agents/sales \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How to pitch to enterprise clients?"
  }'
```

#### POST /agents/multiple
Get responses from multiple agents
```bash
curl -X POST https://api.example.com/api/agent/agents/multiple \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "agentNames": ["Sales", "Content", "Technical"],
    "query": "How should we launch our new feature?"
  }'
```

#### POST /agents/recommend
Get agent recommendation for a task
```bash
curl -X POST https://api.example.com/api/agent/agents/recommend \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "taskDescription": "Create social media campaign"
  }'
```

### Memory Endpoints

#### POST /memory/add
Add message to memory
```bash
curl -X POST https://api.example.com/api/agent/memory/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv-123",
    "role": "user",
    "message": "What is your recommendation?"
  }'
```

#### GET /memory/context/{conversationId}
Get conversation context
```bash
curl https://api.example.com/api/agent/memory/context/conv-123 \
  -H "Authorization: Bearer <token>"
```

### Knowledge Base Endpoints

#### POST /knowledge/upload-pdf
Upload PDF document
```bash
curl -X POST https://api.example.com/api/agent/knowledge/upload-pdf \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/document.pdf" \
  -F "metadata={\"title\":\"API Docs\"}"
```

#### POST /knowledge/search
Search knowledge base
```bash
curl -X POST https://api.example.com/api/agent/knowledge/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the API rate limit?",
    "limit": 5,
    "threshold": 0.5
  }'
```

#### POST /knowledge/ask
Ask question using RAG
```bash
curl -X POST https://api.example.com/api/agent/knowledge/ask \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do we handle complaints?",
    "conversationId": "conv-123",
    "maxSources": 3
  }'
```

### Image Generation Endpoints

#### POST /image/generate
Generate custom image
```bash
curl -X POST https://api.example.com/api/agent/image/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A modern AI dashboard interface",
    "style": "vivid",
    "quality": "hd",
    "size": "1024x1024"
  }'
```

#### POST /image/product
Generate product image
```bash
curl -X POST https://api.example.com/api/agent/image/product \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "WhatsApp Suite",
    "description": "AI-powered automation",
    "style": "vivid",
    "quantity": 3
  }'
```

---

## 💡 Implementation Examples

### Example 1: Basic Chat Implementation

#### TypeScript Service
```typescript
// src/app/core/services/agent.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '@env/environment';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private conversationId = this.generateId();
  private messages = new BehaviorSubject<Message[]>([]);

  messages$ = this.messages.asObservable();

  async sendMessage(userMessage: string): Promise<void> {
    // Add user message to UI
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    this.messages.value.push(userMsg);

    try {
      // Send to backend
      const response = await this.http.post<ApiResponse<ChatResponse>>(
        `${environment.apiUrl}/api/agent/chat`,
        {
          message: userMessage,
          conversationId: this.conversationId,
          temperature: 0.7,
          maxTokens: 1000
        }
      ).toPromise();

      if (response?.data) {
        // Add assistant message
        const assistantMsg: Message = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date()
        };
        this.messages.value.push(assistantMsg);

        // Save to memory
        await this.http.post(
          `${environment.apiUrl}/api/agent/memory/add`,
          {
            conversationId: this.conversationId,
            role: 'assistant',
            message: response.data.response
          }
        ).toPromise();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private generateId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

#### Angular Component
```typescript
// src/app/pages/agent-chat/agent-chat.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '@/core/services/agent.service';

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-chat.component.html',
  styleUrls: ['./agent-chat.component.scss']
})
export class AgentChatComponent implements OnInit {
  agentService = inject(AgentService);
  messages$ = this.agentService.messages$;
  isLoading = false;
  userInput = '';

  async onSendMessage(): Promise<void> {
    if (!this.userInput.trim()) return;

    this.isLoading = true;
    const message = this.userInput;
    this.userInput = '';

    try {
      await this.agentService.sendMessage(message);
    } finally {
      this.isLoading = false;
    }
  }
}
```

#### HTML Template
```html
<!-- src/app/pages/agent-chat/agent-chat.component.html -->

<div class="chat-container">
  <div class="messages">
    <div *ngFor="let msg of (messages$ | async)" [class.user]="msg.role === 'user'" class="message">
      <div class="message-content">
        {{ msg.content }}
      </div>
      <div class="message-time">{{ msg.timestamp | date: 'short' }}</div>
    </div>
  </div>

  <div class="input-area">
    <input
      [(ngModel)]="userInput"
      (keyup.enter)="onSendMessage()"
      [disabled]="isLoading"
      placeholder="Ask the AI something..."
      class="input"
    />
    <button
      (click)="onSendMessage()"
      [disabled]="isLoading || !userInput.trim()"
      class="send-btn"
    >
      {{ isLoading ? 'Sending...' : 'Send' }}
    </button>
  </div>
</div>
```

---

### Example 2: Specialized Agents Selection

#### Component
```typescript
// src/app/pages/specialized-agents/specialized-agents.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

interface AgentProfile {
  name: string;
  displayName: string;
  expertise: string;
  personality: string;
}

@Component({
  selector: 'app-specialized-agents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="agents-container">
      <h2>Specialized Agents</h2>

      <div class="agents-grid">
        <div
          *ngFor="let agent of agents"
          (click)="selectAgent(agent)"
          [class.selected]="selectedAgent?.name === agent.name"
          class="agent-card"
        >
          <h3>{{ agent.displayName }}</h3>
          <p class="expertise">{{ agent.expertise }}</p>
          <p class="personality">{{ agent.personality }}</p>
        </div>
      </div>

      <div *ngIf="selectedAgent" class="query-section">
        <h3>Ask {{ selectedAgent.displayName }}</h3>
        <textarea
          [(ngModel)]="queryText"
          placeholder="Enter your question..."
        ></textarea>
        <button (click)="askAgent()" [disabled]="isLoading">
          {{ isLoading ? 'Processing...' : 'Get Response' }}
        </button>
      </div>

      <div *ngIf="agentResponse" class="response-section">
        <p>{{ agentResponse.response }}</p>
        <small>Confidence: {{ (agentResponse.confidence * 100).toFixed(0) }}%</small>
      </div>
    </div>
  `,
  styles: [`
    .agents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .agent-card {
      padding: 1rem;
      border: 2px solid #ccc;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .agent-card:hover, .agent-card.selected {
      border-color: #007bff;
      background-color: #f0f8ff;
    }
    .query-section {
      margin: 2rem 0;
    }
    textarea {
      width: 100%;
      height: 100px;
      margin: 1rem 0;
    }
    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class SpecializedAgentsComponent implements OnInit {
  private http = inject(HttpClient);

  agents: AgentProfile[] = [];
  selectedAgent: AgentProfile | null = null;
  queryText = '';
  isLoading = false;
  agentResponse: any = null;

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.http.get<ApiResponse<AgentProfile[]>>(
      `${environment.apiUrl}/api/agent/agents/list`
    ).subscribe({
      next: (response) => {
        this.agents = response.data || [];
      }
    });
  }

  selectAgent(agent: AgentProfile): void {
    this.selectedAgent = agent;
    this.agentResponse = null;
  }

  async askAgent(): Promise<void> {
    if (!this.selectedAgent || !this.queryText.trim()) return;

    this.isLoading = true;
    try {
      const response = await this.http.post<any>(
        `${environment.apiUrl}/api/agent/agents/${this.selectedAgent.name}`,
        { query: this.queryText }
      ).toPromise();

      this.agentResponse = response?.data;
    } finally {
      this.isLoading = false;
    }
  }
}
```

---

### Example 3: Knowledge Base Q&A

```typescript
// src/app/pages/knowledge-base/knowledge-base.component.ts

@Component({
  selector: 'app-knowledge-base',
  template: `
    <div class="kb-container">
      <h2>Knowledge Base Q&A</h2>

      <!-- Upload Section -->
      <div class="upload-section">
        <input
          type="file"
          #fileInput
          (change)="onFileSelected($event)"
          accept=".pdf,.docx,.txt"
        />
        <button (click)="uploadFile()" [disabled]="!selectedFile || isUploading">
          {{ isUploading ? 'Uploading...' : 'Upload Document' }}
        </button>
      </div>

      <!-- Documents List -->
      <div *ngIf="documents.length > 0" class="documents-section">
        <h3>Uploaded Documents</h3>
        <ul>
          <li *ngFor="let doc of documents">
            {{ doc.title }} ({{ doc.pageCount }} pages)
          </li>
        </ul>
      </div>

      <!-- Q&A Section -->
      <div class="qa-section">
        <h3>Ask a Question</h3>
        <textarea
          [(ngModel)]="question"
          placeholder="Ask about your documents..."
        ></textarea>
        <button (click)="askQuestion()" [disabled]="isLoading">
          {{ isLoading ? 'Processing...' : 'Get Answer' }}
        </button>
      </div>

      <!-- Answer Section -->
      <div *ngIf="answer" class="answer-section">
        <h4>Answer</h4>
        <p>{{ answer }}</p>
        <div *ngIf="sources.length > 0" class="sources">
          <h5>Sources</h5>
          <ul>
            <li *ngFor="let source of sources">
              {{ source.documentTitle }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class KnowledgeBaseComponent {
  // Implementation...
}
```

---

## 🎯 Advanced Features

### 1. Agent Recommendation System

The backend includes intelligent agent recommendation based on task description:

```typescript
// Get recommended agent for a task
async getRecommendedAgent(taskDescription: string): Promise<string> {
  const response = await this.http.post<any>(
    `${environment.apiUrl}/api/agent/agents/recommend`,
    { taskDescription }
  ).toPromise();
  return response?.data?.recommendedAgent;
}

// Use recommended agent
async askRecommendedAgent(task: string): Promise<void> {
  const agent = await this.getRecommendedAgent(task);
  // Now use that agent for the response
}
```

### 2. Multi-Agent Collaboration

Get different perspectives on a topic from multiple agents:

```typescript
async getMultiAgentResponse(task: string, agents: string[]): Promise<any[]> {
  return this.http.post<any>(
    `${environment.apiUrl}/api/agent/agents/multiple`,
    { agentNames: agents, query: task }
  ).toPromise();
}
```

### 3. Conversation Context Management

Maintain context across multiple turns:

```typescript
async chatWithContext(
  message: string,
  conversationId: string
): Promise<string> {
  // Add user message to memory
  await this.addToMemory(conversationId, 'user', message);

  // Get context
  const context = await this.getContext(conversationId);

  // Chat with context
  const response = await this.chatWithAI({
    message,
    conversationId,
    context: context // Backend uses this for better responses
  });

  // Save response to memory
  await this.addToMemory(conversationId, 'assistant', response.response);

  return response.response;
}
```

---

## 🔐 Security & Best Practices

### 1. Token Management
- Always include JWT token in Authorization header
- Refresh tokens when expired
- Never expose API keys in frontend code
- Use environment variables for API URLs

### 2. Input Validation
```typescript
// Validate user input before sending to API
if (!message || message.trim().length === 0) {
  return; // Don't send empty messages
}

if (message.length > 5000) {
  console.warn('Message too long');
  return;
}
```

### 3. Error Handling
```typescript
try {
  const response = await this.chatWithAI(message);
  // Handle success
} catch (error: any) {
  if (error.status === 401) {
    // Token expired - refresh and retry
    this.refreshToken();
  } else if (error.status === 403) {
    // Unauthorized - navigate to login
    this.router.navigate(['/login']);
  } else {
    // Other error
    this.showError(error.message);
  }
}
```

### 4. Rate Limiting
```typescript
// Implement client-side rate limiting
private lastRequestTime = 0;
private minTimeBetweenRequests = 500; // ms

async sendMessage(message: string): Promise<void> {
  const now = Date.now();
  if (now - this.lastRequestTime < this.minTimeBetweenRequests) {
    console.warn('Too many requests, please wait');
    return;
  }
  this.lastRequestTime = now;
  // Send request...
}
```

### 5. Memory Management
- Clear old conversations periodically
- Implement conversation expiration
- Don't store sensitive data in memory
- Use secure storage for tokens

---

## 🚀 Future Enhancements

### Phase 5: Advanced Plugins (Week 9-10)

**Planned Features:**
- Weather plugin
- Calendar integration
- Database query plugin
- Translation plugin
- Web search plugin

### Phase 6: Workflow Automation (Week 11-12)

**Planned Features:**
- Auto-response rules
- Lead qualification automation
- Customer segmentation
- Scheduled messaging
- Workflow templates

### Phase 7: Integration Features (Week 13-14)

**Planned Features:**
- Salesforce integration
- HubSpot integration
- Custom CRM integration
- Slack notifications
- Microsoft Teams integration

### Phase 8: Advanced AI (Week 15+)

**Planned Features:**
- Speech-to-text
- Text-to-speech
- Vision AI (image analysis)
- Named entity recognition (NER)
- Sentiment analysis dashboard
- Predictive analytics

---

## 📊 Configuration Reference

### appsettings.json

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-api-key",
    "DeploymentName": "gpt-4",
    "EmbeddingDeploymentName": "text-embedding-3-large",
    "ModelId": "gpt-4"
  },
  "SemanticKernel": {
    "EnablePlugins": true,
    "MaxTokens": 1000,
    "Temperature": 0.7
  },
  "AutoGen": {
    "MaxRounds": 5,
    "EnableMultiAgent": true
  }
}
```

---

## 📚 Additional Resources

### Backend Documentation
- Location: `whats.backend.aspnet/`
- Key Files:
  - `Services/AI/SemanticKernelService.cs`
  - `Services/AI/AutoGenService.cs`
  - `Services/AI/SpecializedAgentsService.cs`
  - `Controllers/AgentController.cs`
  - `Controllers/AgentController.Extended.cs`

### Frontend Integration Examples
- See `src/app/pages/` for component examples
- See `src/app/core/services/` for service patterns

### API Documentation
- Swagger/OpenAPI available at: `/swagger`
- Interactive API testing: `/swagger/ui`

---

## ✅ Checklist for Implementation

### Before Starting Development
- [ ] Understand all 6 AI feature categories
- [ ] Review backend AgentController
- [ ] Configure Azure OpenAI credentials
- [ ] Set up JWT token handling
- [ ] Review security requirements

### Phase 1 Implementation
- [ ] Create `agent.service.ts`
- [ ] Create chat component
- [ ] Test basic chat flow
- [ ] Implement memory management
- [ ] Add error handling

### Phase 2 Implementation
- [ ] Create agent selector component
- [ ] Fetch and display agents
- [ ] Implement single agent chat
- [ ] Implement multi-agent display
- [ ] Add agent recommendation

### Phase 3 Implementation
- [ ] Create knowledge base service
- [ ] Implement file upload
- [ ] Create document management
- [ ] Implement search UI
- [ ] Test RAG functionality

### Phase 4 Implementation
- [ ] Implement image generation
- [ ] Create image gallery
- [ ] Implement multi-agent collaboration
- [ ] Create analytics dashboard
- [ ] Add data visualization

---

## 🎓 Learning Resources

1. **Semantic Kernel Documentation**
   - https://learn.microsoft.com/semantic-kernel/

2. **AutoGen Documentation**
   - https://microsoft.github.io/autogen/

3. **Azure OpenAI**
   - https://learn.microsoft.com/azure/ai-services/openai/

4. **Angular Best Practices**
   - https://angular.io/guide/styleguide

5. **RxJS Patterns**
   - https://rxjs.dev/guide/subject

---

## 📞 Support & Questions

For questions or issues:
1. Review this guide thoroughly
2. Check backend code examples
3. Review API documentation
4. Test endpoints with Swagger
5. Check browser console for errors
6. Review network requests in DevTools

---

**Document Version:** 1.0
**Last Updated:** November 1, 2025
**Status:** ✅ Production Ready
**Maintained by:** Development Team
