# WebSocket Integration Guide

## Overview

This guide explains how to use the WebSocket service for real-time updates in the WhatsApp Frontend application.

---

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Angular   │ ◄──────────────► │   Backend   │
│  Frontend   │   (ws://api/ws)   │   Server    │
└─────────────┘                    └─────────────┘
      │                                   │
      ├── WebSocketService               ├── Event Emitter
      ├── RealtimeDeviceService          ├── Device Status
      └── RealtimeMessageService         └── Message Updates
```

---

## WebSocket Service

### Basic Usage

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from './core/services/websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <p>Connection Status: {{ connectionStatus }}</p>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  connectionStatus = 'Disconnected';
  private destroy$ = new Subject<void>();

  constructor(private websocketService: WebSocketService) {}

  ngOnInit(): void {
    // Connect to WebSocket
    this.websocketService.connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          console.log('Received message:', message);
        },
        error: (error) => {
          console.error('WebSocket error:', error);
        }
      });

    // Monitor connection status
    this.websocketService.getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.connectionStatus = status.connected ? 'Connected' : 'Disconnected';

        if (status.error) {
          console.error('Connection error:', status.error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.disconnect();
  }
}
```

---

## Real-time Device Updates

### Device Status Updates

```typescript
import { Component, OnInit } from '@angular/core';
import { RealtimeDeviceService } from './pages/Whats App/device/realtime-device.service';
import { WebSocketService } from './core/services/websocket.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html'
})
export class DeviceListComponent implements OnInit {
  devices: Device[] = [];

  constructor(
    private websocketService: WebSocketService,
    private realtimeDeviceService: RealtimeDeviceService
  ) {}

  ngOnInit(): void {
    // Connect WebSocket
    this.websocketService.connect().subscribe();

    // Listen for device status updates
    this.realtimeDeviceService.onDeviceStatusUpdate()
      .subscribe(update => {
        console.log('Device status update:', update);

        // Update device in list
        const device = this.devices.find(d => d.id === update.deviceId);
        if (device) {
          device.status = update.status;
          device.connected = update.connected;
          device.battery = update.battery;
          device.lastSeen = update.lastSeen;
        }
      });

    // Listen for device connections
    this.realtimeDeviceService.onDeviceConnected()
      .subscribe(update => {
        console.log('Device connected:', update.deviceId);
        this.showNotification('Device connected successfully');
      });

    // Listen for device disconnections
    this.realtimeDeviceService.onDeviceDisconnected()
      .subscribe(update => {
        console.log('Device disconnected:', update.deviceId);
        this.showNotification('Device disconnected', 'warning');
      });
  }

  showNotification(message: string, severity: string = 'success'): void {
    // Show toast notification
  }
}
```

### QR Code Updates

```typescript
connectDevice(deviceId: string): void {
  // Request QR code
  this.realtimeDeviceService.requestQRCode(deviceId);

  // Listen for QR code updates
  this.realtimeDeviceService.onQRCodeUpdate()
    .subscribe(update => {
      if (update.deviceId === deviceId) {
        this.displayQRCode(update.qrCode);

        // Auto-refresh QR code before expiration
        const expiresAt = new Date(update.expiresAt);
        const refreshTime = expiresAt.getTime() - Date.now() - 5000; // 5s before expiry

        if (refreshTime > 0) {
          setTimeout(() => {
            this.realtimeDeviceService.requestQRCode(deviceId);
          }, refreshTime);
        }
      }
    });
}
```

---

## Real-time Message Updates

### Message Status Tracking

```typescript
import { Component, OnInit } from '@angular/core';
import { RealtimeMessageService } from './pages/Whats App/message/realtime-message.service';
import { WebSocketService } from './core/services/websocket.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html'
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(
    private websocketService: WebSocketService,
    private realtimeMessageService: RealtimeMessageService
  ) {}

  ngOnInit(): void {
    // Connect WebSocket
    this.websocketService.connect().subscribe();

    // Track message status updates
    this.subscribeToMessageUpdates();
  }

  private subscribeToMessageUpdates(): void {
    // Message sent
    this.realtimeMessageService.onMessageSent()
      .subscribe(message => {
        console.log('Message sent:', message.id);
        this.updateMessageStatus(message.id, 'sent');
      });

    // Message delivered
    this.realtimeMessageService.onMessageDelivered()
      .subscribe(update => {
        console.log('Message delivered:', update.messageId);
        this.updateMessageStatus(update.messageId, 'delivered');
      });

    // Message read
    this.realtimeMessageService.onMessageRead()
      .subscribe(update => {
        console.log('Message read:', update.messageId);
        this.updateMessageStatus(update.messageId, 'read');
      });

    // Message failed
    this.realtimeMessageService.onMessageFailed()
      .subscribe(update => {
        console.error('Message failed:', update.messageId, update.error);
        this.updateMessageStatus(update.messageId, 'failed', update.error);
      });

    // New incoming message
    this.realtimeMessageService.onNewMessage()
      .subscribe(event => {
        console.log('New message received:', event.message);
        this.messages.unshift(event.message);
        this.playNotificationSound();
      });
  }

  private updateMessageStatus(
    messageId: string | number,
    status: MessageStatus,
    error?: string
  ): void {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.status = status;
      if (error) {
        message.error = error;
      }
    }
  }

  private playNotificationSound(): void {
    const audio = new Audio('/assets/sounds/notification.mp3');
    audio.play().catch(e => console.error('Audio play failed:', e));
  }
}
```

---

## Custom Event Handling

### Sending Custom Events

```typescript
sendCustomEvent(): void {
  this.websocketService.send({
    type: 'request',
    event: 'custom.action',
    data: {
      action: 'refresh',
      target: 'devices'
    },
    timestamp: new Date().toISOString()
  });
}
```

### Listening to Custom Events

```typescript
this.websocketService.on<CustomData>('custom.event')
  .subscribe(message => {
    console.log('Custom event:', message.data);
    // Handle custom event
  });
```

---

## Connection Management

### Auto-reconnection

The WebSocket service automatically handles reconnection:

```typescript
// Configuration in websocket.service.ts
private readonly MAX_RECONNECT_ATTEMPTS = 5;
private readonly RECONNECT_DELAY = 3000; // 3 seconds
```

### Manual Connection Control

```typescript
// Connect
this.websocketService.connect().subscribe();

// Check connection
if (this.websocketService.isConnected()) {
  console.log('WebSocket is connected');
}

// Disconnect
this.websocketService.disconnect();
```

### Connection Status UI

```typescript
@Component({
  selector: 'app-connection-indicator',
  template: `
    <div class="connection-status" [class.connected]="isConnected">
      <i class="pi" [class.pi-check-circle]="isConnected"
         [class.pi-times-circle]="!isConnected"></i>
      <span>{{ statusText }}</span>
    </div>
  `,
  styles: [`
    .connection-status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      border-radius: 20px;
      background: #f44336;
      color: white;
      transition: all 0.3s;
    }
    .connection-status.connected {
      background: #4caf50;
    }
  `]
})
export class ConnectionIndicatorComponent implements OnInit {
  isConnected = false;
  statusText = 'Disconnected';

  constructor(private websocketService: WebSocketService) {}

  ngOnInit(): void {
    this.websocketService.getConnectionStatus()
      .subscribe(status => {
        this.isConnected = status.connected;

        if (status.connected) {
          this.statusText = 'Connected';
        } else if (status.reconnecting) {
          this.statusText = 'Reconnecting...';
        } else {
          this.statusText = 'Disconnected';
        }
      });
  }
}
```

