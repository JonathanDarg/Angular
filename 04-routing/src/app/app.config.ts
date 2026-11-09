import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Turns on the router with our route table (app.routes.ts).
    // withComponentInputBinding() lets routed components receive route
    // parameters, query parameters and resolved data as input() values.
    provideRouter(routes, withComponentInputBinding()),
  ],
};
