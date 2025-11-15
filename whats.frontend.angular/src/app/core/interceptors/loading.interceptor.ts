import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Loading Interceptor
 * Tracks HTTP requests and manages global loading state
 * Excludes certain requests from triggering loading indicator
 */
export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const loadingService = inject(LoadingService);

    // Skip loading indicator for certain requests
    const skipLoadingUrls = ['/health', '/ping', '/metrics'];

    const shouldSkipLoading = skipLoadingUrls.some((url) => req.url.includes(url));

    if (!shouldSkipLoading) {
        loadingService.show();
    }

    return next(req).pipe(
        finalize(() => {
            if (!shouldSkipLoading) {
                loadingService.hide();
            }
        })
    );
};
