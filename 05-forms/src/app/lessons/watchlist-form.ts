import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Section 4: a DYNAMIC form, where the user decides how many fields there are.
@Component({
  selector: 'app-watchlist-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="watchlist" (ngSubmit)="onSubmit()" novalidate>
      <label for="watchlist-name">List name</label>
      <input id="watchlist-name" type="text" formControlName="listName" />

      <!-- formArrayName connects this block to the "movies" FormArray -->
      <fieldset formArrayName="movies">
        <legend>Movies ({{ movies.length }})</legend>

        <!-- Loop over the array's controls. Inside a formArrayName, a control
             is connected by its INDEX: [formControlName]="i" -->
        @for (control of movies.controls; track control; let i = $index) {
          <div class="row">
            <label class="visually-hidden" [for]="'watchlist-movie-' + i">Movie {{ i + 1 }}</label>
            <input [id]="'watchlist-movie-' + i" type="text" [formControlName]="i"
                   [placeholder]="'Movie ' + (i + 1)"
                   [attr.aria-invalid]="control.invalid && control.touched" />
            <button type="button" (click)="removeMovie(i)" [attr.aria-label]="'Remove movie ' + (i + 1)">Remove</button>
          </div>
          @if (control.invalid && control.touched) {
            <p class="error">Enter a title or remove this row.</p>
          }
        } @empty {
          <p>No movies yet.</p>
        }
      </fieldset>

      <div class="row">
        <button type="button" (click)="addMovie()">+ Add movie</button>
        <button type="submit">Save list</button>
      </div>
    </form>

    @if (saved(); as list) {
      <p class="success" role="status">Saved "{{ list.listName }}": {{ list.movies.join(', ') || 'no movies' }}</p>
    }
  `,
})
export class WatchlistForm {
  private readonly fb = inject(NonNullableFormBuilder);

  // FormArray = a list of controls you can add to and remove from while the app runs.
  protected readonly watchlist = this.fb.group({
    listName: ['Weekend movies', Validators.required],
    movies: this.fb.array([
      this.fb.control('Spirited Away', Validators.required),
      this.fb.control('The Matrix', Validators.required),
    ]),
  });

  // A shortcut so the template can write `movies` instead of `watchlist.controls.movies`.
  protected readonly movies = this.watchlist.controls.movies;

  protected readonly saved = signal<{ listName: string; movies: string[] } | null>(null);

  protected addMovie(): void {
    // push() adds a new control; the @for loop shows a new input for it.
    this.movies.push(this.fb.control('', Validators.required));
  }

  protected removeMovie(index: number): void {
    this.movies.removeAt(index);
  }

  protected onSubmit(): void {
    if (this.watchlist.invalid) {
      this.watchlist.markAllAsTouched();
      return;
    }
    this.saved.set(this.watchlist.getRawValue());
  }
}
