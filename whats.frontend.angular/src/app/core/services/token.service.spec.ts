import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { EncryptionService } from './encryption.service';

describe('TokenService', () => {
    let service: TokenService;
    let encryptionService: jasmine.SpyObj<EncryptionService>;
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.abc123';
    const mockRefreshToken = 'refresh_token_123';

    beforeEach(() => {
        const encryptionServiceSpy = jasmine.createSpyObj('EncryptionService', ['encrypt', 'decrypt']);

        TestBed.configureTestingModule({
            providers: [TokenService, { provide: EncryptionService, useValue: encryptionServiceSpy }]
        });

        service = TestBed.inject(TokenService);
        encryptionService = TestBed.inject(EncryptionService) as jasmine.SpyObj<EncryptionService>;

        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('saveToken', () => {
        it('should encrypt and save token to localStorage', () => {
            encryptionService.encrypt.and.returnValue('encrypted_token');

            service.saveToken(mockToken);

            expect(encryptionService.encrypt).toHaveBeenCalledWith(mockToken);
            expect(localStorage.getItem('token')).toBe('encrypted_token');
        });
    });

    describe('getToken', () => {
        it('should decrypt and return token from localStorage', () => {
            localStorage.setItem('token', 'encrypted_token');
            encryptionService.decrypt.and.returnValue(mockToken);

            const token = service.getToken();

            expect(encryptionService.decrypt).toHaveBeenCalledWith('encrypted_token');
            expect(token).toBe(mockToken);
        });

        it('should return null if no token exists', () => {
            const token = service.getToken();
            expect(token).toBeNull();
        });

        it('should return null if decryption fails', () => {
            localStorage.setItem('token', 'invalid_encrypted_token');
            encryptionService.decrypt.and.returnValue(null);

            const token = service.getToken();
            expect(token).toBeNull();
        });
    });

    describe('removeToken', () => {
        it('should remove token from localStorage', () => {
            localStorage.setItem('token', 'encrypted_token');

            service.removeToken();

            expect(localStorage.getItem('token')).toBeNull();
        });
    });

    describe('saveRefreshToken', () => {
        it('should encrypt and save refresh token to localStorage', () => {
            encryptionService.encrypt.and.returnValue('encrypted_refresh_token');

            service.saveRefreshToken(mockRefreshToken);

            expect(encryptionService.encrypt).toHaveBeenCalledWith(mockRefreshToken);
            expect(localStorage.getItem('refreshToken')).toBe('encrypted_refresh_token');
        });
    });

    describe('getRefreshToken', () => {
        it('should decrypt and return refresh token from localStorage', () => {
            localStorage.setItem('refreshToken', 'encrypted_refresh_token');
            encryptionService.decrypt.and.returnValue(mockRefreshToken);

            const token = service.getRefreshToken();

            expect(encryptionService.decrypt).toHaveBeenCalledWith('encrypted_refresh_token');
            expect(token).toBe(mockRefreshToken);
        });
    });

    describe('removeRefreshToken', () => {
        it('should remove refresh token from localStorage', () => {
            localStorage.setItem('refreshToken', 'encrypted_refresh_token');

            service.removeRefreshToken();

            expect(localStorage.getItem('refreshToken')).toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        it('should return true when valid token exists', () => {
            localStorage.setItem('token', 'encrypted_token');
            encryptionService.decrypt.and.returnValue(mockToken);

            const result = service.isLoggedIn();

            expect(result).toBeTrue();
        });

        it('should return false when token does not exist', () => {
            const result = service.isLoggedIn();
            expect(result).toBeFalse();
        });

        it('should return false when token is expired', () => {
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.abc123';
            localStorage.setItem('token', 'encrypted_token');
            encryptionService.decrypt.and.returnValue(expiredToken);

            const result = service.isLoggedIn();

            expect(result).toBeFalse();
        });
    });

    describe('clearTokens', () => {
        it('should remove both token and refresh token', () => {
            localStorage.setItem('token', 'encrypted_token');
            localStorage.setItem('refreshToken', 'encrypted_refresh_token');

            service.clearTokens();

            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
        });
    });

    describe('getTokenExpirationDate', () => {
        it('should return expiration date from valid token', () => {
            localStorage.setItem('token', 'encrypted_token');
            encryptionService.decrypt.and.returnValue(mockToken);

            const expirationDate = service.getTokenExpirationDate();

            expect(expirationDate).toBeInstanceOf(Date);
            expect(expirationDate?.getTime()).toBeGreaterThan(Date.now());
        });

        it('should return null for invalid token', () => {
            const expirationDate = service.getTokenExpirationDate();
            expect(expirationDate).toBeNull();
        });
    });
});
