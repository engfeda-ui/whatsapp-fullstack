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
                map(response => ({
                    ...response,
                    data: response.data.map(fromDotNetDevice)
                }))
            );
    }

    createDevice(device: IDevice): Observable<ApiResponse<IDevice>> {
        const dotNetDevice = toDotNetDevice(device);
        return this.http
            .post<DotNetApiResponse<DotNetDevice>>(this.apiUrl, dotNetDevice)
            .pipe(
                map(convertDotNetResponse),
                map(response => ({
                    ...response,
                    data: fromDotNetDevice(response.data)
                }))
            );
    }

    updateDevice(device: IDevice): Observable<ApiResponse<IDevice>> {
        if (!device.id) {
            throw new Error('Device ID is required for update');
        }
        const dotNetDevice = toDotNetDevice(device);
        return this.http
            .put<DotNetApiResponse<DotNetDevice>>(`${this.apiUrl}/${device.id}`, dotNetDevice)
            .pipe(
                map(convertDotNetResponse),
                map(response => ({
                    ...response,
                    data: fromDotNetDevice(response.data)
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
                map(response => response.data)
            );
    }

    getQRCodeAsImage(deviceId: number): Observable<Blob> {
        // For now, return QR code as base64 and convert to blob
        return this.http
            .get<DotNetApiResponse<string>>(`${this.apiUrl}/${deviceId}/qrcode`)
            .pipe(
                map(convertDotNetResponse),
                map(response => {
                    // Convert base64 QR code to blob
                    const base64Data = response.data.split(',')[1] || response.data;
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
                map(response => ({
                    ...response,
                    data: {
                        ...device,
                        newDeviceApiKey: response.data
                    }
                }))
            );
    }
}
