import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';

// A search box that waits until typing pauses before emitting (a "debounce").
// Its test (search-box.spec.ts) uses FAKE TIMERS so it doesn't really wait.
@Component({
  selector: 'app-search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [for]="inputId()">{{ label() }}</label>
    <input [id]="inputId()" type="search" (input)="onInput($event)" />
  `,
})
export class SearchBox {
  readonly label = input('Search');
  readonly inputId = input('search-box');
  readonly delayMs = input(300);
  readonly search = output<string>();

  private timerId: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // Don't leave a timer running if the component is removed.
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timerId));
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // Every keystroke restarts the countdown; only a pause lets it finish.
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => this.search.emit(value.trim()), this.delayMs());
  }
}
