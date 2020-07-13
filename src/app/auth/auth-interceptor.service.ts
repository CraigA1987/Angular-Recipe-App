// intercepts all HTTP requests to add the token onto the end of the request! If statement deals with the fact a user may not be logged in yet

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1), // take lets us only deal with the first emissions
      exhaustMap((user) => {
        // add token to the request!

        if (!user) {
          return next.handle(req); // if no user, we dont try to add the token, and just return  the unmodified request
        }

        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
