# Advanced Features Guide - Phase 3

## Overview

This document covers the advanced enterprise features added in Phase 3, transforming the application into a feature-rich, production-ready platform.

---

## 📊 1. Advanced Analytics Dashboard

### Features

- **Real-time Metrics**: Live performance monitoring
- **Message Analytics**: Comprehensive message tracking and statistics
- **Cost Analysis**: Detailed cost breakdowns and projections
- **Usage Statistics**: Peak hours, busy days, user activity
- **Custom Reports**: Exportable analytics in multiple formats

### Usage

```typescript
import { AnalyticsService } from './pages/analytics/analytics.service';

export class DashboardComponent implements OnInit {
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Get overview
    this.analyticsService.getOverview({
      dateRange: {
        startDate: new Date('2025-01-01'),
        endDate: new Date()
      }
    }).subscribe(overview => {
      console.log('Total Messages:', overview.totalMessages);
      console.log('Delivery Rate:', overview.deliveryRate);
      console.log('Total Cost:', overview.totalCost);
    });

    // Get message analytics
    this.analyticsService.getMessageAnalytics()
      .subscribe(analytics => {
        console.log('Messages by type:', analytics.byType);
        console.log('Messages by device:', analytics.byDevice);
      });

    // Get performance metrics
    this.analyticsService.getPerformanceMetrics()
      .subscribe(metrics => {
        console.log('Avg delivery time:', metrics.avgMessageDeliveryTime);
        console.log('Error rate:', metrics.errorRate);
      });
  }
}
```

### Available Metrics

| Metric | Description | Type |
|--------|-------------|------|
| `totalMessages` | Total messages sent | number |
| `deliveryRate` | Percentage of delivered messages | percentage |
| `readRate` | Percentage of read messages | percentage |
| `failureRate` | Percentage of failed messages | percentage |
| `avgResponseTime` | Average API response time | milliseconds |
| `totalCost` | Total messaging cost | currency |
| `activeDevices` | Currently active devices | number |

### Charts & Visualizations

```typescript
// Get chart data for PrimeNG
this.analyticsService.getChartData('messages-by-hour')
  .subscribe(chartData => {
    this.chartOptions = {
      labels: chartData.labels,
      datasets: chartData.datasets
    };
  });

// Available chart types:
// - messages-by-hour
// - messages-by-day
// - messages-by-type
// - devices-performance
// - cost-breakdown
```

### Export Analytics

```typescript
// Export to Excel
this.analyticsService.exportData('excel', {
  dateRange: {
    startDate: this.startDate,
    endDate: this.endDate
  }
}).subscribe(blob => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'analytics-report.xlsx';
  link.click();
});
```

---

## 📝 2. Message Templates System

### Features

- **Template Management**: Create, edit, and organize templates
- **Variable Support**: Dynamic content with {{variable}} syntax
- **Multi-language**: Support for multiple languages
- **Categories**: Organize templates by category
- **Quick Replies**: Pre-defined quick responses
- **Bulk Messaging**: Send to multiple recipients with template
- **Import/Export**: Bulk template operations

### Creating Templates

```typescript
import { TemplateService } from './pages/templates/template.service';

this.templateService.createTemplate({
  name: 'Welcome Message',
  content: 'Hello {{name}}, welcome to {{company}}! Your order #{{order_id}} is confirmed.',
  category: 'transactional',
  language: 'en',
  variables: [
    { key: 'name', label: 'Customer Name', type: 'text', required: true },
    { key: 'company', label: 'Company Name', type: 'text', required: true },
    { key: 'order_id', label: 'Order ID', type: 'text', required: true }
  ]
}).subscribe(template => {
  console.log('Template created:', template.id);
});
```

### Using Templates

