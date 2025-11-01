/**
 * Production Environment Configuration
 * Configured for Docker and internal network deployment
 */
export const environment = {
    production: true,

    // API URL - Relative path when served through reverse proxy/Docker
    // The app will use the same origin as the frontend
    apiUrl: '/api',

    // SignalR Hub URL - Also through same origin
    signalRUrl: '/hubs/whatsapp',

    // Encryption Key (CRITICAL: Must be changed before deployment!)
    // Generate with: crypto.randomBytes(32).toString('hex')
    encryptionKey: 'your-production-encryption-key-CHANGE-THIS',

    // Feature Flags
    features: {
        enableLogging: false,
        enableDebugMode: false,
        enableMockAuth: false
    }
};
