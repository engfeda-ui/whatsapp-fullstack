import { environment } from '../../../environments/environment';

export class EnvironmentValidator {
    private static readonly REQUIRED_KEYS = ['apiUrl', 'encryptionKey'];
    private static readonly INSECURE_ENCRYPTION_KEYS = ['your-secret-key', 'YourSecretKeyForTokenEncryption', 'CHANGE_ME', 'secret', '123456'];

    static validate(): void {
        this.validateRequiredKeys();
        this.validateEncryptionKey();
        this.validateApiUrl();
    }

    private static validateRequiredKeys(): void {
        const missingKeys: string[] = [];

        for (const key of this.REQUIRED_KEYS) {
            if (!environment[key as keyof typeof environment]) {
                missingKeys.push(key);
            }
        }

        if (missingKeys.length > 0) {
            throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}\n` + 'Please check your environment configuration file.');
        }
    }

    private static validateEncryptionKey(): void {
        const { encryptionKey, production } = environment;

        if (!encryptionKey || typeof encryptionKey !== 'string') {
            throw new Error('encryptionKey must be a non-empty string');
        }

        if (encryptionKey.length < 16) {
            throw new Error('encryptionKey must be at least 16 characters long for security reasons');
        }

        const isInsecure = this.INSECURE_ENCRYPTION_KEYS.some((insecureKey) => encryptionKey.toLowerCase().includes(insecureKey.toLowerCase()));

        if (production && isInsecure) {
            throw new Error('CRITICAL SECURITY ERROR: Production environment is using an insecure encryption key!\nPlease set a strong, unique encryption key in environment.prod.ts');
        }

        if (!production && isInsecure) {
            console.warn('WARNING: Development environment is using a default encryption key.\nThis is acceptable for development but MUST be changed for production.');
        }
    }

    private static validateApiUrl(): void {
        const { apiUrl } = environment;

        if (!apiUrl || typeof apiUrl !== 'string') {
            throw new Error('apiUrl must be a non-empty string');
        }

        try {
            new URL(apiUrl);
        } catch {
            throw new Error(`Invalid apiUrl: "${apiUrl}"\n` + 'apiUrl must be a valid URL (e.g., http://localhost:3000 or https://api.example.com)');
        }

        if (environment.production && apiUrl.includes('localhost')) {
            console.warn('WARNING: Production environment is pointing to localhost!\nMake sure this is intentional.');
        }
    }

    static getConfigSummary(): {
        production: boolean;
        apiUrl: string;
        encryptionKeyLength: number;
        isSecure: boolean;
    } {
        return {
            production: environment.production,
            apiUrl: environment.apiUrl,
            encryptionKeyLength: environment.encryptionKey?.length || 0,
            isSecure: !this.INSECURE_ENCRYPTION_KEYS.some((key) => environment.encryptionKey?.toLowerCase().includes(key.toLowerCase()))
        };
    }
}


