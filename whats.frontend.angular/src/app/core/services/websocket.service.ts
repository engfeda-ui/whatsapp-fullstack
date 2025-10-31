import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timer, EMPTY } from 'rxjs';
import { retryWhen, tap, delayWhen, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface WebSocketMessage<T = unknown> {
    type: string;
    event: string;
    data: T;
    timestamp: string;
}

export interface ConnectionStatus {
    connected: boolean;
    reconnecting: boolean;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
    private socket: WebSocket | null = null;
    private messageSubject = new Subject<WebSocketMessage>();
    private connectionStatusSubject = new Subject<ConnectionStatus>();
    private destroy$ = new Subject<void>();
    private reconnectAttempts = 0;
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly RECONNECT_DELAY = 3000; // 3 seconds
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    constructor(private tokenService: TokenService) {}

    /**
     * Connect to WebSocket server
     */
    connect(): Observable<WebSocketMessage> {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            return this.messageSubject.asObservable();
        }

        this.initializeWebSocket();

        return this.messageSubject.asObservable().pipe(
            retryWhen((errors) =>
                errors.pipe(
                    tap(() => this.handleReconnect()),
                    delayWhen(() => timer(this.RECONNECT_DELAY))
                )
            ),
            takeUntil(this.destroy$)
        );
    }

    /**
     * Send message through WebSocket
     */
    send<T>(message: WebSocketMessage<T>): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        try {
            this.socket.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
        }
    }

    /**
     * Subscribe to specific event type
     */
    on<T>(eventType: string): Observable<WebSocketMessage<T>> {
        return new Observable((observer) => {
            const subscription = this.messageSubject.subscribe((message) => {
                if (message.event === eventType) {
                    observer.next(message as WebSocketMessage<T>);
                }
            });

            return () => subscription.unsubscribe();
        });
    }

    /**
     * Get connection status as observable
     */
    getConnectionStatus(): Observable<ConnectionStatus> {
        return this.connectionStatusSubject.asObservable();
    }

    /**
     * Disconnect WebSocket
     */
    disconnect(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        this.updateConnectionStatus({ connected: false, reconnecting: false });
    }

    /**
     * Check if WebSocket is connected
     */
    isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    private initializeWebSocket(): void {
        try {
            const token = this.tokenService.getToken();

            if (!token) {
                console.error('No authentication token available');
                return;
            }

            // Construct WebSocket URL from API URL
            const wsUrl = this.getWebSocketUrl();
            this.socket = new WebSocket(`${wsUrl}?token=${token}`);

            this.socket.onopen = () => this.handleOpen();
            this.socket.onmessage = (event) => this.handleMessage(event);
            this.socket.onerror = (error) => this.handleError(error);
            this.socket.onclose = (event) => this.handleClose(event);
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
            this.updateConnectionStatus({
                connected: false,
                reconnecting: false,
                error: 'Failed to initialize WebSocket connection'
            });
        }
    }

    private getWebSocketUrl(): string {
        // Convert HTTP(S) URL to WS(S)
        const apiUrl = environment.apiUrl;
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const urlWithoutProtocol = apiUrl.replace(/^https?:\/\//, '');

        return `${wsProtocol}://${urlWithoutProtocol}/ws`;
    }

    private handleOpen(): void {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.updateConnectionStatus({ connected: true, reconnecting: false });
        this.startHeartbeat();
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.messageSubject.next(message);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus({
            connected: false,
            reconnecting: true,
            error: 'WebSocket connection error'
        });
    }

    private handleClose(event: CloseEvent): void {
        console.log('WebSocket closed:', event.code, event.reason);

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        this.updateConnectionStatus({ connected: false, reconnecting: false });

        // Attempt reconnection if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
            this.handleReconnect();
        }
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            console.error('Max reconnection attempts reached');
            this.updateConnectionStatus({
                connected: false,
                reconnecting: false,
                error: 'Failed to reconnect after maximum attempts'
            });
            return;
        }

        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`);

        this.updateConnectionStatus({ connected: false, reconnecting: true });

        setTimeout(() => {
            this.initializeWebSocket();
        }, this.RECONNECT_DELAY);
    }

    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected()) {
                this.send({
                    type: 'ping',
                    event: 'heartbeat',
                    data: { timestamp: new Date().toISOString() },
                    timestamp: new Date().toISOString()
                });
            }
        }, 30000); // Send heartbeat every 30 seconds
    }

    private updateConnectionStatus(status: ConnectionStatus): void {
        this.connectionStatusSubject.next(status);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.disconnect();
        this.messageSubject.complete();
        this.connectionStatusSubject.complete();
    }
}
