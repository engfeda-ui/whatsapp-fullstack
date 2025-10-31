import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = (_route, _state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (!tokenService.isLoggedIn()) {
        router.navigate(['/auth/login']);

        return false;
    }

    if (tokenService.isLoggedIn() && tokenService.isAdmin()) {
        return true;
    }

    router.navigate(['/access']);

    return false;
};
