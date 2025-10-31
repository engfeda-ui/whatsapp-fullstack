export const environment = {
    production: true,
    // API and SignalR are served through the same origin when running in Docker
    apiUrl: '/api',
    signalRUrl: '/hubs/whatsapp',
    encryptionKey: 'your-production-encryption-key-CHANGE-THIS'
};
