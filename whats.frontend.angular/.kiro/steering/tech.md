# Technology Stack

## Core Framework & Language

- **Angular**: 19.0.0 (latest with standalone components)
- **TypeScript**: 5.6.2 (strict mode enabled)
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher

## UI & Styling

- **PrimeNG**: 19.0.8 (enterprise UI component library)
- **PrimeIcons**: 7.0.0 (icon library)
- **TailwindCSS**: 3.4.17 (utility-first CSS framework)
- **tailwindcss-primeui**: 0.5.1 (PrimeNG + Tailwind integration)

## Key Libraries

- **RxJS**: 7.8.0 (reactive programming)
- **Chart.js**: 4.4.2 (analytics and charts)
- **Quill**: 2.0.3 (rich text editor)
- **crypto-js**: 4.2.0 (token encryption)
- **jwt-decode**: 4.0.0 (JWT token parsing)

## Development Tools

- **Angular CLI**: 19.0.6
- **ESLint**: 9.14.0 (linting)
- **Prettier**: 3.0.0 (code formatting)
- **Karma**: 6.4.0 (test runner)
- **Jasmine**: 5.4.0 (testing framework)
- **TypeScript ESLint**: 8.46.2

## Build & Deployment

- **Build System**: Angular CLI with webpack
- **Output**: dist/apollo-ng
- **Docker**: Containerized deployment support
- **Docker Compose**: Multi-service orchestration

## Common Commands

### Development

```bash
npm start              # Start dev server (http://localhost:4200)
npm run start:prod     # Start with production config
ng serve              # Alternative to npm start
```

### Build

```bash
npm run build          # Build for development
npm run build:prod     # Build for production (AOT enabled)
npm run build:stats    # Build with bundle analyzer stats
npm run watch          # Build and watch for changes
```

### Code Quality

```bash
npm run lint           # Run ESLint checks
npm run lint -- --fix  # Auto-fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting without changes
```

### Testing

```bash
npm test               # Run unit tests in watch mode
npm run test:ci        # Run tests once (CI mode)
npm run test:coverage  # Run tests with coverage report
```

### Analysis & Docker

```bash
npm run analyze        # Analyze bundle size
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
npm run docker:compose # Start with docker-compose
npm run docker:down    # Stop docker-compose
```

## Configuration Files

- **angular.json**: Angular CLI configuration
- **tsconfig.json**: TypeScript compiler options with path aliases (@/*, @env/*)
- **tsconfig.app.json**: App-specific TypeScript config
- **tsconfig.spec.json**: Test-specific TypeScript config
- **.eslintrc.cjs**: ESLint rules and overrides
- **.prettierrc.json**: Prettier formatting rules
- **tailwind.config.js**: Tailwind CSS configuration
- **karma.conf.js**: Karma test runner configuration

## Environment Configuration

- **src/environments/environment.ts**: Development config
- **src/environments/environment.prod.ts**: Production config

Key environment variables:

- `production`: boolean flag
- `apiUrl`: Backend API endpoint
- `encryptionKey`: Token encryption key (change in production)

## Performance Targets

- Initial load: ~1.5s (production build)
- Route navigation: ~100ms
- API calls: ~50-200ms
- WebSocket latency: ~20-50ms
- Bundle size: <1MB initial, <2KB per component style

## Code Coverage

Current target: 40% for core services
