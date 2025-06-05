import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/'], { 
      queryParams: { returnUrl: state.url } 
    });
  }

  const requiredRoles = route.data['roles'] as Array<string>;

  const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));

  if (hasRequiredRole) {
    return true;
  }
  alert('You do not have permission to access this page.');
  return router.createUrlTree(['/'], { 
    queryParams: { returnUrl: state.url } 
  });
};
