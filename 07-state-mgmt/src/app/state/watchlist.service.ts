import { Injectable, computed, signal } from '@angular/core';
import { MOVIES } from '../movies';

// Section 1: a "signal store" built with nothing but a service and signals.
// This is often all the state management a small or medium app needs.
//
// The pattern:
//   1. PRIVATE writable signal = the state (only this service can change it)
//   2. PUBLIC read-only signals and computed() = what components can read
//   3. PUBLIC methods = the only way to change the state
@Injectable({ providedIn: 'root' })
export class WatchlistService {
  // 1. State
  private readonly _ids = signal<number[]>([]);

  // 2. Reading the state
  readonly ids = this._ids.asReadonly();
  readonly movies = computed(() => MOVIES.filter((m) => this._ids().includes(m.id)));
  readonly count = computed(() => this._ids().length);

  // 3. Changing the state. Each method makes a NEW array (never edits the old one),
  //    so the signal sees the change and every reader updates.
  has(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    this._ids.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  clear(): void {
    this._ids.set([]);
  }
}
