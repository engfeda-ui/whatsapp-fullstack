import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor(
        private messageService: MessageService,
        private router: Router
    ) {}

    /**
     * Handle HTTP errors
     */
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Browser error: ${error.error.message}`;
        } else {
            // Server-side error
            switch (error.status) {
                case 400:
                    errorMessage = 'Bad request. Please check the submitted data.';
                    break;
                case 401:
                    errorMessage = 'Session expired. Please sign in again.';
                    // Redirect to login page
                    this.router.navigate(['/auth/login']);
                    break;
                case 403:
                    errorMessage = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    errorMessage = 'The requested resource was not found.';
                    break;
                case 500:
                    errorMessage = 'The server encountered an internal error.';
                    break;
                default:
                    errorMessage = `Unexpected error (status ${error.status}): ${error.message}`;
            }

            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            }
        }

        // Display error message to user
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });

        // Log error to console in development only
        if (!environment.production) {
            console.error('Error occurred:', error);
        }

        // Return an observable with a user-facing error message
        return throwError(() => errorMessage);
    }

    /**
     * Handle non-HTTP errors
     */
    handleGenericError(error: any) {
        const errorMessage = error?.message || 'An unexpected error occurred. Please try again later.';

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });

        if (!environment.production) {
            console.error('Error occurred:', error);
        }
        return throwError(() => errorMessage);
    }
}
