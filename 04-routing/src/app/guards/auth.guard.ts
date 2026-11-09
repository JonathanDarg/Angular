import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// A guard is a function the router runs BEFORE entering a route.
// CanActivateFn can return:
//   true      → let the navigation continue
//   false     → cancel it (stay on the current page)
//   a UrlTree → cancel it and go somewhere else instead (a redirect)
// Guards can use inject() because the router runs them in an injection context.
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Not logged in: send them to /login and remember where they were going,
  // as a query parameter: /login?returnUrl=/admin
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
