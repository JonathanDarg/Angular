import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { votesFeature } from './state/votes/votes.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Section 4 (NgRx Store): create the one global store...
    provideStore(),
    // ...and register the "votes" slice of state with its reducer.
    // The state then looks like: { votes: { votes: { 3: 0, 4: 0, ... } } }
    provideState(votesFeature),

    // Sections 1–3 need nothing here: WatchlistService is providedIn: 'root',
    // and the Signal Stores are provided by the components that use them.
  ],
};
