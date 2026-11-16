import { createActionGroup, emptyProps, props } from '@ngrx/store';

// NgRx Store, part 1: ACTIONS describe something that happened.
// Components never change state directly; they dispatch actions like these.
//
// createActionGroup makes one action per event. The action's `type` string is
// "[source] event name", e.g. "[Votes] Upvote", which is what you see in the log.
export const VotesActions = createActionGroup({
  source: 'Votes',
  events: {
    // props<...>() describes the data the action carries.
    Upvote: props<{ movieId: number }>(),
    Downvote: props<{ movieId: number }>(),
    // emptyProps(): an action with no data.
    Reset: emptyProps(),
  },
});

// Usage: store.dispatch(VotesActions.upvote({ movieId: 3 }))
