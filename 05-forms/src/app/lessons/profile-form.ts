import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

// Section 1: the building blocks of a reactive form.
// The form's structure lives in TypeScript (this class); the template only connects to it.
@Component({
  selector: 'app-profile-form',
  // ReactiveFormsModule gives the template [formGroup] and formControlName.
  imports: [ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- [formGroup] connects this <form> to the FormGroup object in the class -->
    <form [formGroup]="profile">
      <!-- formControlName="name" connects this input to profile.controls.name -->
      <label for="profile-name">Name</label>
      <input id="profile-name" type="text" formControlName="name" />

      <label for="profile-email">Email</label>
      <input id="profile-email" type="email" formControlName="email" />

      <label for="profile-genre">Favorite genre</label>
      <select id="profile-genre" formControlName="favoriteGenre">
        @for (genre of genres; track genre) {
          <option [value]="genre">{{ genre }}</option>
        }
      </select>

      <label class="checkbox">
        <input type="checkbox" formControlName="subscribed" />
        Email me new releases
      </label>
    </form>

    <div class="row">
      <!-- setValue / patchValue change the form FROM CODE -->
      <button type="button" (click)="fillExample()">Fill example (patchValue)</button>
      <!-- reset() goes back to the starting values -->
      <button type="button" (click)="profile.reset()">Reset</button>
    </div>

    <!-- The form object always knows its current value and state -->
    <p class="label">profile.value (updates as you type):</p>
    <pre>{{ profile.value | json }}</pre>
    <p class="label">
      dirty: {{ profile.dirty }} (changed by the user) ·
      touched: {{ profile.touched }} (a field was focused then left)
    </p>
  `,
})
export class ProfileForm {
  // NonNullableFormBuilder: shorthand for creating controls, and reset() returns to
  // the starting values instead of null. The value types are inferred from these defaults.
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly genres = ['Drama', 'Comedy', 'Sci-Fi', 'Animation'];

  // FormGroup = a set of named FormControls. Each control holds one value.
  protected readonly profile = this.fb.group({
    name: '',
    email: '',
    favoriteGenre: 'Drama',
    subscribed: false,
  });

  protected fillExample(): void {
    // patchValue updates only the fields you pass; setValue requires ALL fields.
    this.profile.patchValue({ name: 'Ada Lovelace', email: 'ada@example.com', favoriteGenre: 'Sci-Fi' });
  }
}
