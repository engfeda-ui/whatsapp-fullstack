import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '../services/error-handler.service';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const errorHandlerService = inject(ErrorHandlerService);

    return next(req).pipe(catchError((error: HttpErrorResponse) => errorHandlerService.handleError(error)));
};
