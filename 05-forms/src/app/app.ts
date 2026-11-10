import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsletterSignalForm } from './lessons/newsletter-signal-form';
import { ProfileForm } from './lessons/profile-form';
import { ReviewForm } from './lessons/review-form';
import { SignupForm } from './lessons/signup-form';
import { WatchlistForm } from './lessons/watchlist-form';

@Component({
  selector: 'app-root',
  // Each lesson's form is its own component (see lessons/).
  imports: [RouterOutlet, ProfileForm, ReviewForm, SignupForm, WatchlistForm, NewsletterSignalForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Shown in the page header.
  protected readonly title = signal('05 · Forms & Validation');
}
