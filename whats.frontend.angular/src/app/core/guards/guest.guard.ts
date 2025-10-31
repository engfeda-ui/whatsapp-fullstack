import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const guestGuard: CanActivateFn = (_route, _state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (!tokenService.getToken()) {
        return true;
    }

    router.navigate(['/']);

    return false;
};
