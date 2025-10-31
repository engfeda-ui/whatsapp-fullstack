import { TestBed } from '@angular/core/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
    let service: EncryptionService;
    const testData = 'sensitive_data_123';
    const anotherTestData = 'another_sensitive_data';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EncryptionService]
        });
        service = TestBed.inject(EncryptionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('encrypt', () => {
        it('should encrypt data successfully', () => {
            const encrypted = service.encrypt(testData);

            expect(encrypted).toBeTruthy();
            expect(encrypted).not.toBe(testData);
            expect(typeof encrypted).toBe('string');
        });

        it('should produce different encrypted values for different inputs', () => {
            const encrypted1 = service.encrypt(testData);
            const encrypted2 = service.encrypt(anotherTestData);

            expect(encrypted1).not.toBe(encrypted2);
        });

        it('should handle empty string', () => {
            const encrypted = service.encrypt('');

            expect(encrypted).toBeTruthy();
            expect(typeof encrypted).toBe('string');
        });

        it('should handle special characters', () => {
            const specialData = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const encrypted = service.encrypt(specialData);

            expect(encrypted).toBeTruthy();
            expect(typeof encrypted).toBe('string');
        });

        it('should handle unicode characters', () => {
            const unicodeData = 'مرحبا بك 你好 🚀';
            const encrypted = service.encrypt(unicodeData);

            expect(encrypted).toBeTruthy();
            expect(typeof encrypted).toBe('string');
        });
    });

    describe('decrypt', () => {
        it('should decrypt previously encrypted data correctly', () => {
            const encrypted = service.encrypt(testData);
            const decrypted = service.decrypt(encrypted);

            expect(decrypted).toBe(testData);
        });

        it('should return null for invalid encrypted data', () => {
            const decrypted = service.decrypt('invalid_encrypted_data');

            expect(decrypted).toBeNull();
        });

        it('should return null for empty string', () => {
            const decrypted = service.decrypt('');

            expect(decrypted).toBeNull();
        });

        it('should handle decryption of data with special characters', () => {
            const specialData = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const encrypted = service.encrypt(specialData);
            const decrypted = service.decrypt(encrypted);

            expect(decrypted).toBe(specialData);
        });

        it('should handle decryption of unicode data', () => {
            const unicodeData = 'مرحبا بك 你好 🚀';
            const encrypted = service.encrypt(unicodeData);
            const decrypted = service.decrypt(encrypted);

            expect(decrypted).toBe(unicodeData);
        });

        it('should return null if decryption throws error', () => {
            const decrypted = service.decrypt('U2FsdGVkX1+invalid');

            expect(decrypted).toBeNull();
        });
    });

    describe('encrypt/decrypt round trip', () => {
        it('should successfully encrypt and decrypt multiple times', () => {
            let data = testData;

            for (let i = 0; i < 5; i++) {
                const encrypted = service.encrypt(data);
                const decrypted = service.decrypt(encrypted);

                expect(decrypted).toBe(data);
                data = decrypted!;
            }
        });

        it('should handle long strings', () => {
            const longString = 'a'.repeat(10000);
            const encrypted = service.encrypt(longString);
            const decrypted = service.decrypt(encrypted);

            expect(decrypted).toBe(longString);
        });

        it('should handle JSON data', () => {
            const jsonData = JSON.stringify({
                user: 'test',
                roles: ['admin', 'user'],
                metadata: { created: new Date().toISOString() }
            });

            const encrypted = service.encrypt(jsonData);
            const decrypted = service.decrypt(encrypted);

            expect(decrypted).toBe(jsonData);
            expect(JSON.parse(decrypted!)).toEqual(JSON.parse(jsonData));
        });
    });

    describe('security', () => {
        it('should produce different encrypted output each time (due to salt)', () => {
            const encrypted1 = service.encrypt(testData);
            const encrypted2 = service.encrypt(testData);

            // Both should decrypt to same value but encrypted values should differ
            expect(encrypted1).not.toBe(encrypted2);
            expect(service.decrypt(encrypted1)).toBe(testData);
            expect(service.decrypt(encrypted2)).toBe(testData);
        });
    });
});
