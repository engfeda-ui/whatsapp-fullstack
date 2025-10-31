import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(MessageService);
    const token = tokenService.getToken();

    // Add Authorization header if token exists
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // Check if the request body is FormData, if so, don't set Content-Type
    const isFormData = req.body instanceof FormData;

    if (!isFormData && !req.headers.has('Content-Type')) {
        req = req.clone({
            setHeaders: {
                'Content-Type': 'application/json'
            }
        });
    }

    req = req.clone({
        setHeaders: {
            Accept: 'application/json, */*'
        }
    });

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Check if error is 401 (Unauthorized) and not already a login request
            if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
                // Try to refresh the token
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        // Get the new token
                        const newToken = tokenService.getToken();
                        if (!newToken) {
                            throw new Error('Token refresh failed');
                        }
                        // Clone the request with the new token
                        const authReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        // Retry the request with the new token
                        return next(authReq);
                    }),
                    catchError((refreshError) => {
                        // If refresh fails, logout, notify the user, and redirect to login
                        tokenService.logout();
                        localStorage.removeItem('user');
                        messageService.add({
                            severity: 'warn',
                            summary: 'Session Expired',
                            detail: 'Your session has expired. Please sign in again.',
                            life: 4000
                        });
                        router.navigate(['/auth/login']);
                        return throwError(() => refreshError);
                    })
                );
            }
            // For other errors, just pass them through
            return throwError(() => error);
        })
    );
};
