import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, DotNetApiResponse, convertDotNetResponse } from '../ApiResponse';

export interface ChatRequest {
    message: string;
    temperature?: number;
    maxTokens?: number;
}

export interface ChatResponse {
    response: string;
    conversationId: string;
    tokensUsed: number;
}

export interface GenerateMessageRequest {
    prompt: string;
    context?: string;
}

export interface SummarizeRequest {
    conversationText: string;
}

export interface SentimentAnalysisRequest {
    text: string;
}

export interface SentimentAnalysisResponse {
    sentiment: string;
    score: number;
    confidence: number;
}

export interface MultiAgentRequest {
    task: string;
    maxRounds?: number;
}

export interface AgentMessage {
    agentName: string;
    message: string;
}

export interface MultiAgentResponse {
    result: string;
    roundsCompleted: number;
    conversation: AgentMessage[];
}

export interface CollaborativeRequest {
    task: string;
}

export interface AgentResponse {
    agentName: string;
    response: string;
}

export interface CollaborativeResponse {
    responses: AgentResponse[];
}

/**
 * Service for interacting with Microsoft Agent Framework AI features
 * Powered by Semantic Kernel and AutoGen
 */
@Injectable({
    providedIn: 'root'
})
export class AiService {
    private apiUrl = `${environment.apiUrl}/agent`;

    constructor(private http: HttpClient) {}

    /**
     * Chat with AI using Semantic Kernel
     * @param request Chat request with message and optional parameters
     * @returns AI response with conversation ID and token usage
     */
    chat(request: ChatRequest): Observable<ApiResponse<ChatResponse>> {
        return this.http
            .post<DotNetApiResponse<ChatResponse>>(`${this.apiUrl}/chat`, request)
            .pipe(map(convertDotNetResponse));
    }

    /**
     * Generate marketing message using AI
     * @param request Generation request with prompt and optional context
     * @returns Generated message
     */
    generateMessage(request: GenerateMessageRequest): Observable<ApiResponse<string>> {
        return this.http
            .post<DotNetApiResponse<string>>(`${this.apiUrl}/generate-message`, request)
            .pipe(map(convertDotNetResponse));
    }

    /**
     * Summarize a long conversation or text
     * @param request Summarization request with conversation text
     * @returns Summary of the conversation
     */
    summarize(request: SummarizeRequest): Observable<ApiResponse<string>> {
        return this.http
            .post<DotNetApiResponse<string>>(`${this.apiUrl}/summarize`, request)
            .pipe(map(convertDotNetResponse));
    }

    /**
     * Analyze sentiment of a message
     * @param request Sentiment analysis request with text
     * @returns Sentiment analysis result with score and confidence
     */
    analyzeSentiment(request: SentimentAnalysisRequest): Observable<ApiResponse<SentimentAnalysisResponse>> {
        return this.http
            .post<DotNetApiResponse<SentimentAnalysisResponse>>(`${this.apiUrl}/analyze-sentiment`, request)
            .pipe(map(convertDotNetResponse));
    }

    /**
     * Run multi-agent collaboration task (AutoGen-inspired)
     * Multiple AI agents work together to solve a complex task
     * @param request Multi-agent task request
     * @returns Results from multi-agent collaboration with conversation history
     */
    multiAgent(request: MultiAgentRequest): Observable<ApiResponse<MultiAgentResponse>> {
        return this.http
            .post<DotNetApiResponse<MultiAgentResponse>>(`${this.apiUrl}/multi-agent`, request)
            .pipe(map(convertDotNetResponse));
    }

    /**
     * Get responses from multiple specialized agents
     * Each agent (Assistant, Marketing Expert, Customer Service) provides their perspective
     * @param request Collaborative task request
     * @returns Responses from all specialized agents
     */
    collaborative(request: CollaborativeRequest): Observable<ApiResponse<CollaborativeResponse>> {
        return this.http
            .post<DotNetApiResponse<CollaborativeResponse>>(`${this.apiUrl}/collaborative`, request)
            .pipe(map(convertDotNetResponse));
    }

    /**
     * Quick helper method: Ask AI a simple question
     * @param message The question to ask
     * @returns AI response text
     */
    ask(message: string): Observable<string> {
        return this.chat({ message }).pipe(
            map(response => response.data.response)
        );
    }

    /**
     * Quick helper method: Generate a marketing message
     * @param prompt What kind of message to generate
     * @param context Optional context about the product/service
     * @returns Generated marketing message
     */
    quickGenerate(prompt: string, context?: string): Observable<string> {
        return this.generateMessage({ prompt, context }).pipe(
            map(response => response.data)
        );
    }

    /**
     * Quick helper method: Get sentiment of a customer message
     * @param text Customer message text
     * @returns Sentiment ("Positive", "Negative", or "Neutral")
     */
    quickSentiment(text: string): Observable<string> {
        return this.analyzeSentiment({ text }).pipe(
            map(response => response.data.sentiment)
        );
    }
}
