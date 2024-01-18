// login.component.ts
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginEndpoint = 'http://localhost:4000/login';
    const requestBody = {
      email: this.user.email,
      password: this.user.password
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>(loginEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        if (response && response.access_token) {
          // Save tokens locally
          localStorage.setItem('access_token', response.access_token);
          // Assuming your server sends a JWT with a "subject" claim
          const jwtSubject = this.parseJwt(response.access_token)?.['sub'];

          // Redirect based on the JWT subject
          if (jwtSubject === 1) {
            this.router.navigate(['/admin-general']);
          } else if (jwtSubject && +jwtSubject > 1) {
            this.router.navigate(['/user-second-welcome']);
          } else {
            console.error('Invalid JWT subject:', jwtSubject);
            alert('Error: ' + jwtSubject);
          }
        } else {
          console.error('Invalid response or access_token:', response);
          alert('Login error: Invalid fields');
        }
      },
      (error) => {
        console.error('Login error:', error);
          alert('Login error: Invalid fields');
      }
    );
  }

  // ...

  // Helper function to parse JWT
  private parseJwt(token: string): { [key: string]: any } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }
}
