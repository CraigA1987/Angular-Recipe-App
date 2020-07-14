import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  // to switch between login / singup we need to monitor the app state
  isLoginMode = true;
  isLoading = false; // used to control loading spinner
  error: string = null; // variable used if an error occurs, to display error to user

  constructor(private authService: AuthService, private router: Router) {} // constructor used to inject the authservice so that we can get http request response in this component

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode; // reverse the value
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return; // just a check to ensure the form is valid
    }

    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    let authObs: Observable<AuthResponseData>; // putting this into a varaible so that code isnt repeated ... dry!

    if (this.isLoginMode) {
      // Login
      authObs = this.authService.login(email, password);
    } else {
      // Sign-up
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false; // on data return, cancel loading spinner
        this.router.navigate(['/recipes']); // navigate to recipes page once data is loaded
      },
      (errorMessage) => {
        // get an error message back as an observable
        // switch statement to handle error could be here, but better practice to deal with it in the service to keep component lean
        this.error = errorMessage;
        this.isLoading = false;
      }
    ); // sends the http request in the auth service. wont actually send unless it been subscribed to, whcih happens here!
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
