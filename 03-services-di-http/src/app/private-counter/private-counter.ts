import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CounterPanel } from '../counter-panel/counter-panel';
import { CounterService } from '../services/counter.service';

// Used in section 3. Listing CounterService in `providers` creates a NEW instance
// just for this component and everything inside it.
// The CounterPanel inside looks up the tree, finds THIS provider first,
// and so never sees the app-wide (root) counter.
@Component({
  selector: 'app-private-counter',
  imports: [CounterPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CounterService],
  template: `<app-counter-panel label="Private panel" />`,
})
export class PrivateCounter {}
