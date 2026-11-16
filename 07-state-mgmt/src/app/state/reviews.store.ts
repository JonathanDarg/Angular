import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, map, pipe, switchMap, tap, timer } from 'rxjs';
import { MOVIES } from '../movies';

// Section 3: loading data asynchronously into a Signal Store.

interface ReviewsState {
  selectedId: number;
  reviews: string[];
  isLoading: boolean;
  loadCount: number;
}

// Pretends to call a server: answers after 700 ms with a few made-up reviews.
function fakeFetchReviews(movieId: number): Observable<string[]> {
  const title = MOVIES.find((m) => m.id === movieId)?.title ?? 'This movie';
  return timer(700).pipe(
    map(() => [
      `"${title}" holds up on a rewatch.`,
      `Great pick for a movie night. ${(movieId % 3) + 3}/5`,
      `I didn't expect ${title} to be this good.`,
    ]),
  );
}

export const ReviewsStore = signalStore(
  // Starts on movie 3 (Spirited Away), the first of the demo's buttons.
  withState<ReviewsState>({ selectedId: 3, reviews: [], isLoading: false, loadCount: 0 }),

  withComputed(({ selectedId }) => ({
    selectedMovie: computed(() => MOVIES.find((m) => m.id === selectedId())),
  })),

  withMethods((store) => ({
    select(id: number): void {
      patchState(store, { selectedId: id });
    },

    // rxMethod turns an RxJS pipeline into a store method. You can call it with
    // a plain value, an Observable, OR a signal. Given a signal, it re-runs
    // every time the signal changes (see withHooks below).
    loadReviews: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        // switchMap (folder 06): if the user picks another movie before this
        // one finishes loading, the old request is cancelled.
        switchMap((id) => fakeFetchReviews(id)),
        tap((reviews) =>
          patchState(store, (s) => ({ reviews, isLoading: false, loadCount: s.loadCount + 1 })),
        ),
      ),
    ),
  })),

  // withHooks: run code when the store is created (onInit) or destroyed (onDestroy).
  withHooks({
    onInit(store) {
      // Pass the selectedId SIGNAL itself (no parentheses): now reviews load
      // right away, and again automatically whenever selectedId changes.
      store.loadReviews(store.selectedId);
    },
  }),
);