```typescript
// Preview template
this.templateService.previewTemplate(templateId, {
  name: 'John Doe',
  company: 'Acme Corp',
  order_id: '12345'
}).subscribe(preview => {
  console.log('Preview:', preview.content);
  // Output: "Hello John Doe, welcome to Acme Corp! Your order #12345 is confirmed."
});

// Send bulk messages
this.templateService.sendBulkMessages({
  templateId: templateId,
  recipients: [
    {
      phoneNumber: '+1234567890',
      variables: { name: 'John', company: 'Acme', order_id: '001' }
    },
    {
      phoneNumber: '+9876543210',
      variables: { name: 'Jane', company: 'Acme', order_id: '002' }
    }
  ]
}).subscribe(result => {
  console.log(`${result.success} messages sent, ${result.failed} failed`);
});
```

### Template Categories

- **Marketing**: Promotional campaigns
- **Transactional**: Order confirmations, receipts
- **OTP**: One-time passwords
- **Customer Service**: Support responses
- **Notification**: System notifications
- **Promotional**: Special offers
- **Custom**: User-defined categories

### Variable Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Plain text | Customer name |
| `number` | Numeric value | Order ID, Price |
| `date` | Date/time | Delivery date |
| `url` | Web link | Tracking URL |
| `phone` | Phone number | Contact number |

### Quick Replies

```typescript
// Create quick reply
this.templateService.createQuickReply({
  text: 'Thank you for your message!',
  category: 'customer_service',
  order: 1
}).subscribe();

// Get quick replies
this.templateService.getQuickReplies('customer_service')
  .subscribe(replies => {
    // Display in UI for one-click responses
  });
```

---

## 🖼️ 3. Enhanced Media Management

### Features

- **Media Library**: Centralized media storage
- **Upload Manager**: Multiple file uploads with progress
- **Thumbnail Generation**: Automatic thumbnail creation
- **Image Processing**: Compression, resize, format conversion
- **Folder Organization**: Organize media in folders
- **Bulk Operations**: Delete, move, tag multiple files
- **Storage Analytics**: Track usage and storage limits
- **Share Links**: Generate shareable links with expiry
- **Multiple Storage Providers**: Local, S3, Azure, Cloudinary

### Upload Media

```typescript
import { MediaService } from './pages/media/media.service';

// Single file upload
const file = event.target.files[0];

this.mediaService.uploadMedia({
  file: file,
  tags: ['product', 'promotional'],
  generateThumbnail: true,
  compress: true,
  quality: 85
}).subscribe(event => {
  if (event.type === HttpEventType.UploadProgress) {
    const progress = Math.round(100 * event.loaded / event.total);
    console.log(`Upload ${progress}%`);
  } else if (event.type === HttpEventType.Response) {
    console.log('Upload complete:', event.body);
  }
});

// Multiple files upload
this.mediaService.uploadMultiple(filesArray)
  .subscribe(uploadedFiles => {
    console.log(`${uploadedFiles.length} files uploaded`);
  });
```

### Media Library

```typescript
// Get all media files
this.mediaService.getMediaFiles({
  mimeType: 'image/',
  tags: ['product'],
  search: 'logo',
  minSize: 100000, // 100KB
  maxSize: 5000000 // 5MB
}, {
  pageNumber: 1,
  pageSize: 20
}).subscribe(response => {
  this.mediaFiles = response.data;
  this.totalCount = response.total;
});

// Get media statistics
this.mediaService.getStatistics()
  .subscribe(stats => {
    console.log('Total files:', stats.totalFiles);
    console.log('Total size:', this.mediaService.formatFileSize(stats.totalSize));
    console.log('Storage used:', `${stats.storageUsed}%`);
  });
```

### Image Processing

```typescript
// Generate thumbnail
this.mediaService.generateThumbnail(fileId, {
  width: 200,
  height: 200,
  quality: 80,
  format: 'webp'
}).subscribe(thumbnailUrl => {
  console.log('Thumbnail URL:', thumbnailUrl);
});

// Compress image
this.mediaService.compressImage(fileId, 70)
  .subscribe(compressedFile => {
    console.log('Original size:', originalSize);
    console.log('Compressed size:', compressedFile.size);
    console.log('Savings:', `${((1 - compressedFile.size/originalSize) * 100).toFixed(1)}%`);
  });

// Convert format
this.mediaService.convertFormat(fileId, 'webp')
  .subscribe(convertedFile => {
    console.log('Converted to WebP:', convertedFile.url);
  });
```

