import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// Section 1: what an Observable is, and the subscribe → next → complete → teardown lifecycle.
@Component({
  selector: 'app-observable-basics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <button type="button" (click)="start()" [disabled]="isSubscribed()">subscribe()</button>
      <button type="button" (click)="stop()" [disabled]="!isSubscribed()">unsubscribe()</button>
      <button type="button" (click)="log.set([])">Clear log</button>
    </div>

    <p class="label">Log (what the Observable and the subscriber did):</p>
    <ol class="log" aria-live="polite">
      @for (line of log(); track $index) {
        <li>{{ line }}</li>
      } @empty {
        <li class="muted">Nothing yet. An Observable does nothing until someone subscribes.</li>
      }
    </ol>
  `,
})
export class ObservableBasics {
  protected readonly log = signal<string[]>([]);
  protected readonly isSubscribed = signal(false);
  private subscription: Subscription | null = null;

  // An Observable is a RECIPE for producing values over time. Creating it runs nothing.
  // The function inside runs once PER subscriber, when they subscribe.
  private readonly countdown$ = new Observable<number>((subscriber) => {
    this.addLog('Observable started (someone subscribed)');
    let n = 5;
    subscriber.next(n); // send a value to the subscriber

    const timerId = setInterval(() => {
      n--;
      subscriber.next(n);
      if (n === 0) {
        subscriber.complete(); // no more values will ever come
      }
    }, 1000);

    // The returned function is the TEARDOWN. RxJS calls it on complete, error,
    // or unsubscribe, so it's where you clean up (stop timers, close connections).
    return () => {
      clearInterval(timerId);
      this.addLog('teardown: timer cleared');
    };
  });

  constructor() {
    // If this component is destroyed while subscribed, unsubscribe to avoid a leak.
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  protected start(): void {
    this.isSubscribed.set(true);
    // subscribe() takes an "observer": handlers for each kind of notification.
    this.subscription = this.countdown$.subscribe({
      next: (value) => this.addLog(`next: ${value}`),
      error: (err) => this.addLog(`error: ${err}`),
      complete: () => {
        this.addLog('complete');
        this.isSubscribed.set(false);
      },
    });
  }

  protected stop(): void {
    // Unsubscribing early: no complete() is sent, but the teardown still runs.
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.isSubscribed.set(false);
    this.addLog('unsubscribed early');
  }

  private addLog(line: string): void {
    this.log.update((lines) => [...lines, line]);
  }
}
