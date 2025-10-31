import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MessageTemplate, TemplateFormData, TemplatePreview, TemplateFilter, BulkTemplateMessage, QuickReply } from './types/template.types';
import { ApiResponse, QueryOptions } from '../../core/ApiResponse';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private readonly apiUrl = `${environment.apiUrl}/templates`;

    constructor(private http: HttpClient) {}

    /**
     * Get all templates
     */
    getTemplates(filter?: TemplateFilter, options?: QueryOptions): Observable<ApiResponse<MessageTemplate[]>> {
        let params = new HttpParams();

        if (filter?.category) {
            params = params.set('category', filter.category);
        }
        if (filter?.status) {
            params = params.set('status', filter.status);
        }
        if (filter?.language) {
            params = params.set('language', filter.language);
        }
        if (filter?.search) {
            params = params.set('search', filter.search);
        }

        if (options?.pageNumber) {
            params = params.set('page', options.pageNumber.toString());
        }
        if (options?.pageSize) {
            params = params.set('size', options.pageSize.toString());
        }

        return this.http.get<ApiResponse<MessageTemplate[]>>(this.apiUrl, { params });
    }

    /**
     * Get template by ID
     */
    getTemplate(id: string | number): Observable<MessageTemplate> {
        return this.http.get<ApiResponse<MessageTemplate>>(`${this.apiUrl}/${id}`).pipe(map((response) => response.data));
    }

    /**
     * Create new template
     */
    createTemplate(data: TemplateFormData): Observable<MessageTemplate> {
        return this.http.post<ApiResponse<MessageTemplate>>(this.apiUrl, data).pipe(map((response) => response.data));
    }

    /**
     * Update template
     */
    updateTemplate(id: string | number, data: Partial<TemplateFormData>): Observable<MessageTemplate> {
        return this.http.put<ApiResponse<MessageTemplate>>(`${this.apiUrl}/${id}`, data).pipe(map((response) => response.data));
    }

    /**
     * Delete template
     */
    deleteTemplate(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Duplicate template
     */
    duplicateTemplate(id: string | number): Observable<MessageTemplate> {
        return this.http.post<ApiResponse<MessageTemplate>>(`${this.apiUrl}/${id}/duplicate`, {}).pipe(map((response) => response.data));
    }

    /**
     * Preview template with variables
     */
    previewTemplate(templateId: string | number, variables: Record<string, string>): Observable<TemplatePreview> {
        return this.http
            .post<ApiResponse<TemplatePreview>>(`${this.apiUrl}/${templateId}/preview`, {
                variables
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Send bulk messages using template
     */
    sendBulkMessages(data: BulkTemplateMessage): Observable<{
        success: number;
        failed: number;
        jobId: string;
    }> {
        return this.http.post<ApiResponse<{ success: number; failed: number; jobId: string }>>(`${this.apiUrl}/send-bulk`, data).pipe(map((response) => response.data));
    }

    /**
     * Parse template and extract variables
     */
    parseTemplate(content: string): string[] {
        const regex = /\{\{(\w+)\}\}/g;
        const variables: string[] = [];
        let match;

        while ((match = regex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }

        return variables;
    }

    /**
     * Replace variables in template content
     */
    replaceVariables(content: string, variables: Record<string, string>): string {
        let result = content;

        Object.keys(variables).forEach((key) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            result = result.replace(regex, variables[key]);
        });

        return result;
    }

    /**
     * Validate template variables
     */
    validateVariables(template: MessageTemplate, variables: Record<string, string>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        template.variables.forEach((variable) => {
            if (variable.required && !variables[variable.key]) {
                errors.push(`${variable.label} is required`);
            }

            if (variables[variable.key] && variable.validation) {
                const regex = new RegExp(variable.validation);
                if (!regex.test(variables[variable.key])) {
                    errors.push(`${variable.label} format is invalid`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get quick replies
     */
    getQuickReplies(category?: string): Observable<QuickReply[]> {
        let params = new HttpParams();
        if (category) {
            params = params.set('category', category);
        }

        return this.http.get<ApiResponse<QuickReply[]>>(`${this.apiUrl}/quick-replies`, { params }).pipe(map((response) => response.data));
    }

    /**
     * Create quick reply
     */
    createQuickReply(data: Omit<QuickReply, 'id'>): Observable<QuickReply> {
        return this.http.post<ApiResponse<QuickReply>>(`${this.apiUrl}/quick-replies`, data).pipe(map((response) => response.data));
    }

    /**
     * Delete quick reply
     */
    deleteQuickReply(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/quick-replies/${id}`);
    }

    /**
     * Import templates from file
     */
    importTemplates(file: File): Observable<{
        imported: number;
        failed: number;
        errors: string[];
    }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<ApiResponse<{ imported: number; failed: number; errors: string[] }>>(`${this.apiUrl}/import`, formData).pipe(map((response) => response.data));
    }

    /**
     * Export templates
     */
    exportTemplates(format: 'json' | 'csv' | 'excel'): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export`, {
            params: { format },
            responseType: 'blob'
        });
    }

    /**
     * Get template categories
     */
    getCategories(): string[] {
        return ['marketing', 'transactional', 'otp', 'customer_service', 'notification', 'promotional', 'custom'];
    }

    /**
     * Get supported languages
     */
    getLanguages(): { code: string; name: string }[] {
        return [
            { code: 'ar', name: 'العربية' },
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' },
            { code: 'fr', name: 'Français' },
            { code: 'de', name: 'Deutsch' }
        ];
    }
}
