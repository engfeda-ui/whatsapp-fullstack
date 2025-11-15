import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { convertDotNetResponse, DotNetApiResponse } from '../ApiResponse';
import { AuthResponse } from '../types/api.types';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly refreshTokenUrl = `${environment.apiUrl}/auth/refresh-token`;

    private readonly isRefreshing$ = new BehaviorSubject<boolean>(false);

    private readonly http = inject(HttpClient);

    private readonly tokenService = inject(TokenService);

    refreshToken(): Observable<void> {
        if (this.isRefreshing$.value) {
            return new Observable<void>((observer) => {
                const subscription = this.isRefreshing$.subscribe((isRefreshing) => {
                    if (!isRefreshing) {
                        const token = this.tokenService.getToken();

                        if (token) {
                            observer.next();
                            observer.complete();
                        } else {
                            observer.error(new Error('No token available after refresh'));
                        }

                        subscription.unsubscribe();
                    }
                });

                return () => subscription.unsubscribe();
            });
        }

        const refreshToken = this.tokenService.getRefreshToken();

        if (!refreshToken) {
            this.isRefreshing$.next(false);

            return throwError(() => new Error('No refresh token available'));
        }

        this.isRefreshing$.next(true);

        return this.http.post<DotNetApiResponse<AuthResponse>>(this.refreshTokenUrl, { refreshToken }).pipe(
            map(convertDotNetResponse),
            tap((response) => {
                if (response.isSuccess && response.data) {
                    this.tokenService.setToken(response.data.token);
                    this.tokenService.setRefreshToken(response.data.refreshToken);
                }

                this.isRefreshing$.next(false);
            }),
            map(() => undefined),
            catchError((error) => {
                this.isRefreshing$.next(false);

                return throwError(() => error);
            })
        );
    }

    isTokenRefreshing(): Observable<boolean> {
        return this.isRefreshing$.asObservable();
    }
}
