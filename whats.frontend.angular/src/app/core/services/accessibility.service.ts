import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Accessibility Service
 * Provides utilities for improving application accessibility
 */
@Injectable({
    providedIn: 'root'
})
export class AccessibilityService {
    private document = inject(DOCUMENT);

    /**
     * Announce a message to screen readers
     */
    announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
        const announcement = this.document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        this.document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    /**
     * Set focus to an element
     */
    setFocus(element: HTMLElement | null): void {
        if (element) {
            element.focus();
        }
    }

    /**
     * Get all focusable elements within a container
     */
    getFocusableElements(container: HTMLElement): HTMLElement[] {
        const focusableSelectors = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'];

        return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));
    }

    /**
     * Trap focus within a modal/dialog
     */
    trapFocus(container: HTMLElement, event: KeyboardEvent): void {
        if (event.key !== 'Tab') return;

        const focusableElements = this.getFocusableElements(container);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = this.document.activeElement as HTMLElement;

        if (event.shiftKey) {
            // Shift + Tab
            if (activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Add ARIA label to element
     */
    setAriaLabel(element: HTMLElement, label: string): void {
        element.setAttribute('aria-label', label);
    }

    /**
     * Add ARIA description to element
     */
    setAriaDescription(element: HTMLElement, description: string): void {
        element.setAttribute('aria-description', description);
    }

    /**
     * Set ARIA disabled state
     */
    setAriaDisabled(element: HTMLElement, disabled: boolean): void {
        element.setAttribute('aria-disabled', disabled.toString());
    }

    /**
     * Set ARIA expanded state
     */
    setAriaExpanded(element: HTMLElement, expanded: boolean): void {
        element.setAttribute('aria-expanded', expanded.toString());
    }

    /**
     * Set ARIA hidden state
     */
    setAriaHidden(element: HTMLElement, hidden: boolean): void {
        element.setAttribute('aria-hidden', hidden.toString());
    }

    /**
     * Announce error to screen readers
     */
    announceError(message: string): void {
        this.announce(`Error: ${message}`, 'assertive');
    }

    /**
     * Announce success to screen readers
     */
    announceSuccess(message: string): void {
        this.announce(`Success: ${message}`, 'polite');
    }

    /**
     * Announce warning to screen readers
     */
    announceWarning(message: string): void {
        this.announce(`Warning: ${message}`, 'assertive');
    }
}
