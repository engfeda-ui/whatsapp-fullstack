import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Lazy Load Image Directive
 * Loads images only when they are visible in the viewport
 * Improves initial page load performance
 */
@Directive({
    selector: 'img[pLazyLoad]',
    standalone: true
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
    @Input() pLazyLoad!: string; // Image URL to load
    @Input() pLazyLoadPlaceholder?: string; // Placeholder image URL

    private el = inject(ElementRef);
    private intersectionObserver?: IntersectionObserver;

    ngOnInit(): void {
        this.setupLazyLoading();
    }

    private setupLazyLoading(): void {
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers that don't support IntersectionObserver
            this.loadImage();
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.loadImage();
                        this.intersectionObserver?.unobserve(this.el.nativeElement);
                    }
                });
            },
            {
                rootMargin: '50px' // Start loading 50px before image enters viewport
            }
        );

        this.intersectionObserver.observe(this.el.nativeElement);
    }

    private loadImage(): void {
        const img = this.el.nativeElement as HTMLImageElement;

        // Set placeholder if provided
        if (this.pLazyLoadPlaceholder) {
            img.src = this.pLazyLoadPlaceholder;
            img.classList.add('lazy-loading');
        }

        // Create a new image to preload
        const newImg = new Image();

        newImg.onload = () => {
            img.src = this.pLazyLoad;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        };

        newImg.onerror = () => {
            img.classList.add('lazy-error');
            console.error(`Failed to load image: ${this.pLazyLoad}`);
        };

        newImg.src = this.pLazyLoad;
    }

    ngOnDestroy(): void {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }
}
