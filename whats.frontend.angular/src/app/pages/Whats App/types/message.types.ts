export interface Message {
    id: string | number;
    deviceId: string | number;
    to: string;
    from?: string;
    type: MessageType;
    content: string;
    mediaUrl?: string;
    mediaType?: MediaType;
    status: MessageStatus;
    timestamp?: Date | string;
    error?: string;
    metadata?: MessageMetadata;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export type MediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'audio/mpeg' | 'audio/ogg' | 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export interface MessageMetadata {
    retryCount?: number;
    deliveredAt?: Date | string;
    readAt?: Date | string;
    [key: string]: unknown;
}

export interface SingleMessageRequest {
    deviceId: string | number;
    to: string;
    message: string;
    mediaUrl?: string;
    mediaType?: MediaType;
}

export interface BulkMessageRequest {
    deviceId: string | number;
    recipients: string[];
    message: string;
    mediaUrl?: string;
    mediaType?: MediaType;
    delay?: number;
}

export interface MessageStats {
    totalMessages: number;
    sentMessages: number;
    deliveredMessages: number;
    failedMessages: number;
    pendingMessages: number;
}

export interface MessageFilter {
    deviceId?: string | number;
    status?: MessageStatus;
    type?: MessageType;
    startDate?: Date | string;
    endDate?: Date | string;
    search?: string;
}

export interface MediaFile {
    file: File;
    type: MediaType;
    url?: string;
    preview?: string;
    size: number;
    name: string;
}
