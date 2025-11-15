import { LoadingService } from '@/core/services/loading.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'p-loading',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule],
    template: `
        <div *ngIf="loadingService.loading$ | async" class="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
            <div class="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
                <p-progressSpinner [style]="{ width: '50px', height: '50px' }" strokeWidth="4" fill="transparent" animationDuration="1s"> </p-progressSpinner>
                <p class="mt-4 text-center text-gray-700 dark:text-gray-300 font-medium">جاري التحميل...</p>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
        `
    ]
})
export class AppLoading {
    loadingService = inject(LoadingService);
}
