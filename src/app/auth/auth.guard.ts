import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    // use map to return a boolean! Must be a boolean
    return this.authService.user.pipe(
      take(1), // we only want the guard to run once then unsubscribe to stop strange side effects! Always do this where possible. We dont need an on going listener!
      map((user) => {
        const isAuth = user ? true : false; // if we have a user, return true, if not return false and route wont go through
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']); // if no user, we are redirected to auth so user can login. Protects the recipes route from manula access by tying in /recipes
      })
    );
  }
}
