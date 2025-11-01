/**
 * Development Environment Configuration
 * Supports local and internal network access
 */
export const environment = {
    production: false,

    // .NET Backend URL Options:
    // 1. Localhost: 'https://localhost:7256/api'
    // 2. Internal Network: 'https://192.168.x.x:7256/api' (update IP as needed)
    // 3. Machine hostname: 'https://machine-name:7256/api'
    apiUrl: 'http://localhost:5229/api',

    // SignalR Hub URL
    signalRUrl: 'http://localhost:5229/hubs/whatsapp',

    // Encryption Key (IMPORTANT: Change in production!)
    encryptionKey: 'your-development-encryption-key-change-in-production',

    // Feature Flags
    features: {
        enableLogging: true,
        enableDebugMode: true,
        enableMockAuth: true
    }
};
