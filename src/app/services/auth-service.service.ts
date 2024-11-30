import { Injectable, NgModule, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})

export class AuthServiceService {
  public userData = signal<any>(null);

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {
    // Check if JWT token is available in cookies
    const token = this.cookieService.get('jwt_token');      // Get the JWT token from cookies
    // console.log(token);
    if (token) {
      this.checkToken(token);                                    // Check the token for validity
    }
  }

  private async checkToken(token:any) {

    if (token) {
      try {
        // Validate the token with the backend
        const response = await axios.post('http://127.0.0.1:8000/api/auth/validate', { token });

        // If the token is valid, update the user information
        this.setUser(response.data);
        this.cookieService.set('user_data', JSON.stringify(response.data), 7); // Set cookie with expiry
        this.cookieService.set('jwt_token', response.data.token, 7);
        this.cookieService.set('refresh_token', response.data.refresh_token, 14);
        // this.router.navigate(['/']); // Navigate to the main application
      } catch (error) {
        console.error('Token validation error:', error);

        // CHECK THE REFRESH-TOKEN IF TOKEN IS INVALID
        const refreshToken = this.cookieService.get('refresh_token');
        if (refreshToken) {
          try {
            // Attempt to refresh the token
            const refreshResponse = await axios.post('http://127.0.0.1:8000/api/auth/refresh', { token: refreshToken });
            // If successful, update the user information and store the new tokens
            this.setUser(refreshResponse.data);
            this.cookieService.set('user_data', JSON.stringify(refreshResponse.data), 7);
            this.cookieService.set('jwt_token', refreshResponse.data.token, 7);
            this.cookieService.set('refresh_token', refreshResponse.data.refresh_token, 14);
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            this.clearUser();
            this.router.navigate(['/']);
          }
        } else {
          this.clearUser();
          this.router.navigate(['/']);
        }
      }
    } else {
      this.clearUser();
      this.router.navigate(['/']);
    }
  }

  // Set user data in cookies
  setUser(data: any) {
    this.cookieService.set('user_data', JSON.stringify(data), 7); // Store user data in cookie for 7 days
    this.userData.set(data);
  }

  // Get user data from cookies
  getUser() {
    const user = this.cookieService.get('user_data');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('user_data'); // Check if user is logged in
  }

  // Clear user data and remove tokens
  clearUser() {
    this.userData.set(null);
    this.cookieService.delete('user_data');
    this.cookieService.delete('jwt_token');
    this.cookieService.delete('refresh_token');
  }

  loginWithGoogle() {
    if (typeof window === 'undefined') {
      return;
    }

    // Redirect to Google OAuth URL
    window.location.href = this.getGoogleOAuthUrl();
  }

  logout() {
    this.clearUser();
    this.router.navigate(['/']); // Redirect to home
  }

  // Function to generate the Google OAuth URL
  private getGoogleOAuthUrl(): string {
    const clientId = '540896356215-4l6f3jgmh4h4ulmdpi5majdpr0mcqs07.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:4200/auth/callback');
    const scope = encodeURIComponent('openid email profile');
    const responseType = 'token id_token';
    return `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  }

}
