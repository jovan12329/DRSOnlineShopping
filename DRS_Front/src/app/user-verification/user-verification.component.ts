// user-verification.component.ts
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.css']
})
export class UserVerificationComponent {
  user: any = {
    cardNumber: ''
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    // Replace 'http://localhost:4000/verify' with your actual endpoint
    const verificationEndpoint = 'http://localhost:4000/verify';

    // Retrieve the 'sub' claim from the JWT token
    const jwtToken = localStorage.getItem('access_token');
    const jwtSubject = jwtToken ? this.parseJwt(jwtToken)?.['sub'] : null;

    const requestBody = {
      userId: jwtSubject, // Use 'sub' as the identifier for the user
      cardNumber: this.user.cardNumber
      // Add other fields as needed
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.post(verificationEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        console.log('Verification successful:', response);
        // Handle success logic
      },
      (error) => {
        console.error('Verification error:', error);
        // Handle error logic
      }
    );
  }

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
