import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless change detection — works perfectly with Signals
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
