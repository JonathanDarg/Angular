import { Injectable, signal } from '@angular/core';

// A pretend login, just so the guard in section 4 has something to check.
// Real apps would talk to a server and store a token.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login(): void {
    this._isLoggedIn.set(true);
  }

  logout(): void {
    this._isLoggedIn.set(false);
  }
}
