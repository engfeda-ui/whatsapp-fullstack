import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { EncryptionService } from './encryption.service';

interface StoredUser {
    UserType?: string;
    role?: string;
    [key: string]: unknown;
}

interface DecodedToken {
    Role?: string;
    Username?: string;
    UserType?: string;
    exp?: number;
    [key: string]: unknown;
}

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private encryptionService = inject(EncryptionService);
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';

    setToken(token: string): void {
        const encryptedToken = this.encryptionService.encrypt(token);

        localStorage.setItem(this.TOKEN_KEY, encryptedToken);
    }

    getToken(): string | null {
        const encryptedToken = localStorage.getItem(this.TOKEN_KEY);

        if (!encryptedToken) {
            return null;
        }

        try {
            const decryptedToken = this.encryptionService.decrypt(encryptedToken);

            return decryptedToken || null;
        } catch {
            // Ø¥Ø°Ø§ ÙØ´Ù„ ÙÙƒ Ø§Ù„ØªØ´ÙÙŠØ± (Ù…Ø«Ù„Ø§Ù‹ ØªØºÙŠØ± Ù…ÙØªØ§Ø­ Ø§Ù„ØªØ´ÙÙŠØ±)ØŒ Ø§Ù…Ø³Ø­ Ø§Ù„Ù€ token Ø§Ù„Ù‚Ø¯ÙŠÙ…
            this.removeToken();

            return null;
        }
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    setUser(user: StoredUser): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    getUser(): StoredUser | null {
        const user = localStorage.getItem(this.USER_KEY);

        return user ? (JSON.parse(user) as StoredUser) : null;
    }

    removeUser(): void {
        localStorage.removeItem(this.USER_KEY);
    }

    logout(): void {
        this.removeToken();
        this.removeUser();
    }

    isLoggedIn(): boolean {
        const token = this.getToken();

        if (!token) {
            return false;
        }

        // Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø±Ù…ÙˆØ² Ø§Ù„ÙˆÙ‡Ù…ÙŠØ© Ø§Ù„Ù…Ø­Ù„ÙŠØ©
        if (this.isMockToken(token)) {
            return !this.isTokenExpired(token);
        }

        // Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø±Ù…ÙˆØ² Ø§Ù„Ø¹Ø§Ø¯ÙŠØ©
        return !this.isTokenExpired(token);
    }

    private isMockToken(token: string): boolean {
        try {
            const decoded = this.decodeToken(token);

            return Boolean(decoded && decoded.Role === 'admin' && decoded.Username);
        } catch {
            return false;
        }
    }

    isAdmin(): boolean {
        // Get the decoded token data
        const decodedToken = this.decodeToken();

        // Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø§Ù„Ù…Ø­Ù„ÙŠÙŠÙ†
        if (decodedToken && decodedToken.Role === 'admin') {
            return true;
        }

        // Check if UserType is "2" (admin) as per the requirements
        if (decodedToken && decodedToken.UserType) {
            return decodedToken.UserType === '2';
        }

        // Fallback to check user object if token doesn't have UserType
        const user = this.getUser();

        return Boolean(user && (user.UserType === '2' || user.role === 'Admin'));
    }

    isCustomer(): boolean {
        // Get the decoded token data
        const decodedToken = this.decodeToken();

        // Check if UserType is "1" (customer) as per the requirements
        if (decodedToken && decodedToken.UserType) {
            return decodedToken.UserType === '1';
        }

        // Fallback to check user object if token doesn't have UserType
        const user = this.getUser();

        return Boolean(user && user.UserType === '1');
    }

    decodeToken(token?: string): DecodedToken | null {
        try {
            const tokenToUse = token || this.getToken();

            if (!tokenToUse) {
                return null;
            }

            return jwtDecode<DecodedToken>(tokenToUse);
        } catch {
            return null;
        }
    }

    getTokenExpirationDate(token?: string): Date | null {
        const decoded = this.decodeToken(token);

        if (!decoded || !decoded.exp) {
            return null;
        }

        const date = new Date(0);

        date.setUTCSeconds(decoded.exp);

        return date;
    }

    isTokenExpired(token?: string): boolean {
        const date = this.getTokenExpirationDate(token);

        return date ? date.valueOf() <= new Date().valueOf() : true;
    }

    setRefreshToken(token: string): void {
        const encryptedToken = this.encryptionService.encrypt(token);

        localStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedToken);
    }

    getRefreshToken(): string | null {
        const encryptedToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

        if (!encryptedToken) {
            return null;
        }

        try {
            const decryptedToken = this.encryptionService.decrypt(encryptedToken);

            return decryptedToken || null;
        } catch {
            // Ø¥Ø°Ø§ ÙØ´Ù„ ÙÙƒ Ø§Ù„ØªØ´ÙÙŠØ±ØŒ Ø§Ù…Ø³Ø­ Ø§Ù„Ù€ refresh token Ø§Ù„Ù‚Ø¯ÙŠÙ…
            this.removeRefreshToken();

            return null;
        }
    }

    removeRefreshToken(): void {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
}
