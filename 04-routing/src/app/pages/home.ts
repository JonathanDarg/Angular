import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Route: /home (loaded EAGERLY: it's part of the main bundle, see app.routes.ts)
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Home</h2>
    <p>This is the <strong>Home</strong> page. Everything inside this demo window is
    swapped by the router when the URL changes.</p>
    <!-- routerLink works inside routed pages too -->
    <p><a routerLink="/movies">Browse the movies →</a></p>
  `,
})
export class Home {}
