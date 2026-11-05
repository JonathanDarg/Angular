import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

// Used in section 4: shows input() (data IN from the parent)
// and output() (events OUT to the parent).
@Component({
  selector: 'app-greeting-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <!-- Inputs are signals, so read them by calling them: name() -->
      <p>Hi, I'm <strong>{{ name() }}</strong>. {{ moodEmoji() }}</p>
      <!-- Clicking calls emit() on the output, which runs the parent's handler -->
      <button type="button" (click)="wave.emit(name())">Wave at parent</button>
    </div>
  `,
  styles: `
    .card { padding: 0.75rem 1rem; border: 1px solid #ccc; border-radius: 8px; min-width: 180px; }
    p { margin-top: 0; }
  `,
})
export class GreetingCard {
  // input.required: the parent MUST pass this, e.g. <app-greeting-card name="Ada" />
  readonly name = input.required<string>();

  // input with a default value: optional for the parent.
  // The type is inferred from the union of allowed strings.
  readonly mood = input<'happy' | 'sleepy'>('happy');

  // Inputs work with computed() just like any other signal.
  protected readonly moodEmoji = computed(() => (this.mood() === 'happy' ? '😀' : '😴'));

  // output<string>(): an event that carries a string.
  // The parent listens with (wave)="handler($event)", and $event is that string.
  readonly wave = output<string>();
}
