import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MOVIES } from '../movies';
import { ReviewsStore } from '../state/reviews.store';

// Section 3: a Signal Store that loads data by itself.
// This component only calls store.select(id): the store's withHooks + rxMethod
// notice the change and load the new reviews.
@Component({
  selector: 'app-reviews-demo',
  providers: [ReviewsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row" role="group" aria-label="Pick a movie">
      @for (movie of movies; track movie.id) {
        <button type="button" (click)="store.select(movie.id)"
                [attr.aria-pressed]="store.selectedId() === movie.id">
          {{ movie.title }}
        </button>
      }
    </div>

    <div aria-live="polite">
      <h3>Reviews of {{ store.selectedMovie()?.title }}</h3>
      @if (store.isLoading()) {
        <p class="muted">Loading reviews…</p>
      } @else {
        <ul>
          @for (review of store.reviews(); track $index) {
            <li>{{ review }}</li>
          }
        </ul>
      }
    </div>
    <p class="label">Loads finished: {{ store.loadCount() }}. Click movies quickly: switchMap cancels the unfinished loads, so this goes up by only one.</p>
  `,
})
export class ReviewsDemo {
  protected readonly movies = MOVIES.slice(2, 6);
  protected readonly store = inject(ReviewsStore);
}
