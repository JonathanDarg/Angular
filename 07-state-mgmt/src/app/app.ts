import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgrxStoreDemo } from './lessons/ngrx-store-demo';
import { ReviewsDemo } from './lessons/reviews-demo';
import { ServiceCatalog } from './lessons/service-catalog';
import { ServiceWatchlist } from './lessons/service-watchlist';
import { SignalStoreDemo } from './lessons/signal-store-demo';

@Component({
  selector: 'app-root',
  // Each lesson's example is its own component (see lessons/).
  imports: [RouterOutlet, ServiceCatalog, ServiceWatchlist, SignalStoreDemo, ReviewsDemo, NgrxStoreDemo],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Shown in the page header.
  protected readonly title = signal('07 · State Management');
}
