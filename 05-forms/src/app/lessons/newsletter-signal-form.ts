import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
// Signal forms come from a separate entry point. They're EXPERIMENTAL in Angular 21,
// so the API may still change in future versions.
import { FormField, email, form, max, min, required, submit } from '@angular/forms/signals';

interface Newsletter {
  name: string;
  email: string;
  moviesPerMonth: number;
}

// Section 5: signal forms. Instead of FormGroup/FormControl objects, the data lives
// in a plain signal, and form() builds a tree of fields on top of it.
@Component({
  selector: 'app-newsletter-signal-form',
  // FormField provides the [formField] directive.
  imports: [FormField, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="onSubmit($event)" novalidate>
      <!-- [formField]="newsletter.name" two-way binds the input to model().name.
           No formControlName or FormGroup needed. -->
      <label for="news-name">Name</label>
      <input id="news-name" type="text" [formField]="newsletter.name" />
      <!-- newsletter.name() returns the field's STATE: value(), touched(), errors() are all signals -->
      @if (newsletter.name().touched() && newsletter.name().invalid()) {
        @for (error of newsletter.name().errors(); track error.kind) {
          <!-- The message comes from the schema below -->
          <p class="error">{{ error.message }}</p>
        }
      }

      <label for="news-email">Email</label>
      <input id="news-email" type="email" [formField]="newsletter.email" />
      @if (newsletter.email().touched() && newsletter.email().invalid()) {
        @for (error of newsletter.email().errors(); track error.kind) {
          <p class="error">{{ error.message }}</p>
        }
      }

      <label for="news-count">Movies you watch per month (0–31)</label>
      <!-- type="number" inputs bind to a number field automatically -->
      <input id="news-count" type="number" [formField]="newsletter.moviesPerMonth" />
      @if (newsletter.moviesPerMonth().invalid()) {
        @for (error of newsletter.moviesPerMonth().errors(); track error.kind) {
          <p class="error">{{ error.message }}</p>
        }
      }

      <button type="submit">Subscribe</button>
    </form>

    <!-- The model signal IS the form data: it updates as you type -->
    <p class="label">model() (the signal the form writes to):</p>
    <pre>{{ model() | json }}</pre>
    <p class="label">Form valid: <strong>{{ newsletter().valid() }}</strong></p>

    @if (subscribed()) {
      <p class="success" role="status">{{ subscribed() }}</p>
    }
  `,
})
export class NewsletterSignalForm {
  // 1) The data: a normal writable signal with the starting values.
  protected readonly model = signal<Newsletter>({ name: '', email: '', moviesPerMonth: 4 });

  // 2) The form: form(model, schema). The schema function receives a "path" to
  //    each field and attaches validation rules to it.
  protected readonly newsletter = form(this.model, (path) => {
    required(path.name, { message: 'Name is required.' });
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });
    min(path.moviesPerMonth, 0, { message: "Can't be negative." });
    max(path.moviesPerMonth, 31, { message: 'At most one a day (31).' });
  });

  protected readonly subscribed = signal('');

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault(); // stop the browser from reloading the page
    // submit() marks every field touched (so errors show), and only runs
    // the action if the whole form is valid.
    await submit(this.newsletter, async () => {
      this.subscribed.set(`Subscribed ${this.model().email}. Thanks, ${this.model().name}!`);
    });
  }
}
