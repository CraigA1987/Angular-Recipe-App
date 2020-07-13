import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  title = 'Recipe-App';
  loadedFeature = 'recipe';

  ngOnInit() {
    this.authService.autoLogin(); // uses local Storage to check for user token and resign user in if valid token is found
  }
}
