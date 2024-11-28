import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  constructor(private authService: AuthServiceService, private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    this.handleGoogleCallback();              // Handle Google OAuth callback
  }

  private async handleGoogleCallback() {
    if (typeof window === 'undefined') {      // Check if the code is running in the browser
        return;
    }
    const url = window.location.href;         // Get the current URL
    const idTokenMatch = url.match(/id_token=([^&]*)/);           // Extract the ID token and access token from the URL
    const accessTokenMatch = url.match(/access_token=([^&]*)/);   // Extract the Access token and access token from the URL
  if (idTokenMatch && accessTokenMatch) {                         // Check if the ID token and access token are present
        const idToken = idTokenMatch[1];
        const accessToken = accessTokenMatch[1];

        // ======= LOGGING =======
        // console.log('ID Token:', idToken);
        // console.log('Access Token:', accessToken);

        try {
            // Send the ID token and access token to the server for authentication
            const response = await axios.post('http://127.0.0.1:8000/api/auth/google', { id_token: idToken, access_token: accessToken });
            // console.log('Server Response:', response.data);

            this.authService.setUser(response.data);                                        // Update the user information
            this.cookieService.set('jwt_token', response.data.token,7, '/');                // Store the JWT token in a cookie
            this.cookieService.set('refresh_token', response.data.refresh_token, 7, '/');   // Store the refresh token in a cookie
            // console.log('jwt_token:', response.data.token);
            this.router.navigate(['/']);                                                    // Redirect to the main application
        } catch (error) {
            console.error('Login error:', error);
            this.router.navigate(['/login']);
        }
    } else {
        console.error('No ID token found in the URL');
        this.router.navigate(['/login']);
    }
  }

}
