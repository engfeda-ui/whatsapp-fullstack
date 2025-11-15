import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedApiResponse, UserResponse } from '../types/api.types';

// Export UserResponse as User for backward compatibility
export type User = UserResponse;

export interface ChangePasswordRequest {
    id: number;
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message?: string;
}

export interface UpdateUserRequest {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /**
     * Get user by ID
     */
    getUserById(id: number): Observable<ApiResponse<UserResponse>> {
        return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/User/Get/${id}`);
    }

    /**
     * Get current user profile
     */
    getCurrentUser(): Observable<ApiResponse<UserResponse>> {
        return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/User/Profile`);
    }

    /**
     * Update user profile
     */
    updateUser(request: UpdateUserRequest): Observable<ApiResponse<UserResponse>> {
        return this.http.put<ApiResponse<UserResponse>>(`${this.apiUrl}/User/Update`, request);
    }

    /**
     * Change user password
     */
    changePassword(request: ChangePasswordRequest): Observable<ApiResponse<ChangePasswordResponse>> {
        return this.http.post<ApiResponse<ChangePasswordResponse>>(`${this.apiUrl}/User/ChangePassword`, request);
    }

    /**
     * Get all users (admin only)
     */
    getAllUsers(pageNumber = 1, pageSize = 10): Observable<PaginatedApiResponse<UserResponse>> {
        return this.http.get<PaginatedApiResponse<UserResponse>>(`${this.apiUrl}/User/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    /**
     * Delete user (admin only)
     */
    deleteUser(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/User/Delete/${id}`);
    }
}
