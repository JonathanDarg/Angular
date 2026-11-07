import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CounterService } from '../services/counter.service';

// A small component that injects CounterService.
// Which INSTANCE it gets depends on where the service is provided (see sections 1 and 3).
@Component({
  selector: 'app-counter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <strong>{{ label() }}</strong>
      <p aria-live="polite">Count: {{ counter.count() }}</p>
      <button type="button" (click)="counter.increment(label())">+1</button>
      <button type="button" (click)="counter.reset(label())">Reset</button>
    </div>
  `,
  styles: `
    .panel { padding: 0.75rem 1rem; border: 1px solid #ccc; border-radius: 8px; min-width: 150px; }
    p { margin: 0.5rem 0; }
    button { margin-right: 0.25rem; }
  `,
})
export class CounterPanel {
  readonly label = input.required<string>();

  // inject(CounterService) asks Angular's injector for a CounterService.
  // Angular looks UP the component tree for the nearest provider and uses that instance.
  protected readonly counter = inject(CounterService);
}
