import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { WebSocketService } from '../../../core/services/websocket.service';
import { DeviceStatus } from '../types/device.types';

export interface DeviceStatusUpdate {
    deviceId: string | number;
    status: DeviceStatus;
    connected: boolean;
    battery?: number;
    lastSeen?: string;
}

export interface DeviceQRCodeUpdate {
    deviceId: string | number;
    qrCode: string;
    expiresAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class RealtimeDeviceService {
    private websocketService = inject(WebSocketService);

    /**
     * Subscribe to device status updates
     */
    onDeviceStatusUpdate(): Observable<DeviceStatusUpdate> {
        return this.websocketService.on<DeviceStatusUpdate>('device.status.update').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to QR code updates for a specific device
     */
    onQRCodeUpdate(): Observable<DeviceQRCodeUpdate> {
        return this.websocketService.on<DeviceQRCodeUpdate>('device.qrcode.update').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to device connection events
     */
    onDeviceConnected(): Observable<DeviceStatusUpdate> {
        return this.websocketService.on<DeviceStatusUpdate>('device.connected').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to device disconnection events
     */
    onDeviceDisconnected(): Observable<DeviceStatusUpdate> {
        return this.websocketService.on<DeviceStatusUpdate>('device.disconnected').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Request device status update
     */
    requestDeviceStatus(deviceId: string | number): void {
        this.websocketService.send({
            type: 'request',
            event: 'device.status.get',
            data: { deviceId },
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Request QR code generation
     */
    requestQRCode(deviceId: string | number): void {
        this.websocketService.send({
            type: 'request',
            event: 'device.qrcode.generate',
            data: { deviceId },
            timestamp: new Date().toISOString()
        });
    }
}
