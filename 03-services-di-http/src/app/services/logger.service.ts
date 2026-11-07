import { Injectable, signal } from '@angular/core';

// A service is a plain class that holds logic or data you want to SHARE.
// @Injectable lets Angular create it and hand it to whoever asks for it.
// providedIn: 'root' = one single instance for the whole app (a "singleton"),
// created the first time something injects it.
@Injectable({ providedIn: 'root' })
export class LoggerService {
  // Services can hold signals too. asReadonly() lets others READ the list
  // but only this service can change it.
  private readonly _messages = signal<string[]>([]);
  readonly messages = this._messages.asReadonly();

  log(message: string): void {
    // Keep only the 5 most recent messages.
    this._messages.update((list) => [message, ...list].slice(0, 5));
  }

  clear(): void {
    this._messages.set([]);
  }
}
