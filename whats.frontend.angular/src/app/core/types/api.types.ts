/**
 * Standard API Response Types
 * Provides type-safe interfaces for API responses
 */

export interface ApiResponse<T = unknown> {
    isSuccess: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedResponse<T>> {}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: UserResponse;
}

export interface UserResponse {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    roles: string[];
    userType?: string;
    tenantId?: string;
    // Backward compatibility with PascalCase
    UserType?: string;
    TenantId?: string;
    FullName?: string;
    MobileNumber?: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface ErrorResponse {
    message: string;
    errors?: ValidationError[] | Record<string, string[]>;
    statusCode: number;
    timestamp?: string;
    path?: string;
}

/**
 * Request/Response interceptor types
 */
export interface RequestConfig {
    skipLoading?: boolean;
    skipErrorHandling?: boolean;
    timeout?: number;
}

export interface ResponseInterceptorConfig extends RequestConfig {
    cacheKey?: string;
    cacheDuration?: number;
}
