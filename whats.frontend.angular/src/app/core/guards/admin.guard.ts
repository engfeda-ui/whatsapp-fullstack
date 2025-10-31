import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.isLoggedIn() && tokenService.isAdmin()) {
        return true;
    }
    if (tokenService.isLoggedIn()) {
        router.navigate(['/access']);
        return false;
    }
    router.navigate(['/auth/login']);
    return false;
};
