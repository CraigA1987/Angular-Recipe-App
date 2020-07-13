import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';

// Firebase API docs tell us what we will get back, so we can define the response as an interface. Not required but a good practice in Angular and TypeScript
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // question mark for optional, as signup request doesnt return it, but login request does
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // store the authenticated user
  user = new BehaviorSubject<User>(null); // next a new user at login / logout
  // storage of the token so that it can be accessed via different components, e.g data-storage for http requests so that it cna be sent to firebase
  // BehaviourSubject gives subscribers access to the previously omitted value, even if they weren't subscribed at the time that value was emitted! Like a global variable then

  private tokenExpirationTimer: any;

  // need the Angular http service injected in to make http requests to Firebase API
  constructor(private http: HttpClient, private router: Router) {}

  logout() {
    this.user.next(null); // sets user to null, clearing the object effectively logging out
    // redirect on logout
    this.router.navigate(['/auth']);
    // clear the local storage to remove the token
    localStorage.removeItem('userData');
    //check to see if we have an active timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null; // always reset the timer
  }

  // method to manage timer to log user out once token expires after an hour
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration); // calls when token expires
  }

  // on page refresh, check to see if localStorage contains a token, use to authenticate user
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')); // parse converts string back into a JS object
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      // calls the token getter - if no date is set, will be null - if still valid, make it into If block
      this.user.next(loadedUser); // emit the loadedUser as our user
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime(); // future date, minus current date = how long is left on token!
      this.autoLogout(expirationDuration); // need to calculate how long is left on the token
    }
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        // return so that we can subscibe in the auth component - we want the response there, so we can show loading spinner etc
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAY5aQVPrwhkgoBBcmlViahfp6YGjhr5G8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        } // catch the firebase error message and make it more useufl using rxjs pipe
      )
      .pipe(
        catchError(this.handleError), // tap operator lets us perform and action without changing the response
        tap((resData) => {
          // tap is used to get the response data and pass it to the handleAuthentication function which creates and emits a new User
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  // Javascript object needs to hold the three properties Firebase API expects. Firebase docs explain all!

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAY5aQVPrwhkgoBBcmlViahfp6YGjhr5G8',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError), // tap operator lets us perform and action without changing the response
        tap((resData) => {
          // tap is used to get the response data and pass it to the handleAuthentication function which creates and emits a new User
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An Unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      // if the error response has no error key, or nested error key
      return throwError(errorMessage); // send the generic error message using rxjs error --> returns an observable
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }

    return throwError(errorMessage);
  }

  // Used to create a new user and log the user in --> works from tap of response data
  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    // Get the response data, create an expiration date, and create a new user, before nexting it into the user variable.
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000 // Get the current date in milliseconds. as a date, for expiry of token
    ); // gives epiration date in miliseconds
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user); // Omit this user as the curently logged in user, into the user variable
    // also want to store the user varable in local storage so that it is persistant on page refresh etc
    this.autoLogout(expiresIn * 1000); // time left on token, in milliseconds (we need to times it by 1000 for this)
    localStorage.setItem('userData', JSON.stringify(user)); // need the JS Object to be a string for local storage
  }
}
