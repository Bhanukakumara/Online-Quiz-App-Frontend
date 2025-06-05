import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.includes('http://localhost:8080/auth/login') ||
    (req.url.startsWith('https') && req.url.includes(window.location.origin))
  ) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }
  return next(req);
};
