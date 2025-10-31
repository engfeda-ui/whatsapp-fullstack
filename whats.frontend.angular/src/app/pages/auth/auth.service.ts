import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DotNetApiResponse, convertDotNetResponse, ApiResponse } from '@/core/ApiResponse';
import { LoginRequest } from './login/ILogin';
import { RegisterRequest } from './register/IRegister';
import { VerificationRequest } from './verification/IVerification';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../core/services/token.service';
import { toDotNetLoginRequest, toDotNetRegisterRequest } from './auth-adapter';

interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
        isActive: boolean;
        createdAt: string;
        lastLoginAt?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/auth`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    login(request: LoginRequest): Observable<ApiResponse<any>> {
        const dotNetRequest = toDotNetLoginRequest(request);
        
        return this.http
            .post<DotNetApiResponse<AuthResponse>>(`${this.API_URL}/login`, dotNetRequest)
            .pipe(
                map(convertDotNetResponse),
                tap((response) => {
                    if (response.isSuccess && response.data) {
                        this.tokenService.setToken(response.data.token);
                        this.tokenService.setRefreshToken(response.data.refreshToken);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                })
            );
    }

    register(request: RegisterRequest): Observable<ApiResponse<any>> {
        const dotNetRequest = toDotNetRegisterRequest(request);
        
        return this.http
            .post<DotNetApiResponse<AuthResponse>>(`${this.API_URL}/register`, dotNetRequest)
            .pipe(
                map(convertDotNetResponse),
                tap((response) => {
                    if (response.isSuccess && response.data) {
                        this.tokenService.setToken(response.data.token);
                        this.tokenService.setRefreshToken(response.data.refreshToken);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                })
            );
    }

    // Verification not supported in .NET backend, return success
    verify(request: VerificationRequest): Observable<ApiResponse<any>> {
        // For now, just return success as .NET doesn't have verification endpoint
        return of({
            isSuccess: true,
            returnCode: 200,
            queryOptions: null,
            data: { verified: true },
            message: 'Verification not required',
            transactionId: null,
            requestCorrelationId: null,
            errors: null,
            propErrors: null,
            createdOrChangedProperties: null
        });
    }

    // Resend code not supported in .NET backend
    resendCode(request: { Id: number; SecurityCode: string }): Observable<ApiResponse<any>> {
        // For now, just return success as .NET doesn't have resend code endpoint
        return of({
            isSuccess: true,
            returnCode: 200,
            queryOptions: null,
            data: { sent: true },
            message: 'Code resend not required',
            transactionId: null,
            requestCorrelationId: null,
            errors: null,
            propErrors: null,
            createdOrChangedProperties: null
        });
    }

    getCurrentUser(): Observable<ApiResponse<any>> {
        return this.http
            .get<DotNetApiResponse<any>>(`${this.API_URL}/me`)
            .pipe(map(convertDotNetResponse));
    }

    logout(): void {
        const refreshToken = this.tokenService.getRefreshToken();
        if (refreshToken) {
            this.http
                .post<DotNetApiResponse<boolean>>(`${this.API_URL}/revoke-token`, {
                    refreshToken
                })
                .subscribe();
        }
        this.tokenService.logout();
        localStorage.removeItem('user');
    }

    isLoggedIn(): boolean {
        return this.tokenService.isLoggedIn();
    }

    getStoredUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}
