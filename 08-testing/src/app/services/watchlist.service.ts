import { Injectable, computed, signal } from '@angular/core';

// A signal-based service (like folder 07). Tested in watchlist.service.spec.ts.
@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly _titles = signal<string[]>([]);
  readonly titles = this._titles.asReadonly();
  readonly count = computed(() => this._titles().length);

  add(title: string): void {
    const clean = title.trim();
    // Ignore blanks and duplicates.
    if (!clean || this._titles().includes(clean)) return;
    this._titles.update((titles) => [...titles, clean]);
  }

  remove(title: string): void {
    this._titles.update((titles) => titles.filter((t) => t !== title));
  }
}
