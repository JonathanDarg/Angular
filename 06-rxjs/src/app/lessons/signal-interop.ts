import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, interval } from 'rxjs';

// Section 5: moving between RxJS and signals (@angular/core/rxjs-interop).
@Component({
  selector: 'app-signal-interop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>toSignal(): Observable → signal</h3>
    <!-- No async pipe needed: secondsOpen is a signal, so we just call it -->
    <p>This page has been open for <strong>{{ secondsOpen() }}</strong> seconds.</p>

    <h3>toObservable(): signal → Observable</h3>
    <label for="volume">Volume</label>
    <input id="volume" type="range" min="0" max="100" [value]="volume()" (input)="onVolume($event)" />
    <p aria-live="polite">
      Signal (instant): <strong>{{ volume() }}</strong> ·
      After debounceTime(500): <strong>{{ debouncedVolume() }}</strong>
    </p>
    <p class="label">Drag the slider: the debounced value only updates once you stop for half a second.</p>

    <h3>takeUntilDestroyed(): auto-unsubscribe</h3>
    <p>Heartbeats from a manual subscribe(): <strong>{{ heartbeats() }}</strong></p>
  `,
  styles: `h3 { margin-bottom: 0.25rem; font-size: 1rem; }`,
})
export class SignalInterop {
  // toSignal subscribes to the Observable and gives you its latest value as a signal.
  // It unsubscribes automatically when the component is destroyed.
  // initialValue is used until the first value arrives (interval waits 1s first).
  protected readonly secondsOpen = toSignal(interval(1000), { initialValue: 0 });

  // A normal signal...
  protected readonly volume = signal(50);

  // ...turned into an Observable so we can use RxJS operators (debounceTime) on it,
  // then turned back into a signal for the template. A common round trip.
  protected readonly debouncedVolume = toSignal(toObservable(this.volume).pipe(debounceTime(500)), {
    initialValue: 50,
  });

  protected readonly heartbeats = signal(0);

  constructor() {
    // When you DO call subscribe() yourself, you must unsubscribe later.
    // takeUntilDestroyed() does that automatically when the component is destroyed.
    // (Called in the constructor, it finds the component's DestroyRef on its own.)
    interval(2000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.heartbeats.update((n) => n + 1));
  }

  protected onVolume(event: Event): void {
    this.volume.set(Number((event.target as HTMLInputElement).value));
  }
}
