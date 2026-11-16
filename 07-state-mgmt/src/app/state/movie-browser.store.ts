import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { MOVIES, Movie } from '../movies';

// Section 2: the same idea as WatchlistService, but built with NgRx Signal Store.
// A store is assembled from "features", each adding one kind of thing.

type SortBy = 'title' | 'year';

interface MovieBrowserState {
  movies: readonly Movie[];
  query: string;
  sortBy: SortBy;
  favorites: number[];
}

const initialState: MovieBrowserState = {
  movies: MOVIES,
  query: '',
  sortBy: 'title',
  favorites: [],
};

// signalStore(...) creates an injectable CLASS. No providedIn here, so each component
// that lists it in `providers` gets its own copy (add { providedIn: 'root' } as the
// first argument to make it app-wide instead).
export const MovieBrowserStore = signalStore(
  // withState: the state. Every property automatically becomes a read-only signal:
  // store.query(), store.sortBy(), store.favorites() ...
  withState(initialState),

  // withComputed: derived values, recalculated when the state they read changes.
  withComputed(({ movies, query, sortBy, favorites }) => ({
    visibleMovies: computed(() => {
      const q = query().trim().toLowerCase();
      const filtered = movies().filter((m) => m.title.toLowerCase().includes(q));
      return [...filtered].sort((a, b) =>
        sortBy() === 'year' ? a.year - b.year : a.title.localeCompare(b.title),
      );
    }),
    favoriteCount: computed(() => favorites().length),
  })),

  // withMethods: the only way to change state. patchState(store, changes) merges
  // the changes into the current state, like set() for just some properties.
  withMethods((store) => ({
    setQuery(query: string): void {
      patchState(store, { query });
    },
    setSortBy(sortBy: SortBy): void {
      patchState(store, { sortBy });
    },
    // patchState can also take a function of the current state.
    toggleFavorite(id: number): void {
      patchState(store, (state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((x) => x !== id)
          : [...state.favorites, id],
      }));
    },
    reset(): void {
      patchState(store, initialState);
    },
  })),
);
