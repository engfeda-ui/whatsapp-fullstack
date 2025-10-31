# WhatsApp Business Frontend

A modern Angular 19 frontend application for WhatsApp Business API management, built with PrimeNG and TailwindCSS.

## Overview

This application provides a comprehensive interface for managing WhatsApp Business operations including:

- **Device Management**: Connect and manage multiple WhatsApp devices
- **Message Management**: Send single/bulk messages with media support
- **Subscription Management**: Handle user subscriptions and plans
- **User Authentication**: Secure JWT-based authentication with encryption
- **Real-time Monitoring**: Track message delivery and device status

## Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **UI Library**: PrimeNG 19 + PrimeIcons
- **Styling**: TailwindCSS + PrimeUI
- **State Management**: RxJS
- **Security**: JWT tokens with encryption (crypto-js)
- **Charts**: Chart.js for analytics
- **Rich Text**: Quill editor

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 19.x

## Installation

1. Clone the repository:

`ash
git clone https://github.com/engfeda-ui/whats-frontend.git
cd whats-frontend
`

1. Install dependencies:

`ash
npm install
`

1. Configure environment variables:
   - Update src/environments/environment.ts for development
   - Update src/environments/environment.prod.ts for production
   - **Important**: Change the encryptionKey before deploying to production

## Development

Start the development server:

`ash
npm start
`

Navigate to http://localhost:4200/. The application will automatically reload when you make changes.

## Build

Build the project for production:

`ash
npm run build
`

Build artifacts will be stored in the dist/ directory.

## Code Formatting

Format code using Prettier:

`ash
npm run format
`

## Testing

Run unit tests:

`ash
npm test
`

## Project Structure

`	ext
src/
├── app/
│   ├── core/              # Core services, guards, interceptors
│   │   ├── guards/        # Route guards (auth)
│   │   ├── interceptors/  # HTTP interceptors
│   │   └── services/      # Core services (auth, cache, encryption, token)
│   ├── layout/            # Layout components (sidebar, topbar)
│   ├── pages/             # Feature pages
│   │   ├── auth/          # Authentication (login, register, verification)
│   │   └── Whats App/     # WhatsApp features (device, message, subscription)
│   └── app.routes.ts      # Application routing
├── environments/          # Environment configurations
└── assets/                # Static assets
`

## Key Features

### Security

- JWT-based authentication with refresh tokens
- Token encryption using crypto-js
- Auth guard for protected routes
- Secure HTTP interceptors
- Environment-based configuration

### Performance

- Standalone components for better tree-shaking
- HTTP caching service with LRU eviction
- Lazy loading for feature modules
- Optimized bundle size

### User Experience

- Responsive design with TailwindCSS
- Rich UI components from PrimeNG
- Toast notifications for user feedback
- Loading states and error handling

## API Integration

The application connects to a backend API. Configure the API endpoint in the environment files:

`	ypescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-url.com',
  encryptionKey: 'your-secret-key'
};
`

## Environment Variables

- piUrl: Backend API endpoint
- encryptionKey: Encryption key for token storage (must be changed in production)
- production: Production flag

## Security Notes

⚠️ **Before deploying to production:**

1. Change the encryptionKey in environment.prod.ts to a strong, random key
2. Ensure no hardcoded credentials exist in the codebase
3. Review all environment variables
4. Enable HTTPS for production
5. Configure proper CORS settings on the backend

## Troubleshooting

- If the UI stops showing fresh data, clear the browser cache (cookies, local storage, and session storage) or open the app in a private window, then sign in again.
- When local API calls return 401, simply sign in again to generate a fresh session token.
- If you switch between backends, confirm src/environments/environment.ts points to the correct piUrl and that the API is reachable before loading the app.

## Real-time Features (NEW!)

### WebSocket Integration

The application now supports real-time updates via WebSocket:

- Real-time device status updates
- Live message delivery tracking
- Instant QR code updates
- Connection status monitoring
- Auto-reconnection with retry logic

See [WEBSOCKET_GUIDE.md](WEBSOCKET_GUIDE.md) for detailed usage.

## Docker & Deployment

### Quick Start with Docker

```bash
# From the workspace root
cp .env.example .env          # copy once, then customise secrets/ports
docker compose up --build -d  # build and start frontend + backend

# Tail logs (optional)
docker compose logs -f backend
docker compose logs -f frontend
```

### Production Deployment

Multiple deployment options:

- Docker Compose (single server)
- Docker Swarm (clustering)
- Kubernetes (enterprise)
- GitHub Actions CI/CD

See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for comprehensive deployment documentation.

## CI/CD Pipeline

Automated workflows with GitHub Actions:

- ✅ Code linting and formatting
- ✅ Unit tests with coverage reports
- ✅ Production build
- ✅ Docker image build and push
- ✅ Security vulnerability scanning
- ✅ Automated deployment

## Recent Improvements

- **WebSocket Service:** Real-time messaging and device updates
- **Docker Support:** Full containerization with docker-compose
- **CI/CD Pipeline:** GitHub Actions for automated testing and deployment
- **Unit Tests:** 40% coverage for core services
- **Type Safety:** Comprehensive TypeScript interfaces
- **Environment Validation:** Startup configuration checks

See [IMPROVEMENTS.md](IMPROVEMENTS.md) and [COMPARISON_REPORT.md](COMPARISON_REPORT.md) for detailed documentation.

## Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## Code Style

This project uses:

- ESLint for linting
- Prettier for code formatting
- Angular style guide

Run 
pm run format before committing.

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with Angular 19 + PrimeNG + TailwindCSS
