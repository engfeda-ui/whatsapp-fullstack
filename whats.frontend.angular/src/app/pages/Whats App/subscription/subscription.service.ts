import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/core/ApiResponse';
import { Subscription } from './subscription.model';
import { environment } from '../../../../environments/environment';

export interface SubscriptionAdminData {
    id: number;
    userId: number;
    planId: number;
    status: string;
    startDate: string;
    endDate: string;
    [key: string]: unknown;
}

export interface DeleteResponse {
    success: boolean;
    message?: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getSubscriptions(): Observable<ApiResponse<Subscription[]>> {
        return this.http.get<ApiResponse<Subscription[]>>(`${this.apiUrl}/Subscription/GetAll`);
    }

    getSubscriptionForAdmin(): Observable<ApiResponse<SubscriptionAdminData[]>> {
        return this.http.get<ApiResponse<SubscriptionAdminData[]>>(`${this.apiUrl}/Subscription/GetAllForAdmin`);
    }

    deleteSubscription(id: number): Observable<ApiResponse<DeleteResponse>> {
        return this.http.delete<ApiResponse<DeleteResponse>>(`${this.apiUrl}/Subscription/Delete/${id}`);
    }

    setPayment(id: number): Observable<ApiResponse<PaymentResponse>> {
        return this.http.post<ApiResponse<PaymentResponse>>(`${this.apiUrl}/Subscription/SetPayment`, { id: id });
    }
}
