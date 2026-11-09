import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';

// Route: /movies (LAZY loaded with loadComponent in app.routes.ts)
@Component({
  selector: 'app-movie-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Movies</h2>
    <ul>
      @for (movie of movies; track movie.id) {
        <!-- [routerLink]="['/movies', movie.id]" builds the URL /movies/3 from pieces.
             The array form is safer than gluing strings together. -->
        <li><a [routerLink]="['/movies', movie.id]">{{ movie.title }}</a> ({{ movie.year }})</li>
      }
    </ul>
  `,
})
export class MovieList {
  protected readonly movies = inject(MovieService).getAll();
}
