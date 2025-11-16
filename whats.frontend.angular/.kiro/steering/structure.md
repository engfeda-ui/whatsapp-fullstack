# Project Structure

## Directory Organization

```
src/
├── app/                          # Angular application root
│   ├── core/                     # Core functionality (singleton services)
│   │   ├── decorators/          # Custom decorators
│   │   ├── directives/          # Custom directives
│   │   ├── guards/              # Route guards (auth, admin, guest)
│   │   ├── interceptors/        # HTTP interceptors (auth, error handling)
│   │   ├── services/            # Core services
│   │   │   ├── auth.service.ts
│   │   │   ├── cache.service.ts
│   │   │   ├── encryption.service.ts
│   │   │   ├── token.service.ts
│   │   │   ├── websocket.service.ts
│   │   │   └── ai.service.ts
│   │   ├── testing/             # Testing utilities
│   │   ├── types/               # Core TypeScript interfaces
│   │   ├── validators/          # Environment and data validators
│   │   ├── ApiResponse.ts       # API response wrapper
│   │   └── README.md
│   │
│   ├── layout/                  # Layout components (shell)
│   │   ├── components/          # Layout sub-components
│   │   │   ├── app.layout.component.ts
│   │   │   ├── app.sidebar.component.ts
│   │   │   └── app.topbar.component.ts
│   │   └── service/             # Layout-specific services
│   │
│   ├── pages/                   # Feature pages (lazy-loaded modules)
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verification/
│   │   │
│   │   ├── Whats App/           # WhatsApp Business features
│   │   │   ├── device/          # Device management
│   │   │   ├── message/         # Message operations
│   │   │   └── subscription/    # Subscription management
│   │   │
│   │   ├── dashboards/          # Dashboard pages
│   │   ├── analytics/           # Analytics pages
│   │   ├── usermanagement/      # User management
│   │   ├── crud/                # CRUD examples
│   │   ├── templates/           # Template examples
│   │   ├── documentation/       # Documentation pages
│   │   ├── aboutus/             # About page
│   │   ├── contactus/           # Contact page
│   │   ├── help/                # Help page
│   │   ├── faq/                 # FAQ page
│   │   ├── notfound/            # 404 page
│   │   ├── empty/               # Empty state page
│   │   ├── blocks/              # UI blocks
│   │   ├── media/               # Media management
│   │   ├── invoice/             # Invoice pages
│   │   ├── service/             # Page-level services
│   │   └── pages.routes.ts      # Feature routing configuration
│   │
│   ├── types/                   # Shared TypeScript interfaces
│   │   ├── user.ts
│   │   ├── message.ts
│   │   ├── customer.ts
│   │   ├── product.ts
│   │   ├── task.ts
│   │   ├── blog.ts
│   │   ├── chat.ts
│   │   ├── mail.ts
│   │   ├── kanban.ts
│   │   ├── file.ts
│   │   ├── folder.ts
│   │   ├── image.ts
│   │   ├── metric.ts
│   │   └── member.ts
│   │
│   ├── demo/                    # Demo components
│   │   └── components/
│   │
│   ├── app.component.ts         # Root component
│   ├── app.config.ts            # App configuration
│   └── app.routes.ts            # Main routing configuration
│
├── assets/                      # Static assets (images, fonts, etc.)
├── environments/                # Environment-specific configs
│   ├── environment.ts           # Development
│   └── environment.prod.ts      # Production
├── index.html                   # Entry HTML file
├── main.ts                      # Bootstrap entry point
├── styles.scss                  # Global styles
└── tailwind.css                 # Tailwind directives

public/                          # Static files served as-is
├── favicon.ico
├── demo/                        # Demo assets
└── layout/                      # Layout assets

Root Configuration Files:
├── angular.json                 # Angular CLI configuration
├── tsconfig.json               # TypeScript compiler options
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.spec.json          # Test-specific TypeScript config
├── .eslintrc.cjs               # ESLint configuration
├── .prettierrc.json            # Prettier formatting rules
├── tailwind.config.js          # Tailwind CSS configuration
├── karma.conf.js               # Karma test runner config
├── package.json                # Dependencies and scripts
├── Dockerfile                  # Docker image definition
└── nginx.conf                  # Nginx configuration
```

## Architecture Patterns

### Standalone Components

All components use Angular 19 standalone API:
- No NgModules required
- Direct dependency injection with `inject()`
- Explicit imports in component decorators

### Service Architecture

- **Core Services**: Singleton services in `core/services/` (auth, cache, encryption, websocket, AI)
- **Feature Services**: Page-specific services in `pages/*/service/`
- **Dependency Injection**: Use `inject()` function over constructor injection

### Routing

- **Main Routes**: `app.routes.ts` (root-level routing)
- **Feature Routes**: `pages/pages.routes.ts` (lazy-loaded feature modules)
- **Route Guards**: `core/guards/` (auth, admin, guest protection)

### State Management

- **RxJS Observables**: Primary state management pattern
- **HTTP Caching**: LRU cache service for API responses
- **WebSocket**: Real-time updates via `websocket.service.ts`

### HTTP Communication

- **Interceptors**: `core/interceptors/` handle auth tokens and errors
- **API Response Wrapper**: `core/ApiResponse.ts` standardizes responses
- **Error Handling**: Centralized error interceptor

## Code Style Conventions

### Component Naming

- **Selectors**: Prefix `p-` with kebab-case (e.g., `p-device-list`)
- **Directives**: Prefix `p` with camelCase (e.g., `pHighlight`)
- **Files**: kebab-case (e.g., `device-list.component.ts`)

### TypeScript Rules

- **Strict Mode**: Enabled in tsconfig.json
- **Return Types**: Explicit return types required on all functions
- **No `any`**: Use proper types (warn level)
- **Unused Variables**: Prefix with `_` if intentional
- **Imports**: Organized with blank lines between groups
- **Padding**: Blank lines between statements (see .eslintrc.cjs)

### Formatting

- **Tabs**: 4 spaces (no tabs)
- **Line Length**: 250 characters max
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing Commas**: None
- **Bracket Same Line**: false

### Console Usage

- ✅ Allowed: `console.warn()`, `console.error()`, `console.info()`
- ❌ Forbidden: `console.log()`

## Path Aliases

- `@/*`: Maps to `src/app/*`
- `@env/*`: Maps to `src/environments/*`

Use these for cleaner imports:
```typescript
import { AuthService } from '@/core/services/auth.service';
import { environment } from '@env/environment';
```

## Feature Module Structure

Each feature page follows this pattern:

```
pages/feature-name/
├── components/          # Feature-specific components
├── service/            # Feature-specific services
├── types/              # Feature-specific interfaces
├── feature.component.ts
└── feature.routes.ts   # Feature routing (if applicable)
```

## Testing Structure

- **Unit Tests**: Co-located with source files (*.spec.ts)
- **Test Utilities**: `core/testing/` for shared test helpers
- **Test Runner**: Karma + Jasmine
- **Coverage Target**: 40% for core services
