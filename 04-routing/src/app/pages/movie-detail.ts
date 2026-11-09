import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Movie } from '../services/movie.service';

// Route: /movies/:id (lazy loaded, with a resolver, see app.routes.ts)
@Component({
  selector: 'app-movie-detail',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p><a routerLink="/movies">← All movies</a></p>
    <!-- movie() was loaded by movieResolver BEFORE this page was created -->
    <h2>{{ movie().title }} ({{ movie().year }})</h2>
    <p class="muted">Directed by {{ movie().director }}</p>
    <p>{{ movie().summary }}</p>
    <!-- id() comes straight from the URL -->
    <p class="muted">Route parameter <code>:id</code> = "{{ id() }}"</p>

    <nav class="row" aria-label="Movie navigation">
      @if (idNumber() > 1) {
        <a [routerLink]="['/movies', idNumber() - 1]">◀ Previous</a>
      }
      @if (idNumber() < 10) {
        <a [routerLink]="['/movies', idNumber() + 1]">Next ▶</a>
      }
      <!-- Programmatic navigation: navigate from code instead of a link -->
      <button type="button" (click)="goToRandom()">Random movie</button>
    </nav>
  `,
  styles: `
    .muted { color: #555; }
    .row { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  `,
})
export class MovieDetail {
  // withComponentInputBinding() (app.config.ts) copies route values into inputs by NAME:
  //  - the :id route parameter  → id input
  //  - resolve: { movie: ... }  → movie input
  // Route parameters are always strings.
  readonly id = input.required<string>();
  readonly movie = input.required<Movie>();

  protected readonly idNumber = computed(() => Number(this.id()));

  private readonly router = inject(Router);

  protected goToRandom(): void {
    const randomId = Math.floor(Math.random() * 10) + 1;
    // router.navigate takes the same array form as [routerLink].
    this.router.navigate(['/movies', randomId]);
  }
}
