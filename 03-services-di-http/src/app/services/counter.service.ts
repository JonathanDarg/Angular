import { Injectable, inject, signal } from '@angular/core';
import { LoggerService } from './logger.service';

// Shared counter state. Because it's providedIn: 'root', every component
// that injects it gets the SAME instance, so they all see the same count.
// (Section 3 shows how a component can ask for its own private copy instead.)
@Injectable({ providedIn: 'root' })
export class CounterService {
  // A service can inject other services with inject(), just like a component.
  private readonly logger = inject(LoggerService);

  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  increment(source: string): void {
    this._count.update((c) => c + 1);
    this.logger.log(`${source} → count is ${this._count()}`);
  }

  reset(source: string): void {
    this._count.set(0);
    this.logger.log(`${source} → reset to 0`);
  }
}
