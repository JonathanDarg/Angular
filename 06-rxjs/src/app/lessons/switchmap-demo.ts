import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, finalize, map, mergeMap, switchMap, tap, timer } from 'rxjs';
import { MOVIES, Movie } from '../movies';

type Strategy = 'switchMap' | 'mergeMap';

// Section 4: switchMap, for when each click starts a request and only the latest matters.
@Component({
  selector: 'app-switchmap-demo',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="strategy">
      <legend>Operator</legend>
      <label class="radio">
        <input type="radio" name="strategy" value="switchMap"
               [checked]="strategy() === 'switchMap'" (change)="setStrategy('switchMap')" />
        switchMap (cancel the old request)
      </label>
      <label class="radio">
        <input type="radio" name="strategy" value="mergeMap"
               [checked]="strategy() === 'mergeMap'" (change)="setStrategy('mergeMap')" />
        mergeMap (keep every request)
      </label>
    </fieldset>

    <p class="label">Click several movies quickly. Each one starts a fake request that takes 0.4–1.6 seconds.</p>
    <div class="row">
      @for (movie of movies; track movie.id) {
        <!-- Each click pushes the movie into the clicks Subject -->
        <button type="button" (click)="clicks.next(movie)">{{ movie.title }}</button>
      }
    </div>

    <!-- Only the chosen pipeline is on the page, so only it is subscribed -->
    <p aria-live="polite">Showing:
      <strong>
        @if (strategy() === 'switchMap') { {{ (switchResult$ | async)?.title ?? '—' }} }
        @else { {{ (mergeResult$ | async)?.title ?? '—' }} }
      </strong>
    </p>

    <p class="label">Request log:</p>
    <ol class="log">
      @for (line of log(); track $index) {
        <li>{{ line }}</li>
      }
    </ol>
  `,
})
export class SwitchmapDemo {
  protected readonly movies = MOVIES.slice(0, 5);
  protected readonly strategy = signal<Strategy>('switchMap');
  protected readonly log = signal<string[]>([]);

  protected readonly clicks = new Subject<Movie>();

  // switchMap: for each click, start an inner Observable (the request).
  // When a NEW click arrives, it UNSUBSCRIBES from the old request (cancels it).
  // The result shown is always for the most recent click.
  protected readonly switchResult$ = this.clicks.pipe(switchMap((movie) => this.fakeRequest(movie)));

  // mergeMap: every request runs to the end, in parallel. Results show up in
  // whatever order they FINISH, so a slow old request can overwrite a newer one.
  protected readonly mergeResult$ = this.clicks.pipe(mergeMap((movie) => this.fakeRequest(movie)));

  // (Also worth knowing: concatMap waits for each request before starting the next,
  //  and exhaustMap ignores new clicks while one is still running.)

  protected setStrategy(strategy: Strategy): void {
    this.strategy.set(strategy);
    this.log.set([]);
  }

  // Pretends to load a movie from a server with a random delay.
  private fakeRequest(movie: Movie): Observable<Movie> {
    const delay = 400 + Math.floor(Math.random() * 1200);
    let finished = false;
    this.addLog(`▶ started ${movie.title} (${delay} ms)`);

    // timer(delay) emits once after `delay` ms, which stands in for an HTTP call.
    return timer(delay).pipe(
      map(() => movie),
      tap(() => {
        finished = true;
        this.addLog(`✔ finished ${movie.title}`);
      }),
      // finalize runs when the inner Observable ends for ANY reason.
      // If it never finished, switchMap must have cancelled it.
      finalize(() => {
        if (!finished) this.addLog(`✖ cancelled ${movie.title}`);
      }),
    );
  }

  private addLog(line: string): void {
    this.log.update((lines) => [...lines, line].slice(-8));
  }
}
