import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MOVIES } from '../movies';
import { WatchlistService } from '../state/watchlist.service';

// Section 1, component A: changes the shared state.
@Component({
  selector: 'app-service-catalog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Catalog (component A)</h3>
    <ul class="plain">
      @for (movie of movies; track movie.id) {
        <li>
          <!-- aria-pressed tells screen readers this button is on/off -->
          <button type="button" (click)="watchlist.toggle(movie.id)" [attr.aria-pressed]="watchlist.has(movie.id)">
            {{ watchlist.has(movie.id) ? '✓ Added' : '+ Add' }}
          </button>
          {{ movie.title }}
        </li>
      }
    </ul>
  `,
})
export class ServiceCatalog {
  protected readonly movies = MOVIES.slice(0, 6);
  // The same root instance that WatchlistPanel injects.
  protected readonly watchlist = inject(WatchlistService);
}
