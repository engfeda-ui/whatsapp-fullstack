import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedApiResponse } from '../types/api.types';

export interface HttpOptions {
    params?: HttpParams | Record<string, string | number | boolean>;
    headers?: Record<string, string>;
    skipLoading?: boolean;
    skipErrorHandling?: boolean;
}

/**
 * Wrapper around HttpClient for type-safe API calls
 */
@Injectable({
    providedIn: 'root'
})
export class HttpClientService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /**
     * GET request
     */
    get<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, this.buildHttpOptions(options));
    }

    /**
     * GET paginated request
     */
    getPaginated<T>(endpoint: string, pageNumber = 1, pageSize = 10, options?: HttpOptions): Observable<PaginatedApiResponse<T>> {
        const params = {
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            ...(options?.params as Record<string, string>)
        };

        return this.http.get<PaginatedApiResponse<T>>(`${this.apiUrl}${endpoint}`, {
            ...this.buildHttpOptions(options),
            params
        });
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body, this.buildHttpOptions(options));
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body, this.buildHttpOptions(options));
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, body, this.buildHttpOptions(options));
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, this.buildHttpOptions(options));
    }

    /**
     * Build HTTP options
     */
    private buildHttpOptions(options?: HttpOptions) {
        const httpOptions: any = {};

        if (options?.params) {
            httpOptions.params = options.params instanceof HttpParams ? options.params : new HttpParams({ fromObject: options.params });
        }

        if (options?.headers) {
            httpOptions.headers = options.headers;
        }

        return httpOptions;
    }
}
