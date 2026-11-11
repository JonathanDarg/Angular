import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ObservableBasics } from './lessons/observable-basics';
import { OperatorsDemo } from './lessons/operators-demo';
import { SearchDebounce } from './lessons/search-debounce';
import { SignalInterop } from './lessons/signal-interop';
import { SwitchmapDemo } from './lessons/switchmap-demo';

@Component({
  selector: 'app-root',
  // Each lesson's example is its own component (see lessons/).
  imports: [RouterOutlet, ObservableBasics, OperatorsDemo, SearchDebounce, SwitchmapDemo, SignalInterop],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Shown in the page header.
  protected readonly title = signal('06 · RxJS');
}
