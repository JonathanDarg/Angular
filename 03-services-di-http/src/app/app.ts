import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { APP_SETTINGS } from './app-settings';
import { CounterPanel } from './counter-panel/counter-panel';
import { Post, User } from './models';
import { PrivateCounter } from './private-counter/private-counter';
import { CounterService } from './services/counter.service';
import { LoggerService } from './services/logger.service';
import { UserApiService } from './services/user-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, CounterPanel, PrivateCounter],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Shown in the page header at the top of app.html.
  protected readonly title = signal('03 · Services, DI & HTTP');

  // ---- 1. Services & 2. inject() ----
  // inject() in a field: Angular finds the provider and hands back the instance.
  // These are the SAME root instances the child panels get.
  protected readonly counter = inject(CounterService);
  protected readonly logger = inject(LoggerService);

  // ---- 3. Dependency injection: InjectionToken ----
  // Injecting a plain settings object by its token (value set in app.config.ts).
  protected readonly settings = inject(APP_SETTINGS);

  // ---- 4. HttpClient ----
  private readonly userApi = inject(UserApiService);

  // Holds the request Observable once the button is clicked (null before that).
  protected readonly users$ = signal<Observable<User[]> | null>(null);
  protected readonly httpError = signal('');

  protected loadUsers(): void {
    this.httpError.set('');
    this.users$.set(
      this.userApi.getUsers().pipe(
        // If the request fails (e.g. offline), show a message and fall back to an empty list.
        // catchError and other RxJS operators are covered in folder 06.
        catchError(() => {
          this.httpError.set('Request failed. Check your internet connection.');
          return of([]);
        }),
      ),
    );
  }

  // ---- 5. resource() ----
  protected readonly userId = signal(1);

  // resource() has two parts:
  //  - params: a function that reads signals. When they change, the loader re-runs.
  //  - loader: an async function that receives those params and returns the data.
  // abortSignal cancels the old request if params change before it finishes.
  protected readonly userResource = resource({
    params: () => ({ id: this.userId() }),
    loader: async ({ params, abortSignal }): Promise<User> => {
      const response = await fetch(`${this.settings.apiUrl}/users/${params.id}`, {
        signal: abortSignal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
  });

  protected previousUser(): void {
    this.userId.update((id) => Math.max(1, id - 1));
  }

  protected nextUser(): void {
    this.userId.update((id) => Math.min(10, id + 1));
  }

  // ---- 6. httpResource() ----
  protected readonly postId = signal(1);

  // httpResource<Post>(() => url): the function reads postId(), so a new id
  // means a new URL, which means a new request. It uses HttpClient internally,
  // so it needs provideHttpClient() too. Same isLoading()/error()/value() signals as resource().
  protected readonly postResource = httpResource<Post>(
    () => `${this.settings.apiUrl}/posts/${this.postId()}`,
  );

  protected onPostIdInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    // Only accept whole numbers the API actually has (1–100).
    if (Number.isInteger(value) && value >= 1 && value <= 100) {
      this.postId.set(value);
    }
  }
}
