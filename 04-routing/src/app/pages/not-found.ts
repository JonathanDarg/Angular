import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Route: ** (the wildcard). Shown for any URL that no other route matches.
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>404 · Page not found</h2>
    <p>No route matches this URL.</p>
    <p><a routerLink="/home">Go home</a></p>
  `,
})
export class NotFound {}
