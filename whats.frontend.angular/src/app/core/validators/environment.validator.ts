import { environment } from '../../../environments/environment';

export interface EnvironmentConfig {
    production: boolean;
    apiUrl: string;
    signalRUrl?: string;
    encryptionKeyLength: number;
    isSecure: boolean;
    features: Record<string, boolean>;
}

export class EnvironmentValidator {
    private static readonly REQUIRED_KEYS = ['apiUrl', 'encryptionKey'];
    private static readonly INSECURE_ENCRYPTION_KEYS = ['your-secret-key', 'YourSecretKeyForTokenEncryption', 'CHANGE_ME', 'secret', '123456', 'your-development-encryption-key-change-in-production'];

    /**
     * Validate environment configuration
     */
    static validate(): void {
        this.validateRequiredKeys();
        this.validateEncryptionKey();
        this.validateApiUrl();
        this.validateSignalRUrl();
    }

    /**
     * Validate required keys exist
     */
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

    /**
     * Validate encryption key security
     */
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
            throw new Error('CRITICAL SECURITY ERROR: Production environment is using an insecure encryption key!\n' + 'Please set a strong, unique encryption key in environment.prod.ts');
        }

        if (!production && isInsecure) {
            console.warn('⚠️ WARNING: Development environment is using a default encryption key.\n' + 'This is acceptable for development but MUST be changed for production.');
        }
    }

    /**
     * Validate API URL
     */
    private static validateApiUrl(): void {
        const { apiUrl, production } = environment;

        if (!apiUrl || typeof apiUrl !== 'string') {
            throw new Error('apiUrl must be a non-empty string');
        }

        try {
            new URL(apiUrl);
        } catch {
            throw new Error(`Invalid apiUrl: "${apiUrl}"\n` + 'apiUrl must be a valid URL (e.g., http://localhost:3000 or https://api.example.com)');
        }

        if (production && apiUrl.includes('localhost')) {
            console.warn('⚠️ WARNING: Production environment is pointing to localhost!\n' + 'Make sure this is intentional.');
        }
    }

    /**
     * Validate SignalR URL if present
     */
    private static validateSignalRUrl(): void {
        const signalRUrl = (environment as any).signalRUrl;

        if (!signalRUrl) return;

        if (typeof signalRUrl !== 'string') {
            throw new Error('signalRUrl must be a string');
        }

        try {
            new URL(signalRUrl);
        } catch {
            throw new Error(`Invalid signalRUrl: "${signalRUrl}"\n` + 'signalRUrl must be a valid URL');
        }
    }

    /**
     * Get environment configuration summary
     */
    static getConfigSummary(): EnvironmentConfig {
        const encryptionKey = environment.encryptionKey || '';
        const isSecure = !this.INSECURE_ENCRYPTION_KEYS.some((key) => encryptionKey.toLowerCase().includes(key.toLowerCase()));

        return {
            production: environment.production,
            apiUrl: environment.apiUrl,
            signalRUrl: (environment as any).signalRUrl,
            encryptionKeyLength: encryptionKey.length,
            isSecure,
            features: (environment as any).features || {}
        };
    }

    /**
     * Check if feature is enabled
     */
    static isFeatureEnabled(featureName: string): boolean {
        const features = (environment as any).features || {};
        return features[featureName] === true;
    }
}
