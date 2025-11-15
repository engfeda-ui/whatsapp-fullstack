import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: number;
    metadata?: Record<string, unknown>;
}

@Injectable({
    providedIn: 'root'
})
export class PerformanceService {
    private metrics: PerformanceMetric[] = [];
    private readonly MAX_METRICS = 100;

    /**
     * Start measuring performance
     */
    startMeasure(name: string): () => void {
        const startTime = performance.now();

        return (metadata?: Record<string, unknown>) => {
            this.endMeasure(name, startTime, metadata);
        };
    }

    /**
     * End measuring performance
     */
    private endMeasure(name: string, startTime: number, metadata?: Record<string, unknown>): void {
        const duration = performance.now() - startTime;

        this.recordMetric({
            name,
            duration,
            timestamp: Date.now(),
            metadata
        });

        if (!environment.production) {
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`, metadata);
        }
    }

    /**
     * Record a performance metric
     */
    recordMetric(metric: PerformanceMetric): void {
        if (this.metrics.length >= this.MAX_METRICS) {
            this.metrics.shift();
        }

        this.metrics.push(metric);
    }

    /**
     * Get all metrics
     */
    getMetrics(): PerformanceMetric[] {
        return [...this.metrics];
    }

    /**
     * Get metrics by name
     */
    getMetricsByName(name: string): PerformanceMetric[] {
        return this.metrics.filter((m) => m.name === name);
    }

    /**
     * Get average duration for a metric
     */
    getAverageDuration(name: string): number {
        const metrics = this.getMetricsByName(name);
        if (metrics.length === 0) return 0;

        const total = metrics.reduce((sum, m) => sum + m.duration, 0);
        return total / metrics.length;
    }

    /**
     * Clear all metrics
     */
    clearMetrics(): void {
        this.metrics = [];
    }

    /**
     * Get performance summary
     */
    getSummary(): Record<string, { count: number; average: number; min: number; max: number }> {
        const summary: Record<string, { count: number; average: number; min: number; max: number }> = {};

        for (const metric of this.metrics) {
            if (!summary[metric.name]) {
                summary[metric.name] = {
                    count: 0,
                    average: 0,
                    min: Infinity,
                    max: -Infinity
                };
            }

            const stats = summary[metric.name];
            stats.count++;
            stats.average += metric.duration;
            stats.min = Math.min(stats.min, metric.duration);
            stats.max = Math.max(stats.max, metric.duration);
        }

        // Calculate averages
        for (const key in summary) {
            summary[key].average = summary[key].average / summary[key].count;
        }

        return summary;
    }

    /**
     * Measure function execution time
     */
    measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, unknown>): T {
        const startTime = performance.now();
        try {
            return fn();
        } finally {
            this.endMeasure(name, startTime, metadata);
        }
    }

    /**
     * Measure async function execution time
     */
    async measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, unknown>): Promise<T> {
        const startTime = performance.now();
        try {
            return await fn();
        } finally {
            this.endMeasure(name, startTime, metadata);
        }
    }
}
