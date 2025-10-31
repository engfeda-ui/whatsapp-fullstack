import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalyticsOverview, MessageAnalytics, PerformanceMetrics, CostAnalytics, UsageStatistics, AnalyticsFilter, ChartData, TimeSeriesData } from './types/analytics.types';
import { ApiResponse } from '../../core/ApiResponse';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/analytics`;

    /**
     * Get analytics overview
     */
    getOverview(filter?: AnalyticsFilter): Observable<AnalyticsOverview> {
        const params = this.buildParams(filter);

        return this.http.get<ApiResponse<AnalyticsOverview>>(`${this.apiUrl}/overview`, { params }).pipe(map((response) => response.data));
    }

    /**
     * Get message analytics
     */
    getMessageAnalytics(filter?: AnalyticsFilter): Observable<MessageAnalytics> {
        const params = this.buildParams(filter);

        return this.http.get<ApiResponse<MessageAnalytics>>(`${this.apiUrl}/messages`, { params }).pipe(map((response) => response.data));
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): Observable<PerformanceMetrics> {
        return this.http.get<ApiResponse<PerformanceMetrics>>(`${this.apiUrl}/performance`).pipe(map((response) => response.data));
    }

    /**
     * Get cost analytics
     */
    getCostAnalytics(filter?: AnalyticsFilter): Observable<CostAnalytics> {
        const params = this.buildParams(filter);

        return this.http.get<ApiResponse<CostAnalytics>>(`${this.apiUrl}/costs`, { params }).pipe(map((response) => response.data));
    }

    /**
     * Get usage statistics
     */
    getUsageStatistics(filter?: AnalyticsFilter): Observable<UsageStatistics> {
        const params = this.buildParams(filter);

        return this.http.get<ApiResponse<UsageStatistics>>(`${this.apiUrl}/usage`, { params }).pipe(map((response) => response.data));
    }

    /**
     * Get time series data for charts
     */
    getTimeSeriesData(metric: string, filter?: AnalyticsFilter): Observable<TimeSeriesData[]> {
        const params = this.buildParams(filter);

        return this.http
            .get<ApiResponse<TimeSeriesData[]>>(`${this.apiUrl}/timeseries/${metric}`, {
                params
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Get chart data formatted for PrimeNG charts
     */
    getChartData(chartType: string, filter?: AnalyticsFilter): Observable<ChartData> {
        const params = this.buildParams(filter);

        return this.http.get<ApiResponse<ChartData>>(`${this.apiUrl}/charts/${chartType}`, { params }).pipe(map((response) => response.data));
    }

    /**
     * Export analytics data
     */
    exportData(format: 'csv' | 'excel' | 'pdf', filter?: AnalyticsFilter): Observable<Blob> {
        const params = this.buildParams(filter);

        params.set('format', format);

        return this.http.get(`${this.apiUrl}/export`, {
            params,
            responseType: 'blob'
        });
    }

    /**
     * Get real-time analytics stream
     */
    getRealTimeMetrics(): Observable<PerformanceMetrics> {
        return this.http.get<ApiResponse<PerformanceMetrics>>(`${this.apiUrl}/realtime`).pipe(map((response) => response.data));
    }

    /**
     * Build HTTP params from filter
     */
    private buildParams(filter?: AnalyticsFilter): HttpParams {
        let params = new HttpParams();

        if (!filter) {
            return params;
        }

        if (filter.dateRange) {
            params = params.set('startDate', filter.dateRange.startDate.toString());
            params = params.set('endDate', filter.dateRange.endDate.toString());
        }

        if (filter.deviceIds && filter.deviceIds.length > 0) {
            params = params.set('deviceIds', filter.deviceIds.join(','));
        }

        if (filter.messageTypes && filter.messageTypes.length > 0) {
            params = params.set('messageTypes', filter.messageTypes.join(','));
        }

        if (filter.statuses && filter.statuses.length > 0) {
            params = params.set('statuses', filter.statuses.join(','));
        }

        return params;
    }

    /**
     * Calculate delivery rate
     */
    calculateDeliveryRate(sent: number, delivered: number): number {
        return sent > 0 ? Math.round((delivered / sent) * 100) : 0;
    }

    /**
     * Calculate read rate
     */
    calculateReadRate(delivered: number, read: number): number {
        return delivered > 0 ? Math.round((read / delivered) * 100) : 0;
    }

    /**
     * Calculate failure rate
     */
    calculateFailureRate(sent: number, failed: number): number {
        return sent > 0 ? Math.round((failed / sent) * 100) : 0;
    }

    /**
     * Get growth percentage
     */
    calculateGrowth(current: number, previous: number): number {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }

        return Math.round(((current - previous) / previous) * 100);
    }

    /**
     * Format currency
     */
    formatCurrency(amount: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Format percentage
     */
    formatPercentage(value: number): string {
        return `${value.toFixed(1)}%`;
    }

    /**
     * Format duration in ms
     */
    formatDuration(ms: number): string {
        if (ms < 1000) {
            return `${ms}ms`;
        }

        const seconds = Math.floor(ms / 1000);

        return `${seconds}s`;
    }
}