---

## Error Handling

### Handle Connection Errors

```typescript
this.websocketService.getConnectionStatus()
  .subscribe(status => {
    if (status.error) {
      switch (status.error) {
        case 'WebSocket connection error':
          this.showError('Connection failed. Please check your internet.');
          break;
        case 'Failed to reconnect after maximum attempts':
          this.showError('Unable to connect. Please refresh the page.');
          break;
        default:
          this.showError(status.error);
      }
    }
  });
```

### Handle Message Errors

```typescript
this.websocketService.connect()
  .subscribe({
    next: (message) => {
      // Handle message
    },
    error: (error) => {
      console.error('WebSocket stream error:', error);
      // Attempt to reconnect or show error
    },
    complete: () => {
      console.log('WebSocket connection closed');
    }
  });
```

---

## Best Practices

### 1. Always Clean Up Subscriptions

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.websocketService.connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. Use Connection Status for UI

Show loading states when reconnecting:

```html
<div *ngIf="connectionStatus.reconnecting">
  <p-progressSpinner></p-progressSpinner>
  <p>Reconnecting...</p>
</div>
```

### 3. Implement Heartbeat Monitoring

The service automatically sends heartbeat every 30 seconds to keep connection alive.

### 4. Buffer Messages During Disconnection

```typescript
private messageQueue: WebSocketMessage[] = [];

sendMessage(message: WebSocketMessage): void {
  if (this.websocketService.isConnected()) {
    this.websocketService.send(message);
  } else {
    this.messageQueue.push(message);
    this.showWarning('Message queued. Will send when reconnected.');
  }
}

// When reconnected
this.websocketService.getConnectionStatus()
  .subscribe(status => {
    if (status.connected && this.messageQueue.length > 0) {
      this.messageQueue.forEach(msg => this.websocketService.send(msg));
      this.messageQueue = [];
    }
  });
```

---

## Backend Integration

### Expected Message Format

```json
{
  "type": "event",
  "event": "device.status.update",
  "data": {
    "deviceId": "123",
    "status": "connected",
    "connected": true,
    "battery": 85
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### Backend Event Types

| Event | Description |
|-------|-------------|
| `device.status.update` | Device status changed |
| `device.connected` | Device connected |
| `device.disconnected` | Device disconnected |
| `device.qrcode.update` | New QR code generated |
| `message.sent` | Message sent successfully |
| `message.delivered` | Message delivered to recipient |
| `message.read` | Message read by recipient |
| `message.failed` | Message sending failed |
| `message.received` | New incoming message |

---

## Testing

### Unit Tests

```typescript
describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService, TokenService]
    });
    service = TestBed.inject(WebSocketService);
  });

  it('should handle connection', (done) => {
    service.getConnectionStatus().subscribe(status => {
      expect(status).toBeDefined();
      done();
    });
  });
});
```

### Integration Testing

Use tools like:
- **wscat**: `npm install -g wscat`
- **Postman**: WebSocket request support

```bash
# Test WebSocket connection
wscat -c ws://localhost:3000/ws?token=your_jwt_token
```

---

## Troubleshooting

### WebSocket not connecting

1. Check API URL in environment
2. Verify token is valid
3. Check browser console for errors
4. Ensure backend WebSocket endpoint is running

### Messages not received

1. Check subscription is active
2. Verify event type matches
3. Check backend is emitting events
4. Enable WebSocket debug logs

### Performance issues

1. Limit number of subscriptions
2. Use `takeUntil` to clean up
3. Debounce frequent updates
4. Consider pagination for large data sets

---

**Last Updated:** 2025-10-30
**Version:** 2.0.0
