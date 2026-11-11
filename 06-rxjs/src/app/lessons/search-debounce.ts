import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs';
import { MOVIES } from '../movies';

// Section 3: debounceTime for search boxes.
@Component({
  selector: 'app-search-debounce',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label for="movie-search">Search movies</label>
    <!-- Every keystroke is pushed into the searchTerms Subject -->
    <input id="movie-search" type="search" placeholder="e.g. the" (input)="onInput($event)" />

    <p class="label" aria-live="polite">
      Keystrokes: <strong>{{ keystrokes() }}</strong> ·
      Searches actually run: <strong>{{ searches() }}</strong>
    </p>

    <ul>
      @for (movie of results$ | async; track movie.id) {
        <li>{{ movie.title }} ({{ movie.year }})</li>
      } @empty {
        <li class="muted">No matches.</li>
      }
    </ul>
  `,
})
export class SearchDebounce {
  protected readonly keystrokes = signal(0);
  protected readonly searches = signal(0);

  // A Subject is an Observable you can push values into yourself with next().
  // It's a handy bridge from template events into an RxJS pipeline.
  private readonly searchTerms = new Subject<string>();

  protected readonly results$ = this.searchTerms.pipe(
    // Wait until typing has paused for 300 ms; only the LAST value gets through.
    // Without this, a real app would send a server request on every keystroke.
    debounceTime(300),
    map((term) => term.trim().toLowerCase()),
    // Skip if the term is the same as last time (e.g. typed a letter then deleted it).
    distinctUntilChanged(),
    // tap: run a side effect without changing the value. Here: count searches.
    tap(() => this.searches.update((n) => n + 1)),
    map((term) => MOVIES.filter((m) => m.title.toLowerCase().includes(term))),
    // Show the full list before the user types anything.
    startWith(MOVIES),
  );

  protected onInput(event: Event): void {
    this.keystrokes.update((n) => n + 1);
    this.searchTerms.next((event.target as HTMLInputElement).value);
  }
}
