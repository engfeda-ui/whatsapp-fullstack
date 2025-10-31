import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, DotNetApiResponse, convertDotNetResponse } from '@/core/ApiResponse';
import { Imessage } from './Imessage';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private readonly http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/whatsapp`;

    sendMessage(message: Imessage, deviceId: number): Observable<ApiResponse<any>> {
        return this.http
            .post<DotNetApiResponse<any>>(`${this.apiUrl}/send-message`, {
                deviceId: deviceId,
                to: message.number,
                message: message.message
            })
            .pipe(map(convertDotNetResponse));
    }

    // For direct media URL (when you have a URL to media)
    sendMediaMessageWithUrl(deviceId: number, to: string, mediaUrl: string, mediaType: string, caption?: string): Observable<ApiResponse<any>> {
        return this.http
            .post<DotNetApiResponse<any>>(`${this.apiUrl}/send-media`, {
                deviceId: deviceId,
                to: to,
                mediaUrl: mediaUrl,
                mediaType: mediaType,
                caption: caption
            })
            .pipe(map(convertDotNetResponse));
    }

    // For FormData from components (temporary implementation)
    // TODO: In production, upload file to storage first, then use sendMediaMessageWithUrl
    sendMediaMessage(formData: FormData, deviceId: number): Observable<ApiResponse<any>> {
        // Extract values from FormData
        const to = formData.get('Number') as string;
        const caption = formData.get('Message') as string;
        const file = formData.get('File') as File;

        // For now, use a placeholder URL. In production, upload the file first
        const mediaUrl = 'https://placeholder.com/media/' + file.name;
        const mediaType = this.getMediaType(file.type);

        return this.sendMediaMessageWithUrl(deviceId, to, mediaUrl, mediaType, caption);
    }

    private getMediaType(mimeType: string): string {
        if (mimeType.startsWith('image/')) {return 'image';}

        if (mimeType.startsWith('video/')) {return 'video';}

        if (mimeType.startsWith('audio/')) {return 'audio';}

        return 'document';
    }

    sendMessageToMultipleNumbers(deviceId: number, recipients: string[], message: string): Observable<ApiResponse<any>> {
        return this.http
            .post<DotNetApiResponse<any>>(`${this.apiUrl}/send-bulk`, {
                deviceId: deviceId,
                recipients: recipients,
                message: message
            })
            .pipe(map(convertDotNetResponse));
    }

    // Alias for compatibility with old code
    sendMediaMessageToMultipleNumbers(formData: FormData, deviceId: number): Observable<ApiResponse<any>> {
        // Extract recipients from formData if present, otherwise use placeholder
        // TODO: Implement proper file upload and bulk media sending
        const recipients: string[] = [];
        const message = formData.get('Message') as string || '';

        return this.sendMessageToMultipleNumbers(deviceId, recipients, message);
    }

    getMessages(deviceId: number, limit: number = 50): Observable<ApiResponse<any[]>> {
        return this.http
            .get<DotNetApiResponse<any[]>>(`${this.apiUrl}/messages/${deviceId}?limit=${limit}`)
            .pipe(map(convertDotNetResponse));
    }

    getMessageById(messageId: number): Observable<ApiResponse<any>> {
        return this.http
            .get<DotNetApiResponse<any>>(`${this.apiUrl}/message/${messageId}`)
            .pipe(map(convertDotNetResponse));
    }
}
