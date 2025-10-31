export interface Device {
    id: string | number;
    name: string;
    phoneNumber: string;
    status: DeviceStatus;
    qrCode?: string;
    connected: boolean;
    lastSeen?: Date | string;
    battery?: number;
    platform?: string;
    apiKey?: string;
    webhookUrl?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export type DeviceStatus = 'connected' | 'disconnected' | 'connecting' | 'qr_code' | 'error';

export interface DeviceStats {
    totalDevices: number;
    connectedDevices: number;
    disconnectedDevices: number;
    messagesSent: number;
    messagesReceived: number;
}

export interface DeviceFormData {
    name: string;
    phoneNumber: string;
    webhookUrl?: string;
}

export interface DeviceAction {
    deviceId: string | number;
    action: 'connect' | 'disconnect' | 'restart' | 'delete' | 'regenerate_qr';
}

export interface QRCodeResponse {
    qrCode: string;
    expiresAt: Date | string;
}
