import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Route: /login. authGuard sends people here with ?returnUrl=... when they aren't logged in.
@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Log in</h2>
    @if (returnUrl()) {
      <!-- returnUrl() is the QUERY parameter from /login?returnUrl=/admin -->
      <p role="status">The guard stopped you from opening <code>{{ returnUrl() }}</code>. Log in first.</p>
    } @else {
      <p>Log in to see the admin page.</p>
    }
    <button type="button" (click)="logIn()">Log in (pretend)</button>
  `,
})
export class Login {
  // Query parameters are bound to inputs by name too (needs withComponentInputBinding()).
  // It's undefined when the URL has no ?returnUrl=...
  readonly returnUrl = input<string>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logIn(): void {
    this.auth.login();
    // Go back to where the guard stopped them, or /admin by default.
    // This navigation runs the guard again, and now it says yes.
    this.router.navigateByUrl(this.returnUrl() ?? '/admin');
  }
}
