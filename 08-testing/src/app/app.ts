import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RatingStars } from './components/rating-stars';
import { SearchBox } from './components/search-box';
import { WatchlistService } from './services/watchlist.service';
import * as snippets from './snippets';
import { formatRuntime } from './utils/movie-utils';

const MOVIE_TITLES = [
  'The Shawshank Redemption',
  'The Godfather',
  'Spirited Away',
  'The Dark Knight',
  'Toy Story',
  'Jurassic Park',
  'The Matrix',
  'Back to the Future',
  'Inception',
  'Finding Nemo',
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RatingStars, SearchBox],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Shown in the page header.
  protected readonly title = signal('08 · Testing');

  // Test excerpts shown in <pre> blocks (see snippets.ts).
  protected readonly snippets = snippets;

  // ---- Section 2: the function tested by movie-utils.spec.ts ----
  protected readonly minutes = signal(142);
  protected readonly runtimeText = computed(() => {
    try {
      return formatRuntime(this.minutes());
    } catch (error) {
      return error instanceof Error ? `Error: ${error.message}` : 'Error';
    }
  });

  protected onMinutesInput(event: Event): void {
    this.minutes.set(Number((event.target as HTMLInputElement).value));
  }

  // ---- Section 3: the service tested by watchlist.service.spec.ts ----
  protected readonly watchlist = inject(WatchlistService);

  protected addToWatchlist(input: HTMLInputElement): void {
    this.watchlist.add(input.value);
    input.value = '';
  }

  // ---- Section 4: the components tested by rating-stars.spec.ts and search-box.spec.ts ----
  protected readonly rating = signal(0);
  protected readonly query = signal('');
  protected readonly matches = computed(() =>
    MOVIE_TITLES.filter((t) => t.toLowerCase().includes(this.query().toLowerCase())),
  );
}
