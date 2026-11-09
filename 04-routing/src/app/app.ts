import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  // RouterOutlet = where pages appear, RouterLink = navigation links,
  // RouterLinkActive = adds a CSS class to the link for the current page.
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Shown in the page header.
  protected readonly title = signal('04 · Routing');

  // Section 4 shows whether the pretend user is logged in.
  protected readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  // The router announces every step of a navigation as an "event" on router.events.
  // toSignal() turns that stream into a signal (folder 06 covers RxJS and toSignal).

  // The current URL, shown in the demo window's address bar.
  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // decodeURIComponent turns %2F back into "/" so query params are readable.
      map((event) => decodeURIComponent(event.urlAfterRedirects)),
    ),
    { initialValue: '/' },
  );

  // true from the moment a navigation starts until it finishes, fails or is cancelled.
  // You'll see it while movieResolver is waiting (section 5).
  protected readonly isNavigating = toSignal(
    this.router.events.pipe(
      filter(
        (event) =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError,
      ),
      map((event) => event instanceof NavigationStart),
    ),
    { initialValue: false },
  );

  protected logOut(): void {
    this.auth.logout();
    // If we're on the admin page, leave it, since we're no longer allowed in.
    if (this.currentUrl().startsWith('/admin')) {
      this.router.navigateByUrl('/home');
    }
  }
}
