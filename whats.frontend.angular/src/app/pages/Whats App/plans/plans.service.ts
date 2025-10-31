import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@/core/ApiResponse';
import { CacheService } from '@/core/services/cache.service';

export interface PlanData {
    id: number;
    name: string;
    description?: string;
    price: number;
    features?: string[];
    [key: string]: unknown;
}

@Injectable({
    providedIn: 'root'
})
export class PlansService {
    private http = inject(HttpClient);
    private cacheService = inject(CacheService);
    private apiUrl = `${environment.apiUrl}/Plan/GetAll`;
    private readonly CACHE_KEY = 'plans_data';
    private readonly CACHE_TTL = 300000; // 5 minutes

    getPlans(forceRefresh: boolean = false): Observable<ApiResponse<PlanData[]>> {
        if (forceRefresh) {
            this.cacheService.clear(this.CACHE_KEY);
        }

        return this.cacheService.cacheObservable(this.CACHE_KEY, this.http.get<ApiResponse<PlanData[]>>(this.apiUrl), this.CACHE_TTL);
    }
}
