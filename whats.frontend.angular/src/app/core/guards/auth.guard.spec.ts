import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { TokenService } from '../services/token.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
    let tokenService: jasmine.SpyObj<TokenService>;
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['isLoggedIn']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);

        TestBed.configureTestingModule({
            providers: [
                { provide: TokenService, useValue: tokenServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: '/device' } as RouterStateSnapshot;
    });

    it('should allow access when user is logged in', () => {
        tokenService.isLoggedIn.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBeTrue();
        expect(tokenService.isLoggedIn).toHaveBeenCalled();
        expect(router.createUrlTree).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to login when user is not logged in', () => {
        tokenService.isLoggedIn.and.returnValue(false);
        const mockUrlTree = {} as UrlTree;

        router.createUrlTree.and.returnValue(mockUrlTree);

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBe(mockUrlTree);
        expect(tokenService.isLoggedIn).toHaveBeenCalled();
        expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/device' }
        });
    });

    it('should preserve returnUrl in query params', () => {
        tokenService.isLoggedIn.and.returnValue(false);
        const protectedUrl = '/subscription';

        mockState = { url: protectedUrl } as RouterStateSnapshot;
        const mockUrlTree = {} as UrlTree;

        router.createUrlTree.and.returnValue(mockUrlTree);

        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: protectedUrl }
        });
    });

    it('should handle multiple consecutive calls', () => {
        tokenService.isLoggedIn.and.returnValue(true);

        const result1 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
        const result2 = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result1).toBeTrue();
        expect(result2).toBeTrue();
        expect(tokenService.isLoggedIn).toHaveBeenCalledTimes(2);
    });

    it('should handle root path', () => {
        tokenService.isLoggedIn.and.returnValue(false);
        mockState = { url: '/' } as RouterStateSnapshot;
        const mockUrlTree = {} as UrlTree;

        router.createUrlTree.and.returnValue(mockUrlTree);

        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/' }
        });
    });
});
