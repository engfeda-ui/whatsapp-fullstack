import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../ApiResponse';

export interface User {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    roles: string[];
    name?: string;
    sub?: string;
    nameid?: string;
    unique_name?: string;
    role?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    UserType?: string;
    TenantId?: string;
    FullName?: string;
    MobileNumber?: string;
}

export interface ChangePasswordRequest {
    id: number;
    oldPassword: string;
    newPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUserById(id: number): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/User/Get/${id}`);
    }

    changePassword(request: ChangePasswordRequest): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/User/ChangePassword`, request);
    }
}
