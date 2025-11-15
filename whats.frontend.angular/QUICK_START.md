# Quick Start Guide - Frontend Improvements

This guide will help you get started with the new improvements made to the frontend.

## Installation

All improvements are already integrated into the application. No additional installation is required.

## Key Services to Use

### 1. LoadingService - Global Loading Indicator

```typescript
import { LoadingService } from '@/core/services';

export class MyComponent {
  constructor(private loadingService: LoadingService) {}

  isLoading$ = this.loadingService.loading$;
}
```

**Template:**
```html
<div *ngIf="isLoading$ | async" class="spinner">Loading...</div>
```

### 2. CacheService - Data Caching

```typescript
import { CacheService } from '@/core/services';

export class MyComponent {
  constructor(private cacheService: CacheService) {}

  loadUsers() {
    // Cache for 5 minutes
    this.cacheService.cacheObservable(
      'users',
      this.userService.getAllUsers(),
      5 * 60 * 1000
    ).subscribe(users => {
      console.log(users);
    });
  }

  clearCache() {
    this.cacheService.clear('users');
  }
}
```

### 3. AccessibilityService - Screen Reader Support

```typescript
import { AccessibilityService } from '@/core/services';

export class MyComponent {
  constructor(private a11y: AccessibilityService) {}

  saveUser() {
    // Save user...
    this.a11y.announceSuccess('User saved successfully');
  }

  showError() {
    this.a11y.announceError('Failed to save user');
  }
}
```

### 4. PerformanceService - Performance Monitoring

```typescript
import { PerformanceService } from '@/core/services';

export class MyComponent {
  constructor(private performance: PerformanceService) {}

  loadData() {
    const result = this.performance.measureFunction('loadData', () => {
      return this.fetchData();
    });
  }

  async loadDataAsync() {
    const result = await this.performance.measureAsync('loadDataAsync', async () => {
      return await this.fetchDataAsync();
    });
  }

  getMetrics() {
    const summary = this.performance.getSummary();
    console.log(summary);
  }
}
```

## Key Directives to Use

### 1. Lazy Load Images

```html
<!-- Load image only when visible -->
<img pLazyLoad="image.jpg" pLazyLoadPlaceholder="placeholder.jpg" />
```

### 2. Debounce Input

```html
<!-- Debounce search input -->
<input 
  type="text" 
  [pDebounce]="300" 
  (debounced)="onSearch($event)"
  placeholder="Search..."
/>
```

### 3. Throttle Clicks

```html
<!-- Throttle button clicks -->
<button 
  [pThrottle]="300" 
  (throttled)="onClick($event)"
>
  Save
</button>
```

### 4. ARIA Labels

```html
<!-- Add ARIA labels for accessibility -->
<button pAriaLabel="Close dialog">×</button>
<input pAriaLabel="Search users" type="text" />
```

### 5. Focus Trap (for modals)

```html
<!-- Trap focus within modal -->
<div pFocusTrap class="modal">
  <input type="text" />
  <button>Save</button>
  <button>Cancel</button>
</div>
```

## Error Handling

Errors are automatically handled globally. No need to manually handle errors in most cases:

```typescript
// Errors are caught and displayed automatically
this.userService.getCurrentUser().subscribe(response => {
  // Handle success
  console.log(response.data);
  // Errors are handled by the global error handler
});
```

## Type-Safe API Calls

Use the new type-safe API types:

```typescript
import { ApiResponse, UserResponse } from '@/core/types';

export class MyComponent {
  constructor(private userService: UserService) {}

  loadUser() {
    this.userService.getCurrentUser().subscribe((response: ApiResponse<UserResponse>) => {
      if (response.isSuccess && response.data) {
        console.log(response.data.fullName);
      }
    });
  }
}
```

## HTTP Client Wrapper

Use the new HTTP client wrapper for consistent API calls:

```typescript
import { HttpClientService } from '@/core/services';

export class MyComponent {
  constructor(private httpClient: HttpClientService) {}

  loadUsers() {
    this.httpClient.get<User>('/users').subscribe(response => {
      console.log(response.data);
    });
  }

  loadUsersPaginated() {
    this.httpClient.getPaginated<User>('/users', 1, 10).subscribe(response => {
      console.log(response.data.items);
      console.log(response.data.totalCount);
    });
  }

  createUser(user: User) {
    this.httpClient.post<User>('/users', user).subscribe(response => {
      console.log(response.data);
    });
  }
}
```

## Environment Configuration

Check environment configuration:

```typescript
import { EnvironmentValidator } from '@/core/validators';

// Get configuration summary
const config = EnvironmentValidator.getConfigSummary();
console.log(config);

// Check if feature is enabled
if (EnvironmentValidator.isFeatureEnabled('enablePerformanceMonitoring')) {
  // Enable feature
}
```

## Testing

Use mock services for testing:

```typescript
import { MockUserService, MockAuthService } from '@/core/testing';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  it('should load user', () => {
    // Test code
  });
});
```

## Best Practices

1. **Always use services** - Don't make direct HTTP calls
2. **Cache frequently accessed data** - Use CacheService
3. **Add ARIA labels** - Use AriaLabelDirective for accessibility
4. **Monitor performance** - Use PerformanceService
5. **Lazy load images** - Use LazyLoadImageDirective
6. **Debounce/Throttle events** - Use DebounceDirective and ThrottleDirective
7. **Handle errors gracefully** - Let the error handler manage errors
8. **Use type-safe APIs** - Use the new API types
9. **Write tests** - Use mock services for testing
10. **Keep components small** - Focus on single responsibility

## Common Issues

### Issue: Loading indicator not showing
**Solution:** Make sure the `AppLoading` component is imported in your layout.

### Issue: Cache not working
**Solution:** Check that the cache key is consistent and the TTL is set correctly.

### Issue: ARIA labels not working
**Solution:** Make sure the directive is imported and the element is interactive.

### Issue: Performance metrics not showing
**Solution:** Enable performance monitoring in environment configuration.

## Resources

- [Core Module Documentation](src/app/core/README.md)
- [Improvements Documentation](IMPROVEMENTS.md)
- [Angular Documentation](https://angular.io)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For questions or issues, refer to the documentation or create an issue in the repository.
