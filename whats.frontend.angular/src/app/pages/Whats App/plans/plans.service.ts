import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from './plan.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@/core/ApiResponse';
import { CacheService } from '@/core/services/cache.service';

@Injectable({
    providedIn: 'root'
})
export class PlansService {
    private apiUrl = `${environment.apiUrl}/Plan/GetAll`;
    private readonly CACHE_KEY = 'plans_data';
    private readonly CACHE_TTL = 300000; // 5 minutes

    constructor(
        private http: HttpClient,
        private cacheService: CacheService
    ) {}

    getPlans(forceRefresh: boolean = false): Observable<ApiResponse<any>> {
        if (forceRefresh) {
            this.cacheService.clear(this.CACHE_KEY);
        }

        return this.cacheService.cacheObservable(this.CACHE_KEY, this.http.get<ApiResponse<any>>(this.apiUrl), this.CACHE_TTL);
    }
}
