import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Review {
  movie: string;
  rating: number;
  email: string;
  text: string;
}

// Section 2: built-in validators and showing error messages.
@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- (ngSubmit) runs when the form is submitted (button click or Enter).
         novalidate turns off the browser's own popups so Angular's messages show instead. -->
    <form [formGroup]="review" (ngSubmit)="onSubmit()" novalidate>

      <label for="review-movie">Movie title *</label>
      <!-- aria-invalid tells screen readers the field has an error;
           aria-describedby points them at the message -->
      <input id="review-movie" type="text" formControlName="movie"
             [attr.aria-invalid]="showError('movie')" aria-describedby="review-movie-error" />
      <!-- Only show errors after the user has left the field (touched),
           so they aren't greeted with red text on page load -->
      @if (showError('movie')) {
        <p class="error" id="review-movie-error">Movie title is required.</p>
      }

      <label for="review-rating">Rating (1–5) *</label>
      <input id="review-rating" type="number" formControlName="rating"
             [attr.aria-invalid]="showError('rating')" aria-describedby="review-rating-error" />
      @if (showError('rating')) {
        <p class="error" id="review-rating-error">
          <!-- hasError('min') etc. checks which validator failed -->
          @if (review.controls.rating.hasError('required')) { Rating is required. }
          @else { Rating must be between 1 and 5. }
        </p>
      }

      <label for="review-email">Your email *</label>
      <input id="review-email" type="email" formControlName="email"
             [attr.aria-invalid]="showError('email')" aria-describedby="review-email-error" />
      @if (showError('email')) {
        <p class="error" id="review-email-error">
          @if (review.controls.email.hasError('required')) { Email is required. }
          @else { That doesn't look like an email address. }
        </p>
      }

      <label for="review-text">Review * (at least 20 characters)</label>
      <textarea id="review-text" rows="3" formControlName="text"
                [attr.aria-invalid]="showError('text')" aria-describedby="review-text-error"></textarea>
      <!-- review.controls.text.value.length gives a live character count -->
      <p class="label">{{ review.controls.text.value.length }} / 20 characters</p>
      @if (showError('text')) {
        <p class="error" id="review-text-error">
          @if (review.controls.text.hasError('required')) { Please write a review. }
          @else {
            <!-- The minlength error object includes the required and actual lengths -->
            Too short: {{ review.controls.text.errors?.['minlength']?.actualLength }}
            of {{ review.controls.text.errors?.['minlength']?.requiredLength }} characters.
          }
        </p>
      }

      <button type="submit">Submit review</button>
    </form>

    <p class="label">Form status: <strong>{{ review.status }}</strong></p>

    @if (submitted(); as r) {
      <p class="success" role="status">Saved: "{{ r.movie }}", {{ r.rating }}/5 from {{ r.email }}</p>
    }
  `,
})
export class ReviewForm {
  private readonly fb = inject(NonNullableFormBuilder);

  // Each control is [startingValue, validators]. Validators is an array, so a
  // control can have several. A control is VALID only if every validator passes.
  protected readonly review = this.fb.group({
    movie: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    email: ['', [Validators.required, Validators.email]],
    text: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected readonly submitted = signal<Review | null>(null);

  protected showError(name: keyof Review): boolean {
    const control = this.review.controls[name];
    return control.invalid && control.touched;
  }

  protected onSubmit(): void {
    if (this.review.invalid) {
      // Mark everything touched so ALL error messages appear at once.
      this.review.markAllAsTouched();
      return;
    }
    // getRawValue() returns the fully typed value of every control.
    this.submitted.set(this.review.getRawValue());
    this.review.reset();
  }
}
