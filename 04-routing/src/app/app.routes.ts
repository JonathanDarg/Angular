import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NotFound } from './pages/not-found';
import { movieResolver } from './resolvers/movie.resolver';

// The route table: which component to show for which URL.
// The router checks routes TOP TO BOTTOM and uses the first match,
// so the wildcard '**' must always be last.
export const routes: Routes = [
  // Redirect: an empty URL ("/") goes to /home.
  // pathMatch: 'full' means "only when the WHOLE path is empty".
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // EAGER route: Home is imported at the top of this file, so it's in the main bundle.
  // `title` sets the browser tab title when this route is active.
  { path: 'home', component: Home, title: 'Home · 04 Routing' },

  // LAZY route: loadComponent uses a dynamic import(). The MovieList code is put
  // in a separate file and only downloaded the first time someone visits /movies.
  {
    path: 'movies',
    title: 'Movies · 04 Routing',
    loadComponent: () => import('./pages/movie-list').then((m) => m.MovieList),
  },

  // ROUTE PARAMETER: ":id" matches any value, e.g. /movies/3 → id = "3".
  // RESOLVER: movieResolver loads the movie BEFORE the page shows, and its
  // result is available as `movie` (bound to the component's movie input).
  {
    path: 'movies/:id',
    title: 'Movie · 04 Routing',
    loadComponent: () => import('./pages/movie-detail').then((m) => m.MovieDetail),
    resolve: { movie: movieResolver },
  },

  // GUARD: authGuard runs first. If it doesn't return true, Admin never loads.
  {
    path: 'admin',
    title: 'Admin · 04 Routing',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin').then((m) => m.Admin),
  },

  { path: 'login', component: Login, title: 'Log in · 04 Routing' },

  // WILDCARD: matches anything not matched above, so unknown URLs show a 404 page.
  { path: '**', component: NotFound, title: 'Not found · 04 Routing' },
];
