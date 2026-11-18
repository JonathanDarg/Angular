import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

// A small component with an input and an output. Tested in rating-stars.spec.ts.
@Component({
  selector: 'app-rating-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stars" role="group" aria-label="Rating">
      @for (star of stars(); track star) {
        <button
          type="button"
          class="star"
          [class.filled]="star <= rating()"
          [attr.aria-label]="'Rate ' + star + ' out of ' + max()"
          [attr.aria-pressed]="star <= rating()"
          (click)="rated.emit(star)"
        >
          {{ star <= rating() ? '★' : '☆' }}
        </button>
      }
    </div>
  `,
  styles: `
    .stars { display: flex; gap: 0.25rem; }
    .star { font-size: 1.5rem; line-height: 1; padding: 0.1rem 0.3rem; border: 1px solid transparent; border-radius: 6px; background: none; color: #555; cursor: pointer; }
    .star.filled { color: #8a5a00; }
    .star:focus-visible { border-color: #1a1a1a; }
  `,
})
export class RatingStars {
  readonly rating = input(0);
  readonly max = input(5);
  readonly rated = output<number>();

  // [1, 2, 3, 4, 5] for max = 5
  protected readonly stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));
}
