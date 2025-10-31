import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, map } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { DotNetApiResponse, convertDotNetResponse } from '../ApiResponse';

interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly refreshTokenUrl = `${environment.apiUrl}/auth/refresh-token`;
    private isRefreshing$ = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    refreshToken(): Observable<any> {
        if (!this.isRefreshing$.value) {
            const refreshToken = this.tokenService.getRefreshToken();

            // Check if refresh token exists
            if (!refreshToken) {
                this.isRefreshing$.next(false);
                return new Observable((observer) => {
                    observer.error(new Error('No refresh token available'));
                    observer.complete();
                });
            }

            this.isRefreshing$.next(true);

            return this.http
                .post<DotNetApiResponse<AuthResponse>>(this.refreshTokenUrl, { refreshToken })
                .pipe(
                    map(convertDotNetResponse),
                    tap((response) => {
                        if (response.isSuccess && response.data) {
                            this.tokenService.setToken(response.data.token);
                            this.tokenService.setRefreshToken(response.data.refreshToken);
                        }
                        this.isRefreshing$.next(false);
                    }),
                    catchError((error) => {
                        this.isRefreshing$.next(false);
                        // Propagate the error to the caller
                        throw error;
                    })
                );
        }

        return new Observable((observer) => {
            const subscription = this.isRefreshing$.subscribe((isRefreshing) => {
                if (!isRefreshing) {
                    const token = this.tokenService.getToken();
                    if (token) {
                        observer.next(token);
                    } else {
                        observer.error(new Error('No token available after refresh'));
                    }
                    observer.complete();
                    subscription.unsubscribe();
                }
            });
        });
    }

    isTokenRefreshing(): Observable<boolean> {
        return this.isRefreshing$.asObservable();
    }
}
