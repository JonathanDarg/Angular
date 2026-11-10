import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forbiddenWord, passwordsMatch, strongPassword } from '../validators/custom-validators';

// Section 3: custom validators (see validators/custom-validators.ts).
@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="signup" (ngSubmit)="onSubmit()" novalidate>

      <label for="signup-username">Username</label>
      <input id="signup-username" type="text" formControlName="username" autocomplete="username"
             [attr.aria-invalid]="u.invalid && u.touched" aria-describedby="signup-username-error" />
      @if (u.touched && u.errors; as errors) {
        <p class="error" id="signup-username-error">
          @if (errors['required']) { Username is required. }
          <!-- Our custom forbiddenWord validator put { forbiddenWord: { word } } here -->
          @if (errors['forbiddenWord']) { Usernames can't contain "{{ errors['forbiddenWord'].word }}". }
        </p>
      }

      <label for="signup-password">Password</label>
      <input id="signup-password" type="password" formControlName="password" autocomplete="new-password"
             [attr.aria-invalid]="p.invalid && p.touched" aria-describedby="signup-password-error" />
      @if (p.touched && p.errors; as errors) {
        <ul class="error" id="signup-password-error">
          @if (errors['required']) { <li>Password is required.</li> }
          @if (errors['minlength']) { <li>Use at least 8 characters.</li> }
          <!-- strongPassword returns WHICH rules failed, so we can list them -->
          @if (errors['strongPassword']?.missingUppercase) { <li>Add a capital letter.</li> }
          @if (errors['strongPassword']?.missingNumber) { <li>Add a number.</li> }
        </ul>
      }

      <label for="signup-confirm">Confirm password</label>
      <input id="signup-confirm" type="password" formControlName="confirmPassword" autocomplete="new-password"
             [attr.aria-invalid]="mismatch()" aria-describedby="signup-confirm-error" />
      <!-- The mismatch error is on the GROUP (signup), not on a single control -->
      @if (mismatch()) {
        <p class="error" id="signup-confirm-error">Passwords don't match.</p>
      }

      <button type="submit">Create account</button>
    </form>

    @if (createdUser()) {
      <p class="success" role="status">Account created for "{{ createdUser() }}".</p>
    }
  `,
})
export class SignupForm {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly signup = this.fb.group(
    {
      // Custom validators are used exactly like built-in ones.
      username: ['', [Validators.required, forbiddenWord('admin')]],
      password: ['', [Validators.required, Validators.minLength(8), strongPassword]],
      confirmPassword: ['', Validators.required],
    },
    // Group-level validators go in the second argument.
    { validators: passwordsMatch },
  );

  // Short names for the template.
  protected readonly u = this.signup.controls.username;
  protected readonly p = this.signup.controls.password;

  protected readonly createdUser = signal('');

  protected mismatch(): boolean {
    return this.signup.hasError('passwordsMismatch') && this.signup.controls.confirmPassword.touched;
  }

  protected onSubmit(): void {
    if (this.signup.invalid) {
      this.signup.markAllAsTouched();
      return;
    }
    this.createdUser.set(this.u.value);
    this.signup.reset();
  }
}
