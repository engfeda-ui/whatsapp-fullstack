# Core Module

The core module contains all the essential services, guards, interceptors, and utilities for the application.

## Structure

```
core/
├── decorators/          # Custom decorators
├── directives/          # Custom directives
├── guards/              # Route guards
├── interceptors/        # HTTP interceptors
├── services/            # Core services
├── types/               # TypeScript types and interfaces
├── validators/          # Validators
└── ApiResponse.ts       # API response utilities
```

## Services

### AuthService
Handles authentication logic including login, logout, and token refresh.

```typescript
import { AuthService } from '@/core/services';

constructor(private authService: AuthService) {}

refreshToken(): Observable<void> {
  return this.authService.refreshToken();
}
```

### UserService
Manages user-related API calls.

```typescript
import { UserService } from '@/core/services';

constructor(private userService: UserService) {}

getCurrentUser(): void {
  this.userService.getCurrentUser().subscribe(response => {
    console.log(response.data);
  });
}
```

### LoadingService
Manages global loading state for HTTP requests.

```typescript
import { LoadingService } from '@/core/services';

constructor(private loadingService: LoadingService) {}

isLoading$ = this.loadingService.loading$;
```

### CacheService
Provides caching functionality with TTL support.

```typescript
import { CacheService } from '@/core/services';

constructor(private cacheService: CacheService) {}

// Cache an observable
this.cacheService.cacheObservable('users', this.userService.getAllUsers(), 5 * 60 * 1000);

// Get cached data
const cachedData = this.cacheService.get<User[]>('users');

// Clear cache
this.cacheService.clear('users');
```

### AccessibilityService
Provides accessibility utilities for screen readers and keyboard navigation.

```typescript
import { AccessibilityService } from '@/core/services';

constructor(private a11y: AccessibilityService) {}

// Announce to screen readers
this.a11y.announce('User saved successfully');

// Set focus
this.a11y.setFocus(element);

// Trap focus in modal
this.a11y.trapFocus(modalElement, event);
```

### PerformanceService
Tracks and measures application performance.

```typescript
import { PerformanceService } from '@/core/services';

constructor(private performance: PerformanceService) {}

// Measure function
const result = this.performance.measureFunction('myFunction', () => {
  return expensiveOperation();
});

// Measure async function
const result = await this.performance.measureAsync('myAsyncFunction', async () => {
  return await fetchData();
});

// Get metrics
const metrics = this.performance.getMetrics();
const summary = this.performance.getSummary();
```

## Guards

### authGuard
Protects routes that require authentication.

```typescript
import { authGuard } from '@/core/guards';

const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  }
];
```

### adminGuard
Protects routes that require admin role.

```typescript
import { adminGuard } from '@/core/guards';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminPanel,
    canActivate: [adminGuard]
  }
];
```

## Interceptors

### authInterceptor
Automatically adds authentication token to requests and handles token refresh.

### errorInterceptor
Handles HTTP errors and displays user-friendly error messages.

### loadingInterceptor
Manages global loading state for HTTP requests.

## Directives

### LazyLoadImageDirective
Lazy loads images when they enter the viewport.

```html
<img pLazyLoad="image-url.jpg" pLazyLoadPlaceholder="placeholder.jpg" />
```

### DebounceDirective
Debounces input events.

```html
<input [pDebounce]="300" (debounced)="onSearch($event)" />
```

### ThrottleDirective
Throttles click events.

```html
<button [pThrottle]="300" (throttled)="onClick($event)">Click me</button>
```

### AriaLabelDirective
Adds ARIA labels to elements.

```html
<button pAriaLabel="Close dialog">×</button>
```

### FocusTrapDirective
Traps focus within a modal or dialog.

```html
<div pFocusTrap>
  <!-- Modal content -->
</div>
```

## Types

### ApiResponse
Standard API response type.

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
```

### PaginatedResponse
Paginated API response type.

```typescript
interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## Error Handling

The application uses a global error handler that:
- Catches all HTTP errors
- Displays user-friendly error messages
- Logs errors in development mode
- Handles specific error codes (401, 403, 404, 500, etc.)
- Redirects to login on 401 errors
- Redirects to access denied on 403 errors

## Performance Optimization

The application includes several performance optimizations:
- **Lazy loading images** - Images load only when visible
- **HTTP request caching** - Frequently accessed data is cached
- **OnPush change detection** - Reduces unnecessary change detection cycles
- **Debounce/Throttle** - Limits event handler execution
- **Performance monitoring** - Tracks and measures application performance

## Accessibility

The application includes comprehensive accessibility features:
- **ARIA labels and descriptions** - Screen reader support
- **Focus management** - Keyboard navigation support
- **Focus trapping** - Modal focus management
- **Announcements** - Screen reader announcements for important events
- **Semantic HTML** - Proper HTML structure for accessibility

## Best Practices

1. **Always use typed services** - Use the provided services instead of making direct HTTP calls
2. **Use the cache service** - Cache frequently accessed data to improve performance
3. **Use accessibility directives** - Add ARIA labels and focus management to interactive elements
4. **Monitor performance** - Use the performance service to identify bottlenecks
5. **Handle errors gracefully** - Let the error handler manage HTTP errors
6. **Use lazy loading** - Lazy load images and components to improve initial load time
