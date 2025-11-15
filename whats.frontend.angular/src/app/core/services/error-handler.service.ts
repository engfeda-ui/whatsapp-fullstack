import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';

export interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly injector = inject(Injector);

    /**
     * Global error handler for uncaught errors
     */
    handleError(error: Error | HttpErrorResponse): void {
        if (error instanceof HttpErrorResponse) {
            this.handleHttpError(error);
        } else {
            this.handleClientError(error);
        }
    }

    /**
     * Handle HTTP errors
     */
    handleHttpError(error: HttpErrorResponse): void {
        const errorData = this.parseErrorResponse(error);
        const errorMessage = this.getErrorMessage(error, errorData);
        const severity = this.getErrorSeverity(error.status);

        this.showErrorNotification(errorMessage, severity, error.status);
        this.logError(error, errorData);
        this.handleErrorSideEffects(error.status);
    }

    /**
     * Handle client-side errors
     */
    handleClientError(error: Error): void {
        const errorMessage = error.message || 'An unexpected error occurred. Please try again later.';

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });

        this.logError(error);
    }

    /**
     * Handle non-HTTP errors
     */
    handleGenericError(error: unknown): Observable<never> {
        const errorMessage = this.extractErrorMessage(error);

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });

        this.logError(error);

        return throwError(() => errorMessage);
    }

    /**
     * Parse error response from API
     */
    private parseErrorResponse(error: HttpErrorResponse): ApiErrorResponse {
        if (error.error instanceof ErrorEvent) {
            return { message: error.error.message };
        }

        return {
            message: error.error?.message || error.message,
            errors: error.error?.errors,
            statusCode: error.status
        };
    }

    /**
     * Get user-friendly error message
     */
    private getErrorMessage(error: HttpErrorResponse, errorData: ApiErrorResponse): string {
        // Use API error message if available
        if (errorData.message) {
            return errorData.message;
        }

        // Use validation errors if available
        if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0]?.[0];
            if (firstError) return firstError;
        }

        // Use status-based messages
        const statusMessages: Record<number, string> = {
            400: 'Bad request. Please check the submitted data.',
            401: 'Session expired. Please sign in again.',
            403: 'You do not have permission to perform this action.',
            404: 'The requested resource was not found.',
            409: 'This resource already exists.',
            422: 'Validation failed. Please check your input.',
            429: 'Too many requests. Please try again later.',
            500: 'The server encountered an internal error.',
            502: 'Bad gateway. Please try again later.',
            503: 'Service unavailable. Please try again later.',
            504: 'Gateway timeout. Please try again later.'
        };

        return statusMessages[error.status] || `Unexpected error (${error.status}): ${error.statusText}`;
    }

    /**
     * Get error severity based on status code
     */
    private getErrorSeverity(status: number): 'error' | 'warn' | 'info' {
        if (status >= 500) return 'error';
        if (status >= 400) return 'warn';
        return 'info';
    }

    /**
     * Show error notification
     */
    private showErrorNotification(message: string, severity: 'error' | 'warn' | 'info', status: number): void {
        const summaryMap: Record<number, string> = {
            400: 'Validation Error',
            401: 'Authentication Error',
            403: 'Authorization Error',
            404: 'Not Found',
            409: 'Conflict',
            422: 'Validation Error',
            429: 'Rate Limited',
            500: 'Server Error',
            502: 'Gateway Error',
            503: 'Service Unavailable',
            504: 'Timeout'
        };

        this.messageService.add({
            severity,
            summary: summaryMap[status] || 'Error',
            detail: message,
            life: 5000,
            sticky: severity === 'error'
        });
    }

    /**
     * Handle error side effects (redirects, etc.)
     */
    private handleErrorSideEffects(status: number): void {
        if (status === 401) {
            // Redirect to login on unauthorized
            this.router.navigate(['/auth/login']);
        } else if (status === 403) {
            // Redirect to access denied page
            this.router.navigate(['/access']);
        }
    }

    /**
     * Extract error message from various error types
     */
    private extractErrorMessage(error: unknown): string {
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message;
        if (typeof error === 'object' && error !== null) {
            const err = error as Record<string, any>;
            return (err['message'] as string) || (err['detail'] as string) || 'An unexpected error occurred.';
        }
        return 'An unexpected error occurred. Please try again later.';
    }

    /**
     * Log error for debugging
     */
    private logError(error: unknown, context?: any): void {
        if (!environment.production) {
            console.error('Error occurred:', error);
            if (context) {
                console.error('Error context:', context);
            }
        }
    }
}
