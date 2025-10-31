import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, timeout, map } from 'rxjs/operators';
import { ApiResponse } from '@/core/ApiResponse';
import { Subscription } from './subscription.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getSubscriptions(): Observable<ApiResponse<Subscription[]>> {
        return this.http.get<ApiResponse<Subscription[]>>(`${this.apiUrl}/Subscription/GetAll`);
    }

    getSubscriptionForAdmin(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Subscription/GetAllForAdmin`);
    }

    deleteSubscription(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Subscription/Delete/${id}`);
    }

    setPayment(id: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Subscription/SetPayment`, { id: id });
    }
}
