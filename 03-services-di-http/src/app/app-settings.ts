import { InjectionToken } from '@angular/core';

// Not everything you inject has to be a class. An InjectionToken is a "key"
// for injecting plain values like settings or config objects.
export interface AppSettings {
  appName: string;
  apiUrl: string;
}

// The string is only a description shown in error messages.
export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS');

// The actual value is provided in app.config.ts:
//   { provide: APP_SETTINGS, useValue: { ... } }
// and read anywhere with: inject(APP_SETTINGS)
