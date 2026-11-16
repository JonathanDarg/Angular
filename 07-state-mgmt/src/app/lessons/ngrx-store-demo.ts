import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionsSubject, Store } from '@ngrx/store';
import { filter, scan } from 'rxjs';
import { VotesActions } from '../state/votes/votes.actions';
import { votesFeature } from '../state/votes/votes.reducer';

// Section 4: the classic NgRx Store. The app has ONE global store (set up with
// provideStore in app.config.ts). Components:
//   - READ with store.selectSignal(selector)
//   - WRITE by store.dispatch(action). The reducer computes the new state.
@Component({
  selector: 'app-ngrx-store-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <caption class="visually-hidden">Votes per movie</caption>
      <thead>
        <tr><th scope="col">Movie</th><th scope="col">Votes</th><th scope="col">Vote</th></tr>
      </thead>
      <tbody>
        @for (row of ranking(); track row.movie.id) {
          <tr>
            <td>{{ row.movie.title }}</td>
            <td>{{ row.count }}</td>
            <td>
              <!-- dispatch() sends an action; it doesn't change anything itself -->
              <button type="button" (click)="upvote(row.movie.id)" [attr.aria-label]="'Upvote ' + row.movie.title">▲</button>
              <button type="button" (click)="downvote(row.movie.id)" [attr.aria-label]="'Downvote ' + row.movie.title">▼</button>
            </td>
          </tr>
        }
      </tbody>
    </table>

    <p aria-live="polite">
      Total votes: <strong>{{ total() }}</strong> ·
      Leader: <strong>{{ leader() ?? 'no votes yet' }}</strong>
    </p>
    <button type="button" (click)="reset()">Reset (dispatch VotesActions.reset())</button>

    <p class="label">Action log (newest first): every change starts as an action</p>
    <ol class="log">
      @for (type of actionLog(); track $index) {
        <li>{{ type }}</li>
      } @empty {
        <li class="muted">No actions yet.</li>
      }
    </ol>
  `,
})
export class NgrxStoreDemo {
  private readonly store = inject(Store);

  // selectSignal turns a selector into a signal that updates when the state changes.
  protected readonly ranking = this.store.selectSignal(votesFeature.selectRanking);
  protected readonly total = this.store.selectSignal(votesFeature.selectTotalVotes);
  protected readonly leader = this.store.selectSignal(votesFeature.selectLeader);

  // ActionsSubject is the stream of every action dispatched to the store.
  // We keep the last 6 action types to show the "one way" flow.
  // (Ignoring NgRx's own startup actions, which start with "@ngrx".)
  protected readonly actionLog = toSignal(
    inject(ActionsSubject).pipe(
      filter((action) => !action.type.startsWith('@ngrx')),
      scan((log, action) => [action.type, ...log].slice(0, 6), [] as string[]),
    ),
    { initialValue: [] as string[] },
  );

  protected upvote(movieId: number): void {
    this.store.dispatch(VotesActions.upvote({ movieId }));
  }

  protected downvote(movieId: number): void {
    this.store.dispatch(VotesActions.downvote({ movieId }));
  }

  protected reset(): void {
    this.store.dispatch(VotesActions.reset());
  }
}
