import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Movie, MovieService } from '../services/movie.service';

// A resolver loads data BEFORE the route's component is created.
// The page only appears once the data is ready, so the component never
// has to show a "loading" or "not found" state itself.
export const movieResolver: ResolveFn<Movie> = async (route) => {
  const movies = inject(MovieService);
  const router = inject(Router);

  // route.paramMap holds the :id from the URL /movies/:id (always a string).
  const id = Number(route.paramMap.get('id'));

  // Pretend this is a slow server call, so you can see the router wait.
  // (A real resolver would usually call HttpClient.)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const movie = movies.getById(id);
  if (movie) {
    return movie;
  }

  // No such movie: redirect to the 404 page instead of showing an empty page.
  return new RedirectCommand(router.parseUrl('/not-found'));
};
