import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { EncryptionService } from './encryption.service';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';

    constructor(private encryptionService: EncryptionService) {}

    setToken(token: string): void {
        const encryptedToken = this.encryptionService.encrypt(token);
        localStorage.setItem(this.TOKEN_KEY, encryptedToken);
    }

    getToken(): string | null {
        const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
        if (!encryptedToken) return null;

        try {
            const decryptedToken = this.encryptionService.decrypt(encryptedToken);
            return decryptedToken || null;
        } catch (error) {
            // إذا فشل فك التشفير (مثلاً تغير مفتاح التشفير)، امسح الـ token القديم
            this.removeToken();
            return null;
        }
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    setUser(user: any): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    getUser(): any {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
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
        if (!token) return false;

        // التحقق من الرموز الوهمية المحلية
        if (this.isMockToken(token)) {
            return !this.isTokenExpired(token);
        }

        // التحقق من الرموز العادية
        return !!token && !this.isTokenExpired(token);
    }

    private isMockToken(token: string): boolean {
        try {
            const decoded = this.decodeToken(token);
            return decoded && decoded.Role === 'admin' && decoded.Username;
        } catch {
            return false;
        }
    }

    isAdmin(): boolean {
        // Get the decoded token data
        const decodedToken = this.decodeToken();

        // التحقق من المستخدمين المحليين
        if (decodedToken && decodedToken.Role === 'admin') {
            return true;
        }

        // Check if UserType is "2" (admin) as per the requirements
        if (decodedToken && decodedToken.UserType) {
            return decodedToken.UserType === '2';
        }

        // Fallback to check user object if token doesn't have UserType
        const user = this.getUser();
        return user && (user.UserType === '2' || user.role === 'Admin');
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
        return user && user.UserType === '1';
    }

    decodeToken(token?: string): any {
        try {
            const tokenToUse = token || this.getToken();
            return tokenToUse ? jwtDecode(tokenToUse) : null;
        } catch (error) {
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
        if (!encryptedToken) return null;

        try {
            const decryptedToken = this.encryptionService.decrypt(encryptedToken);
            return decryptedToken || null;
        } catch (error) {
            // إذا فشل فك التشفير، امسح الـ refresh token القديم
            this.removeRefreshToken();
            return null;
        }
    }

    removeRefreshToken(): void {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
}