### Folder Organization

```typescript
// Create folder
this.mediaService.createFolder({
  name: 'Product Images',
  description: 'All product photos',
  parentId: null,
  color: '#3498db',
  icon: 'pi-images'
}).subscribe(folder => {
  console.log('Folder created:', folder.id);
});

// Move files to folder
this.mediaService.moveToFolder([file1Id, file2Id], folderId)
  .subscribe(() => {
    console.log('Files moved successfully');
  });
```

### Bulk Operations

```typescript
// Delete multiple files
this.mediaService.bulkOperation({
  operation: 'delete',
  fileIds: [1, 2, 3, 4, 5]
}).subscribe(result => {
  console.log(`${result.success} deleted, ${result.failed} failed`);
});

// Tag multiple files
this.mediaService.bulkOperation({
  operation: 'tag',
  fileIds: selectedFileIds,
  tags: ['summer-2025', 'campaign']
}).subscribe();
```

### Share Links

```typescript
// Create shareable link
this.mediaService.createShareLink(fileId, {
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  password: 'optional-password',
  downloadLimit: 10
}).subscribe(shareUrl => {
  console.log('Share link:', shareUrl);
  // Copy to clipboard or share
});
```

### File Validation

```typescript
// Validate file type
const allowedTypes = ['image/*', 'video/mp4', 'application/pdf'];
if (this.mediaService.isValidFileType(file, allowedTypes)) {
  // Proceed with upload
}

// Validate file size (max 10MB)
if (this.mediaService.isValidFileSize(file, 10)) {
  // Proceed with upload
} else {
  this.showError('File size exceeds 10MB limit');
}
```

---

## 🔔 4. Advanced Notification System

### Features

- **Toast Notifications**: In-app toast messages
- **Desktop Notifications**: Browser push notifications
- **Sound Alerts**: Audio notifications for important events
- **Notification Center**: Centralized notification history
- **Read/Unread Tracking**: Mark notifications as read
- **Type-based Filtering**: Filter by notification type
- **Persistent Storage**: Save notifications locally

### Basic Usage

```typescript
import { NotificationService } from './core/services/notification.service';

constructor(private notificationService: NotificationService) {}

// Success notification
this.notificationService.success(
  'Device connected successfully',
  'Device Status',
  { sound: true, desktop: true }
);

// Error notification
this.notificationService.error(
  'Failed to send message',
  'Message Error',
  { sticky: true }
);

// Warning notification
this.notificationService.warning(
  'Subscription expires in 3 days',
  'Subscription Warning'
);

// Info notification
this.notificationService.info(
  'New update available',
  'System Update'
);
```

### Specialized Notifications

```typescript
// Device notification
this.notificationService.deviceNotification(
  'connected',
  'iPhone 13 Pro',
  { sound: true, desktop: true }
);

// Message notification
this.notificationService.messageNotification(
  'delivered',
  5, // count
  { sound: true }
);

// Subscription notification
this.notificationService.subscriptionNotification(
  'expiring',
  'Premium Plan',
  7 // days remaining
);
```

### Notification Center

```typescript
// Get all notifications
const notifications = this.notificationService.getNotifications();

// Get unread notifications
const unread = this.notificationService.getUnreadNotifications();

// Get unread count
const count = this.notificationService.getUnreadCount();

// Mark as read
this.notificationService.markAsRead(notificationId);

// Mark all as read
this.notificationService.markAllAsRead();

// Delete notification
this.notificationService.deleteNotification(notificationId);

// Clear all
this.notificationService.clearAll();
```

### Subscribe to Notifications

```typescript
// Subscribe to all notifications
this.notificationService.onNotification()
  .subscribe(notification => {
    console.log('New notification:', notification);
  });

// Subscribe to specific type
this.notificationService.onNotification('message')
  .subscribe(notification => {
    console.log('Message notification:', notification);
  });
```

