import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    private readonly requestCountSubject = new BehaviorSubject<number>(0);

    public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();
    public readonly requestCount$: Observable<number> = this.requestCountSubject.asObservable();

    /**
     * Increment request count and show loading
     */
    show(): void {
        const currentCount = this.requestCountSubject.value;
        this.requestCountSubject.next(currentCount + 1);
        this.loadingSubject.next(true);
    }

    /**
     * Decrement request count and hide loading if no more requests
     */
    hide(): void {
        const currentCount = this.requestCountSubject.value;
        const newCount = Math.max(0, currentCount - 1);
        this.requestCountSubject.next(newCount);

        if (newCount === 0) {
            this.loadingSubject.next(false);
        }
    }

    /**
     * Reset loading state
     */
    reset(): void {
        this.requestCountSubject.next(0);
        this.loadingSubject.next(false);
    }

    /**
     * Get current loading state
     */
    isLoading(): boolean {
        return this.loadingSubject.value;
    }
}
