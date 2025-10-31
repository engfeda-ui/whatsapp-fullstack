import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cache = new Map<string, CacheEntry<unknown>>();
    private readonly MAX_CACHE_SIZE = 50;
    private readonly DEFAULT_TTL = 300000; // 5 minutes

    constructor() {}

    // Get data from cache if it exists and hasn't expired
    get<T>(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            return null;
        }

        // Check if the item has expired
        const now = Date.now();

        if (now - item.timestamp > item.ttl) {
            this.cache.delete(key);

            return null;
        }

        // Update access count for LRU tracking
        item.accessCount++;

        return item.data as T;
    }

    // Set data in cache with a TTL (time to live) in milliseconds
    set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        // If cache is full, remove least recently used item
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            this.evictLRU();
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
            accessCount: 0
        });
    }

    // Evict least recently used item
    private evictLRU(): void {
        let lruKey: string | null = null;
        let minAccessCount = Infinity;

        for (const [key, entry] of this.cache.entries()) {
            if (entry.accessCount < minAccessCount) {
                minAccessCount = entry.accessCount;
                lruKey = key;
            }
        }

        if (lruKey) {
            this.cache.delete(lruKey);
        }
    }

    // Clear cache for a specific key
    clear(key: string): void {
        this.cache.delete(key);
    }

    // Clear all cache
    clearAll(): void {
        this.cache.clear();
    }

    // Cache an observable response with a TTL
    cacheObservable<T>(key: string, source$: Observable<T>, ttl: number = this.DEFAULT_TTL): Observable<T> {
        // Check if we have fresh data in cache
        const cachedData = this.get<T>(key);

        if (cachedData) {
            return of(cachedData);
        }

        // Otherwise, get data from source and cache it
        return source$.pipe(
            tap((data) => this.set(key, data, ttl)),
            shareReplay(1) // Share the result with multiple subscribers
        );
    }

    // Get cache size
    size(): number {
        return this.cache.size;
    }

    // Get cache statistics
    getStats(): { size: number; maxSize: number; keys: string[] } {
        return {
            size: this.cache.size,
            maxSize: this.MAX_CACHE_SIZE,
            keys: Array.from(this.cache.keys())
        };
    }
}
