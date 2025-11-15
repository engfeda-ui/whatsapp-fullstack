import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse, UserResponse } from '../types/api.types';

/**
 * Mock Auth Service for testing
 */
@Injectable()
export class MockAuthService {
    refreshToken(): Observable<void> {
        return of(undefined);
    }

    isTokenRefreshing(): Observable<boolean> {
        return of(false);
    }
}

/**
 * Mock User Service for testing
 */
@Injectable()
export class MockUserService {
    getCurrentUser(): Observable<ApiResponse<UserResponse>> {
        return of({
            isSuccess: true,
            data: {
                id: 1,
                userName: 'testuser',
                email: 'test@example.com',
                fullName: 'Test User',
                phoneNumber: '1234567890',
                roles: ['user']
            }
        });
    }

    getUserById(id: number): Observable<ApiResponse<UserResponse>> {
        return of({
            isSuccess: true,
            data: {
                id,
                userName: 'testuser',
                email: 'test@example.com',
                fullName: 'Test User',
                phoneNumber: '1234567890',
                roles: ['user']
            }
        });
    }
}

/**
 * Mock Loading Service for testing
 */
@Injectable()
export class MockLoadingService {
    loading$ = of(false);
    requestCount$ = of(0);

    show(): void {}
    hide(): void {}
    reset(): void {}
    isLoading(): boolean {
        return false;
    }
}

/**
 * Mock Cache Service for testing
 */
@Injectable()
export class MockCacheService {
    get<T>(key: string): T | null {
        return null;
    }

    set<T>(key: string, data: T, ttl?: number): void {}
    has(key: string): boolean {
        return false;
    }

    clear(key: string): void {}
    clearAll(): void {}

    cacheObservable<T>(key: string, source$: Observable<T>, ttl?: number): Observable<T> {
        return source$;
    }

    size(): number {
        return 0;
    }

    getStats() {
        return { size: 0, maxSize: 100, keys: [] };
    }
}
