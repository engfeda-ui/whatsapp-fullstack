import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription, throttleTime } from 'rxjs';

/**
 * Throttle Directive
 * Limits event emission to at most once per specified time interval
 * Useful for scroll events, click events, etc.
 */
@Directive({
    selector: '[pThrottle]',
    standalone: true
})
export class ThrottleDirective implements OnDestroy {
    @Input() pThrottle = 300; // Throttle time in milliseconds
    @Output() throttled = new EventEmitter<Event>();

    private subject = new Subject<Event>();
    private subscription: Subscription;

    constructor() {
        this.subscription = this.subject.pipe(throttleTime(this.pThrottle)).subscribe((event) => {
            this.throttled.emit(event);
        });
    }

    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        this.subject.next(event);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.subject.complete();
    }
}
