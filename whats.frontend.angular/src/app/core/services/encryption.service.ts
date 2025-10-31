import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {
    private readonly secretKey = environment.encryptionKey;

    constructor() {}

    /**
     * Encrypt data using AES encryption
     */
    encrypt(data: string): string {
        try {
            return CryptoJS.AES.encrypt(data, this.secretKey).toString();
        } catch (error) {
            throw new Error('Encryption failed');
        }
    }

    /**
     * Decrypt data using AES decryption
     */
    decrypt(encryptedData: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                throw new Error('Decryption resulted in empty string');
            }
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed');
        }
    }
}
