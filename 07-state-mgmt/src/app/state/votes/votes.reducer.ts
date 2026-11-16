import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { MOVIES } from '../../movies';
import { VotesActions } from './votes.actions';

// NgRx Store, part 2: the REDUCER decides how state changes for each action.
// A reducer is a PURE function: (currentState, action) => newState.
// It never edits the old state; it returns a new object.

export interface VotesState {
  votes: Record<number, number>; // movieId → vote count
}

const initialState: VotesState = {
  votes: { 3: 0, 4: 0, 7: 0, 9: 0 },
};

const votesReducer = createReducer(
  initialState,
  // on(action, handler): "when this action happens, here's the new state".
  on(VotesActions.upvote, (state, { movieId }) => ({
    votes: { ...state.votes, [movieId]: state.votes[movieId] + 1 },
  })),
  on(VotesActions.downvote, (state, { movieId }) => ({
    votes: { ...state.votes, [movieId]: Math.max(0, state.votes[movieId] - 1) },
  })),
  on(VotesActions.reset, () => initialState),
);

// NgRx Store, part 3: SELECTORS read (and derive) data from the state.
// createFeature bundles the reducer with automatic selectors for each property
// (here: votesFeature.selectVotes), and extraSelectors adds our own.
// createSelector caches its result until its inputs change, like computed().
export const votesFeature = createFeature({
  name: 'votes',
  reducer: votesReducer,
  extraSelectors: ({ selectVotes }) => {
    const selectRanking = createSelector(selectVotes, (votes) =>
      Object.entries(votes)
        .map(([id, count]) => ({ movie: MOVIES.find((m) => m.id === Number(id))!, count }))
        .sort((a, b) => b.count - a.count),
    );
    return {
      selectRanking,
      selectTotalVotes: createSelector(selectVotes, (votes) =>
        Object.values(votes).reduce((sum, n) => sum + n, 0),
      ),
      // Selectors can build on other selectors (this one reads selectRanking).
      selectLeader: createSelector(selectRanking, ([first, second]) => {
        if (first.count === 0) return null;
        return first.count > second.count ? first.movie.title : "it's a tie";
      }),
    };
  },
});
