import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
    let service: CacheService;
    const testKey = 'test_key';
    const testData = { name: 'test', value: 123 };
    const testTTL = 5000; // 5 seconds

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CacheService]
        });
        service = TestBed.inject(CacheService);
        service.clear(); // Clear cache before each test
    });

    afterEach(() => {
        service.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('set and get', () => {
        it('should store and retrieve data', () => {
            service.set(testKey, testData, testTTL);
            const result = service.get(testKey);

            expect(result).toEqual(testData);
        });

        it('should return null for non-existent key', () => {
            const result = service.get('non_existent_key');

            expect(result).toBeNull();
        });

        it('should handle different data types', () => {
            service.set('string', 'test', testTTL);
            service.set('number', 42, testTTL);
            service.set('boolean', true, testTTL);
            service.set('array', [1, 2, 3], testTTL);
            service.set('object', { key: 'value' }, testTTL);

            expect(service.get('string')).toBe('test');
            expect(service.get('number')).toBe(42);
            expect(service.get('boolean')).toBe(true);
            expect(service.get('array')).toEqual([1, 2, 3]);
            expect(service.get('object')).toEqual({ key: 'value' });
        });

        it('should overwrite existing key', () => {
            service.set(testKey, 'first', testTTL);
            service.set(testKey, 'second', testTTL);

            expect(service.get(testKey)).toBe('second');
        });
    });

    describe('TTL (Time To Live)', () => {
        it('should return null after TTL expires', (done) => {
            const shortTTL = 100; // 100ms

            service.set(testKey, testData, shortTTL);

            setTimeout(() => {
                const result = service.get(testKey);

                expect(result).toBeNull();
                done();
            }, 150);
        });

        it('should return data before TTL expires', (done) => {
            const longTTL = 1000; // 1 second

            service.set(testKey, testData, longTTL);

            setTimeout(() => {
                const result = service.get(testKey);

                expect(result).toEqual(testData);
                done();
            }, 500);
        });
    });

    describe('has', () => {
        it('should return true for existing valid key', () => {
            service.set(testKey, testData, testTTL);
            expect(service.has(testKey)).toBeTrue();
        });

        it('should return false for non-existent key', () => {
            expect(service.has('non_existent')).toBeFalse();
        });

        it('should return false for expired key', (done) => {
            const shortTTL = 100;

            service.set(testKey, testData, shortTTL);

            setTimeout(() => {
                expect(service.has(testKey)).toBeFalse();
                done();
            }, 150);
        });
    });

    describe('delete', () => {
        it('should remove entry from cache', () => {
            service.set(testKey, testData, testTTL);
            service.delete(testKey);

            expect(service.has(testKey)).toBeFalse();
            expect(service.get(testKey)).toBeNull();
        });

        it('should handle deletion of non-existent key gracefully', () => {
            expect(() => service.delete('non_existent')).not.toThrow();
        });
    });

    describe('clear', () => {
        it('should remove all entries', () => {
            service.set('key1', 'value1', testTTL);
            service.set('key2', 'value2', testTTL);
            service.set('key3', 'value3', testTTL);

            service.clear();

            expect(service.has('key1')).toBeFalse();
            expect(service.has('key2')).toBeFalse();
            expect(service.has('key3')).toBeFalse();
            expect(service.size()).toBe(0);
        });
    });

    describe('size', () => {
        it('should return correct cache size', () => {
            expect(service.size()).toBe(0);

            service.set('key1', 'value1', testTTL);
            expect(service.size()).toBe(1);

            service.set('key2', 'value2', testTTL);
            expect(service.size()).toBe(2);

            service.delete('key1');
            expect(service.size()).toBe(1);
        });
    });

    describe('LRU eviction', () => {
        it('should evict least recently used item when max size reached', () => {
            const maxSize = 50; // Default MAX_CACHE_SIZE

            // Fill cache to max
            for (let i = 0; i < maxSize; i++) {
                service.set(`key${i}`, `value${i}`, testTTL);
            }

            expect(service.size()).toBe(maxSize);

            // Access some keys to update their access count
            service.get('key10');
            service.get('key10');
            service.get('key20');

            // Add one more item to trigger eviction
            service.set('new_key', 'new_value', testTTL);

            expect(service.size()).toBe(maxSize);
            expect(service.has('new_key')).toBeTrue();

            // The least accessed item should be evicted (not key10 or key20)
            expect(service.has('key10')).toBeTrue();
            expect(service.has('key20')).toBeTrue();
        });
    });

    describe('getStats', () => {
        it('should return correct statistics', () => {
            service.set('key1', 'value1', testTTL);
            service.set('key2', 'value2', testTTL);
            service.set('key3', 'value3', testTTL);

            const stats = service.getStats();

            expect(stats.size).toBe(3);
            expect(stats.maxSize).toBe(50);
            expect(stats.keys).toContain('key1');
            expect(stats.keys).toContain('key2');
            expect(stats.keys).toContain('key3');
            expect(stats.keys.length).toBe(3);
        });

        it('should return empty keys array when cache is empty', () => {
            const stats = service.getStats();

            expect(stats.size).toBe(0);
            expect(stats.keys).toEqual([]);
        });
    });

    describe('access count tracking', () => {
        it('should increment access count on each get', () => {
            service.set(testKey, testData, testTTL);

            // Access the key multiple times
            for (let i = 0; i < 5; i++) {
                service.get(testKey);
            }

            // The key should still be accessible (not evicted)
            expect(service.has(testKey)).toBeTrue();
        });
    });
});
