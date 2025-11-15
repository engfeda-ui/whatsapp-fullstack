import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

/**
 * ARIA Label Directive
 * Simplifies adding ARIA labels to elements
 */
@Directive({
    selector: '[pAriaLabel]',
    standalone: true
})
export class AriaLabelDirective implements OnInit {
    @Input() pAriaLabel!: string;

    private el = inject(ElementRef);

    ngOnInit(): void {
        this.el.nativeElement.setAttribute('aria-label', this.pAriaLabel);
    }
}
