import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, DotNetApiResponse, convertDotNetResponse } from '@/core/ApiResponse';
import { IDevice } from './IDevice';
import { DotNetDevice, fromDotNetDevice, toDotNetDevice } from './device-adapter';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private apiUrl = `${environment.apiUrl}/device`;

    constructor(private http: HttpClient) {}

    getAllDevices(): Observable<ApiResponse<IDevice[]>> {
        return this.http
            .get<DotNetApiResponse<DotNetDevice[]>>(this.apiUrl)
            .pipe(
                map(convertDotNetResponse),
                map((response) => {
                    const dotNetDevices = (response.data ?? []) as DotNetDevice[];
                    const devices = dotNetDevices.map(fromDotNetDevice);

                    return {
                        ...response,
                        data: devices
                    };
                })
            );
    }

    createDevice(device: IDevice): Observable<ApiResponse<IDevice | null>> {
        const dotNetDevice = toDotNetDevice(device);

        return this.http
            .post<DotNetApiResponse<DotNetDevice>>(this.apiUrl, dotNetDevice)
            .pipe(
                map(convertDotNetResponse),
                map((response) => ({
                    ...response,
                    data: response.data ? fromDotNetDevice(response.data) : null
                }))
            );
    }

    updateDevice(device: IDevice): Observable<ApiResponse<IDevice | null>> {
        if (!device.id) {
            throw new Error('Device ID is required for update');
        }

        const dotNetDevice = toDotNetDevice(device);

        return this.http
            .put<DotNetApiResponse<DotNetDevice>>(`${this.apiUrl}/${device.id}`, dotNetDevice)
            .pipe(
                map(convertDotNetResponse),
                map((response) => ({
                    ...response,
                    data: response.data ? fromDotNetDevice(response.data) : null
                }))
            );
    }

    deleteDevice(id: number): Observable<ApiResponse<boolean>> {
        return this.http
            .delete<DotNetApiResponse<boolean>>(`${this.apiUrl}/${id}`)
            .pipe(map(convertDotNetResponse));
    }

    getQRCode(deviceId: number): Observable<string> {
        return this.http
            .get<DotNetApiResponse<string>>(`${this.apiUrl}/${deviceId}/qrcode`)
            .pipe(
                map(convertDotNetResponse),
                map((response) => response.data ?? ''),
                map((payload) => {
                    if (!payload) {
                        throw new Error('QR code payload is empty.');
                    }

                    return payload;
                })
            );
    }

    getQRCodeAsImage(deviceId: number): Observable<Blob> {
        // For now, return QR code as base64 and convert to blob
        return this.http
            .get<DotNetApiResponse<string>>(`${this.apiUrl}/${deviceId}/qrcode`)
            .pipe(
                map(convertDotNetResponse),
                map((response) => response.data ?? ''),
                map((payload) => {
                    if (!payload) {
                        throw new Error('QR code payload is empty.');
                    }

                    const base64Data = payload.includes(',') ? payload.split(',')[1] : payload;

                    if (!base64Data) {
                        throw new Error('QR code payload does not contain base64 data.');
                    }

                    const byteString = atob(base64Data);
                    const arrayBuffer = new ArrayBuffer(byteString.length);
                    const uint8Array = new Uint8Array(arrayBuffer);

                    for (let i = 0; i < byteString.length; i++) {
                        uint8Array[i] = byteString.charCodeAt(i);
                    }

                    return new Blob([uint8Array], { type: 'image/png' });
                })
            );
    }

    regenerateApiKey(device: IDevice): Observable<ApiResponse<IDevice>> {
        if (!device.id) {
            throw new Error('Device ID is required');
        }

        return this.http
            .post<DotNetApiResponse<string>>(`${this.apiUrl}/${device.id}/regenerate-apikey`, {})
            .pipe(
                map(convertDotNetResponse),
                map((response) => {
                    if (!response.data) {
                        return {
                            ...response,
                            isSuccess: false,
                            message: response.message || 'Empty API key response received.',
                            data: { ...device }
                        };
                    }

                    return {
                        ...response,
                        data: {
                            ...device,
                            newDeviceApiKey: response.data
                        }
                    };
                })
            );
    }
}
