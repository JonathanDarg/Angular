import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { APP_SETTINGS } from './app-settings';

// The app-wide (root) providers. Everything listed here can be injected anywhere.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Section 4–6: makes HttpClient (and httpResource) available to inject.
    // withFetch() tells it to use the browser's modern fetch API under the hood.
    provideHttpClient(withFetch()),

    // Section 3: gives the APP_SETTINGS token its value.
    // useValue = "when someone injects APP_SETTINGS, hand them this object".
    {
      provide: APP_SETTINGS,
      useValue: {
        appName: '03 · Services, DI & HTTP',
        apiUrl: 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
};
