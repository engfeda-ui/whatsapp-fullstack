import { Injectable, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: unknown;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    icon?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'device' | 'message' | 'subscription' | 'system';

export interface NotificationOptions {
    sticky?: boolean;
    life?: number;
    closable?: boolean;
    sound?: boolean;
    desktop?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements OnDestroy {
    private notifications: Notification[] = [];
    private notificationSubject = new Subject<Notification>();
    private audioContext?: AudioContext;
    private destroy$ = new Subject<void>();

    constructor(private messageService: MessageService) {
        this.requestNotificationPermission();
        this.loadNotifications();
    }

    /**
     * Show toast notification
     */
    showToast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail?: string, options?: NotificationOptions): void {
        this.messageService.add({
            severity,
            summary,
            detail,
            sticky: options?.sticky || false,
            life: options?.life || 3000,
            closable: options?.closable !== false
        });

        if (options?.sound) {
            this.playNotificationSound(severity);
        }

        if (options?.desktop && this.canShowDesktopNotification()) {
            this.showDesktopNotification(summary, detail);
        }
    }

    /**
     * Show success notification
     */
    success(message: string, title: string = 'Success', options?: NotificationOptions): void {
        this.showToast('success', title, message, options);
        this.addNotification('success', title, message);
    }

    /**
     * Show info notification
     */
    info(message: string, title: string = 'Info', options?: NotificationOptions): void {
        this.showToast('info', title, message, options);
        this.addNotification('info', title, message);
    }

    /**
     * Show warning notification
     */
    warning(message: string, title: string = 'Warning', options?: NotificationOptions): void {
        this.showToast('warn', title, message, options);
        this.addNotification('warning', title, message);
    }

    /**
     * Show error notification
     */
    error(message: string, title: string = 'Error', options?: NotificationOptions): void {
        this.showToast('error', title, message, { ...options, sticky: true });
        this.addNotification('error', title, message);
    }

    /**
     * Show device notification
     */
    deviceNotification(action: string, deviceName: string, options?: NotificationOptions): void {
        const message = `Device "${deviceName}" ${action}`;
        this.showToast('info', 'Device Update', message, {
            ...options,
            sound: true,
            desktop: true
        });
        this.addNotification('device', 'Device Update', message);
    }

    /**
     * Show message notification
     */
    messageNotification(type: 'sent' | 'delivered' | 'read' | 'failed', count: number = 1, options?: NotificationOptions): void {
        const messages = {
            sent: `${count} message(s) sent successfully`,
            delivered: `${count} message(s) delivered`,
            read: `${count} message(s) read`,
            failed: `${count} message(s) failed to send`
        };

        const severity = type === 'failed' ? 'error' : 'success';
        this.showToast(severity, 'Message Update', messages[type], {
            ...options,
            sound: true
        });
        this.addNotification('message', 'Message Update', messages[type]);
    }

    /**
     * Show subscription notification
     */
    subscriptionNotification(type: 'expiring' | 'expired' | 'renewed', planName: string, daysRemaining?: number): void {
        let message = '';
        let severity: 'success' | 'info' | 'warn' | 'error' = 'info';

        switch (type) {
            case 'expiring':
                message = `Your "${planName}" subscription expires in ${daysRemaining} days`;
                severity = 'warn';
                break;
            case 'expired':
                message = `Your "${planName}" subscription has expired`;
                severity = 'error';
                break;
            case 'renewed':
                message = `Your "${planName}" subscription has been renewed`;
                severity = 'success';
                break;
        }

        this.showToast(severity, 'Subscription', message, {
            sticky: type !== 'renewed',
            sound: true,
            desktop: true
        });
        this.addNotification('subscription', 'Subscription', message);
    }

    /**
     * Get all notifications
     */
    getNotifications(): Notification[] {
        return [...this.notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * Get unread notifications
     */
    getUnreadNotifications(): Notification[] {
        return this.notifications.filter((n) => !n.read);
    }

    /**
     * Get unread count
     */
    getUnreadCount(): number {
        return this.notifications.filter((n) => !n.read).length;
    }

    /**
     * Mark notification as read
     */
    markAsRead(id: string): void {
        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    /**
     * Mark all as read
     */
    markAllAsRead(): void {
        this.notifications.forEach((n) => (n.read = true));
        this.saveNotifications();
    }

    /**
     * Delete notification
     */
    deleteNotification(id: string): void {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        this.saveNotifications();
    }

    /**
     * Clear all notifications
     */
    clearAll(): void {
        this.notifications = [];
        this.saveNotifications();
    }

    /**
     * Subscribe to notifications
     */
    onNotification(type?: NotificationType): Observable<Notification> {
        if (type) {
            return this.notificationSubject.asObservable().pipe(filter((n) => n.type === type));
        }
        return this.notificationSubject.asObservable();
    }

    /**
     * Request desktop notification permission
     */
    private requestNotificationPermission(): void {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    /**
     * Check if can show desktop notification
     */
    private canShowDesktopNotification(): boolean {
        return 'Notification' in window && Notification.permission === 'granted';
    }

    /**
     * Show desktop notification
     */
    private showDesktopNotification(title: string, body?: string): void {
        if (this.canShowDesktopNotification()) {
            const notification = new Notification(title, {
                body,
                icon: '/assets/icons/icon-72x72.png',
                badge: '/assets/icons/icon-72x72.png',
                tag: 'whatsapp-notification',
                requireInteraction: false
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            setTimeout(() => notification.close(), 5000);
        }
    }

    /**
     * Add notification to list
     */
    private addNotification(type: NotificationType, title: string, message: string, data?: unknown): void {
        const notification: Notification = {
            id: this.generateId(),
            type,
            title,
            message,
            data,
            timestamp: new Date(),
            read: false
        };

        this.notifications.unshift(notification);

        // Keep only last 100 notifications
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }

        this.notificationSubject.next(notification);
        this.saveNotifications();
    }

    /**
     * Play notification sound
     */
    private playNotificationSound(type: 'success' | 'info' | 'warn' | 'error'): void {
        try {
            const audioPath = `/assets/sounds/${type}.mp3`;
            const audio = new Audio(audioPath);
            audio.volume = 0.5;
            audio.play().catch((e) => console.warn('Could not play sound:', e));
        } catch (error) {
            console.warn('Audio playback error:', error);
        }
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Save notifications to localStorage
     */
    private saveNotifications(): void {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.warn('Could not save notifications:', error);
        }
    }

    /**
     * Load notifications from localStorage
     */
    private loadNotifications(): void {
        try {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                this.notifications = JSON.parse(saved).map((n: Notification) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                }));
            }
        } catch (error) {
            console.warn('Could not load notifications:', error);
            this.notifications = [];
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.notificationSubject.complete();
    }
}
