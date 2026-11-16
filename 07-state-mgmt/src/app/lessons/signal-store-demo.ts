import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieBrowserStore } from '../state/movie-browser.store';

// Section 2: using an NgRx Signal Store from a component.
@Component({
  selector: 'app-signal-store-demo',
  // Providing the store here gives this component its own store instance.
  providers: [MovieBrowserStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <div>
        <label for="browse-search">Search</label>
        <!-- Calls a store METHOD; the store decides how state changes -->
        <input id="browse-search" type="search" [value]="store.query()" (input)="onSearch($event)" />
      </div>
      <div>
        <label for="browse-sort">Sort by</label>
        <select id="browse-sort" [value]="store.sortBy()" (change)="onSort($event)">
          <option value="title">Title</option>
          <option value="year">Year</option>
        </select>
      </div>
      <button type="button" class="align-end" (click)="store.reset()">Reset store</button>
    </div>

    <!-- favoriteCount() is from withComputed -->
    <p aria-live="polite">Favorites: <strong>{{ store.favoriteCount() }}</strong></p>

    <ul class="plain">
      <!-- visibleMovies() is also from withComputed: filtered by query, sorted by sortBy -->
      @for (movie of store.visibleMovies(); track movie.id) {
        <li>
          <button type="button" class="star" (click)="store.toggleFavorite(movie.id)"
                  [attr.aria-pressed]="store.favorites().includes(movie.id)"
                  [attr.aria-label]="'Favorite ' + movie.title">
            {{ store.favorites().includes(movie.id) ? '★' : '☆' }}
          </button>
          {{ movie.title }} ({{ movie.year }})
        </li>
      } @empty {
        <li class="muted">No movies match.</li>
      }
    </ul>
  `,
})
export class SignalStoreDemo {
  protected readonly store = inject(MovieBrowserStore);

  protected onSearch(event: Event): void {
    this.store.setQuery((event.target as HTMLInputElement).value);
  }

  protected onSort(event: Event): void {
    this.store.setSortBy((event.target as HTMLSelectElement).value === 'year' ? 'year' : 'title');
  }
}
