import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerformanceService } from './app/core/services/performance.service';
import { EnvironmentValidator } from './app/core/validators/environment.validator';

@Component({
    selector: 'p-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    private renderer = inject(Renderer2);
    private performanceService = inject(PerformanceService);

    ngOnInit(): void {
        const endMeasure = this.performanceService.startMeasure('app-initialization');

        try {
            this.initializeLanguageAndFont();
            this.applyGlobalArabicFixes();
            this.validateEnvironment();
        } finally {
            endMeasure();
        }
    }

    /**
     * Initialize language and font preferences
     */
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
        fontClasses.forEach((cls) => html.classList.remove(cls));
        html.classList.add(font);

        // Store preferences for consistency
        localStorage.setItem('language', language);
        localStorage.setItem('font', font);
    }

    /**
     * Apply global Arabic text rendering fixes
     */
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
    }

    /**
     * Ensure Arabic font features are applied
     */
    private ensureArabicFontFeatures(): void {
        const styleTag = this.renderer.createElement('style');
        const styleContent = `
            body, p, span, div, label, button, a, li, td, th, h1, h2, h3, h4, h5, h6 {
                font-feature-settings: 'liga' 1, 'kern' 1, 'calt' 1 !important;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: subpixel-antialiased !important;
                -moz-osx-font-smoothing: auto !important;
            }

            * {
                font-family: var(--font-family-override) !important;
            }
        `;
        this.renderer.setProperty(styleTag, 'innerHTML', styleContent);
        this.renderer.appendChild(document.head, styleTag);
    }

    /**
     * Validate environment configuration
     */
    private validateEnvironment(): void {
        try {
            EnvironmentValidator.validate();
            const config = EnvironmentValidator.getConfigSummary();
            console.info('✅ Environment validated successfully:', config);
        } catch (error) {
            console.error('❌ Environment validation failed:', error);
            throw error;
        }
    }
}
