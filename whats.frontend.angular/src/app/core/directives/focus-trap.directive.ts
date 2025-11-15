import { Directive, ElementRef, HostListener, Input, OnInit, inject } from '@angular/core';
import { AccessibilityService } from '../services/accessibility.service';

/**
 * Focus Trap Directive
 * Traps focus within a modal or dialog
 */
@Directive({
    selector: '[pFocusTrap]',
    standalone: true
})
export class FocusTrapDirective implements OnInit {
    @Input() pFocusTrap = true;

    private el = inject(ElementRef);
    private accessibilityService = inject(AccessibilityService);

    ngOnInit(): void {
        if (this.pFocusTrap) {
            // Focus first focusable element
            const focusableElements = this.accessibilityService.getFocusableElements(this.el.nativeElement);
            if (focusableElements.length > 0) {
                this.accessibilityService.setFocus(focusableElements[0]);
            }
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.pFocusTrap) {
            this.accessibilityService.trapFocus(this.el.nativeElement, event);
        }
    }
}
