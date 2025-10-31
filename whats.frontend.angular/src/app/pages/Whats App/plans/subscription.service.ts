import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/core/ApiResponse';
import { Period } from './period.model';
import { environment } from '../../../../environments/environment';
import { CacheService } from '@/core/services/cache.service';

export interface SubscriptionRequest {
    planId: number;
    periodId: number;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private apiUrl = environment.apiUrl;
    private readonly PERIODS_CACHE_KEY = 'periods_data';
    private readonly PERIODS_CACHE_TTL = 600000; // 10 minutes

    constructor(
        private http: HttpClient,
        private cacheService: CacheService
    ) {}

    getPeriods(forceRefresh: boolean = false): Observable<ApiResponse<Period[]>> {
        if (forceRefresh) {
            this.cacheService.clear(this.PERIODS_CACHE_KEY);
        }

        return this.cacheService.cacheObservable(this.PERIODS_CACHE_KEY, this.http.get<any>(`${environment.apiUrl}/Period/GetAll`), this.PERIODS_CACHE_TTL);
    }

    createSubscription(request: SubscriptionRequest): Observable<ApiResponse<any>> {
        // Clear cache when creating a new subscription
        this.cacheService.clear('subscriptions_data');

        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Subscription/Create`, request);
    }
}
