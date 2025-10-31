import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { WebSocketService } from '../../../core/services/websocket.service';
import { Message, MessageStatus } from '../types/message.types';

export interface MessageStatusUpdate {
    messageId: string | number;
    status: MessageStatus;
    timestamp: string;
    error?: string;
}

export interface NewMessageEvent {
    message: Message;
    deviceId: string | number;
}

@Injectable({
    providedIn: 'root'
})
export class RealtimeMessageService {
    constructor(private websocketService: WebSocketService) {}

    /**
     * Subscribe to message status updates
     */
    onMessageStatusUpdate(): Observable<MessageStatusUpdate> {
        return this.websocketService.on<MessageStatusUpdate>('message.status.update').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to new incoming messages
     */
    onNewMessage(): Observable<NewMessageEvent> {
        return this.websocketService.on<NewMessageEvent>('message.received').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to message sent events
     */
    onMessageSent(): Observable<Message> {
        return this.websocketService.on<Message>('message.sent').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to message delivered events
     */
    onMessageDelivered(): Observable<MessageStatusUpdate> {
        return this.websocketService.on<MessageStatusUpdate>('message.delivered').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to message read events
     */
    onMessageRead(): Observable<MessageStatusUpdate> {
        return this.websocketService.on<MessageStatusUpdate>('message.read').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }

    /**
     * Subscribe to message failed events
     */
    onMessageFailed(): Observable<MessageStatusUpdate> {
        return this.websocketService.on<MessageStatusUpdate>('message.failed').pipe(
            filter((message) => message.data !== null && message.data !== undefined),
            map((message) => message.data)
        );
    }
}
