import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'p-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {
        this.initializeLanguageAndFont();
        this.applyGlobalArabicFixes();
    }

    private initializeLanguageAndFont(): void {
        // Get stored preferences or defaults
        const language = localStorage.getItem('language') || 'ar';
        const font = localStorage.getItem('font') || 'font-tajawal';

        // Update HTML attributes
        const html = document.documentElement;
        html.lang = language;
        html.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.body.dir = language === 'ar' ? 'rtl' : 'ltr';

        // Apply font class
        const fontClasses = ['font-tajawal', 'font-poppins', 'font-droid-sans', 'font-al-jazeera'];
        fontClasses.forEach(cls => html.classList.remove(cls));
        html.classList.add(font);

        // Store preferences for consistency
        localStorage.setItem('language', language);
        localStorage.setItem('font', font);
    }

    private applyGlobalArabicFixes(): void {
        // Ensure UTF-8 charset is set
        let charsetMeta = document.querySelector('meta[charset]');
        if (!charsetMeta) {
            charsetMeta = this.renderer.createElement('meta');
            this.renderer.setAttribute(charsetMeta, 'charset', 'UTF-8');
            this.renderer.insertBefore(document.head, charsetMeta, document.head.firstChild);
        }

        // Apply Arabic font features globally
        this.ensureArabicFontFeatures();

        // Monitor DOM changes to apply fixes to newly added elements
        this.setupDOMObserver();
    }

    private ensureArabicFontFeatures(): void {
        // Create and inject style for ensuring font features
        const styleTag = this.renderer.createElement('style');
        const styleContent = `
            body, p, span, div, label, button, a, li, td, th, h1, h2, h3, h4, h5, h6 {
                font-feature-settings: 'liga' 1, 'kern' 1, 'calt' 1 !important;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: subpixel-antialiased !important;
                -moz-osx-font-smoothing: auto !important;
            }

            /* Ensure all text uses correct font */
            * {
                font-family: var(--font-family-override) !important;
            }
        `;
        this.renderer.setProperty(styleTag, 'innerHTML', styleContent);
        this.renderer.appendChild(document.head, styleTag);
    }

    private setupDOMObserver(): void {
        // Observe DOM changes to maintain Arabic fixes
        const observer = new MutationObserver(() => {
            this.fixNewElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    private fixNewElements(): void {
        // Apply fixes to newly added elements
        const textElements = document.querySelectorAll(
            'p, span, div, label, button, a, li, td, th, h1, h2, h3, h4, h5, h6, .p-button, .p-input-text'
        );

        textElements.forEach((el: Element) => {
            const style = el.getAttribute('style') || '';
            if (!style.includes('font-family')) {
                el.setAttribute('style', style + '; font-family: var(--font-family-override) !important;');
            }
        });
    }
}