### Notification Types

| Type | Description | Use Case |
|------|-------------|----------|
| `info` | General information | System updates, tips |
| `success` | Success messages | Operation completed |
| `warning` | Warning messages | Low balance, expiring subscription |
| `error` | Error messages | Failed operations |
| `device` | Device events | Connected, disconnected |
| `message` | Message events | Sent, delivered, read |
| `subscription` | Subscription events | Expiring, expired, renewed |
| `system` | System events | Maintenance, updates |

### Desktop Notifications

```typescript
// Desktop notifications are automatically requested on service init
// They require user permission

// Check permission
if ('Notification' in window) {
  console.log('Permission:', Notification.permission);
  // 'granted', 'denied', or 'default'
}

// Enable desktop notifications for specific actions
this.notificationService.success(
  'Payment received',
  'Transaction',
  { desktop: true } // Will show desktop notification
);
```

### Sound Alerts

```typescript
// Enable sound for important notifications
this.notificationService.warning(
  'Low message balance',
  'Warning',
  { sound: true }
);

// Sound files location: /assets/sounds/
// - success.mp3
// - info.mp3
// - warn.mp3
// - error.mp3
```

---

## 🎯 Integration Examples

### Complete Workflow Example

```typescript
// Send bulk messages with template and track with analytics

export class BulkMessageComponent {
  constructor(
    private templateService: TemplateService,
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService
  ) {}

  async sendCampaign(): Promise<void> {
    try {
      // 1. Preview template
      const preview = await this.templateService.previewTemplate(
        this.selectedTemplateId,
        this.sampleData
      ).toPromise();

      // 2. Send bulk messages
      this.notificationService.info('Sending messages...', 'Campaign');

      const result = await this.templateService.sendBulkMessages({
        templateId: this.selectedTemplateId,
        recipients: this.recipients
      }).toPromise();

      // 3. Show success notification
      this.notificationService.success(
        `${result.success} messages sent successfully`,
        'Campaign Complete',
        { sound: true, desktop: true }
      );

      // 4. Refresh analytics
      this.loadAnalytics();

    } catch (error) {
      this.notificationService.error(
        'Failed to send campaign',
        'Error'
      );
    }
  }

  loadAnalytics(): void {
    this.analyticsService.getMessageAnalytics()
      .subscribe(analytics => {
        this.updateCharts(analytics);
      });
  }
}
```

---

## 🚀 Performance Tips

### 1. Analytics Caching

```typescript
// Cache analytics data
private cachedAnalytics: AnalyticsOverview;
private cacheExpiry: Date;

getAnalytics(): Observable<AnalyticsOverview> {
  const now = new Date();

  if (this.cachedAnalytics && this.cacheExpiry > now) {
    return of(this.cachedAnalytics);
  }

  return this.analyticsService.getOverview().pipe(
    tap(data => {
      this.cachedAnalytics = data;
      this.cacheExpiry = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
    })
  );
}
```

### 2. Lazy Load Media

```typescript
// Use virtual scrolling for large media libraries
<p-virtualScroller
  [value]="mediaFiles"
  [itemSize]="200"
  scrollHeight="600px"
  [lazy]="true"
  (onLazyLoad)="loadMediaLazy($event)">
</p-virtualScroller>
```

### 3. Debounce Notifications

```typescript
// Avoid notification spam
private notificationQueue: Subject<Notification> = new Subject();

constructor() {
  this.notificationQueue.pipe(
    debounceTime(500),
    distinctUntilChanged()
  ).subscribe(notification => {
    this.show(notification);
  });
}
```

---

## 📚 Additional Resources

- [Analytics API Documentation](./API_DOCS.md#analytics)
- [Template Syntax Guide](./TEMPLATE_GUIDE.md)
- [Media Storage Configuration](./STORAGE_CONFIG.md)
- [Notification Best Practices](./NOTIFICATIONS.md)

---

**Version:** 3.0.0
**Last Updated:** 2025-10-30
**Status:** Production Ready ✅
