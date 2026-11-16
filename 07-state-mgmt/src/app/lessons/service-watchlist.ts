import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WatchlistService } from '../state/watchlist.service';

// Section 1, component B: only reads the shared state (and can clear it).
// It never talks to ServiceCatalog: both just use WatchlistService.
@Component({
  selector: 'app-service-watchlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Watchlist (component B)</h3>
    <!-- count() and movies() are computed signals in the service -->
    <p aria-live="polite">{{ watchlist.count() }} movie(s)</p>
    <ul>
      @for (movie of watchlist.movies(); track movie.id) {
        <li>{{ movie.title }}</li>
      } @empty {
        <li class="muted">Empty. Add movies from the catalog.</li>
      }
    </ul>
    <button type="button" (click)="watchlist.clear()" [disabled]="watchlist.count() === 0">Clear</button>
  `,
})
export class ServiceWatchlist {
  protected readonly watchlist = inject(WatchlistService);
}
