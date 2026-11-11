import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, filter, interval, map, scan, share, take } from 'rxjs';

interface Pipelines {
  source$: Observable<number>;
  evens$: Observable<number>;
  timesTen$: Observable<number>;
  runningTotal$: Observable<number>;
  collected$: Observable<number[]>;
}

// Section 2: operators transform a stream. Each pipe() step gets values from the
// step before it and passes (possibly changed) values to the next one.
@Component({
  selector: 'app-operators-demo',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="start()">Start stream (8 values)</button>

    @if (pipelines(); as p) {
      <!-- The async pipe subscribes for us, shows the LATEST value,
           and unsubscribes automatically when this part of the page is removed -->
      <table>
        <caption class="visually-hidden">The same stream through different operators</caption>
        <thead>
          <tr><th scope="col">Stream</th><th scope="col">Latest value</th></tr>
        </thead>
        <tbody>
          <tr><td><code>interval(600).pipe(take(8))</code></td><td>{{ p.source$ | async }}</td></tr>
          <tr><td><code>filter(n =&gt; n % 2 === 0)</code></td><td>{{ p.evens$ | async }}</td></tr>
          <tr><td><code>map(n =&gt; n * 10)</code></td><td>{{ p.timesTen$ | async }}</td></tr>
          <tr><td><code>scan((sum, n) =&gt; sum + n, 0)</code></td><td>{{ p.runningTotal$ | async }}</td></tr>
          <tr><td><code>scan</code> into an array</td><td>[{{ (p.collected$ | async)?.join(', ') }}]</td></tr>
        </tbody>
      </table>
    } @else {
      <p class="muted">Click Start. Every row reads the same source, through a different operator.</p>
    }
  `,
})
export class OperatorsDemo {
  // Holds a fresh set of pipelines each time Start is clicked.
  protected readonly pipelines = signal<Pipelines | null>(null);

  protected start(): void {
    // interval(600) emits 0, 1, 2, ... every 600 ms forever; take(8) stops after 8 values.
    // share() lets all the rows below use ONE timer instead of each starting its own.
    const source$ = interval(600).pipe(take(8), share());

    this.pipelines.set({
      source$,
      // filter: let only some values through
      evens$: source$.pipe(filter((n) => n % 2 === 0)),
      // map: change each value
      timesTen$: source$.pipe(map((n) => n * 10)),
      // scan: like Array.reduce, but emits the running result after every value
      runningTotal$: source$.pipe(scan((sum, n) => sum + n, 0)),
      collected$: source$.pipe(scan((all, n) => [...all, n], [] as number[])),
    });
  }
}
