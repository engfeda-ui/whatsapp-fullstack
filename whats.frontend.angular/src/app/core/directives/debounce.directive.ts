import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

/**
 * Debounce Directive
 * Delays event emission until after a specified time has passed without the event firing
 * Useful for search inputs, resize events, etc.
 */
@Directive({
    selector: '[pDebounce]',
    standalone: true
})
export class DebounceDirective implements OnDestroy {
    @Input() pDebounce = 300; // Debounce time in milliseconds
    @Output() debounced = new EventEmitter<Event>();

    private subject = new Subject<Event>();
    private subscription: Subscription;

    constructor() {
        this.subscription = this.subject.pipe(debounceTime(this.pDebounce)).subscribe((event) => {
            this.debounced.emit(event);
        });
    }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        this.subject.next(event);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.subject.complete();
    }
}
