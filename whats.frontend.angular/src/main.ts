import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { EnvironmentValidator } from './app/core/validators/environment.validator';

// Validate environment configuration before bootstrapping
try {
    EnvironmentValidator.validate();

    const config = EnvironmentValidator.getConfigSummary();

    console.info('🔧 Environment validated successfully:', config);
} catch (error) {
    console.error('❌ Environment validation failed:', error);

    throw error;
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
