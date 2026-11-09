import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Route: /admin (lazy loaded AND protected by authGuard, see app.routes.ts)
@Component({
  selector: 'app-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Admin 🔒</h2>
    <p>You can only see this because <code>authGuard</code> returned <code>true</code>.</p>
    <button type="button" (click)="logOut()">Log out</button>
  `,
})
export class Admin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logOut(): void {
    this.auth.logout();
    this.router.navigateByUrl('/home');
  }
}
