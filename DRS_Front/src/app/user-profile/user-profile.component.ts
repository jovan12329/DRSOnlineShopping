// user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = { // Replace 'any' with your actual user model type
    id: 0,
    name: '',
    surname: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    // Fetch current user data when the component is initialized
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    // Replace 'http://localhost:4000/api/current-user' with your actual endpoint
    const currentUserEndpoint = 'http://localhost:4000/current';

    // Retrieve the token from local storage
    const token = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(currentUserEndpoint, { headers }).subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching current user:', error);
                alert('Error: ' + error);
      }
    );
  }

  onSubmit() {
    const updateProfileEndpoint = 'http://localhost:4000/change';

    // Retrieve the 'sub' claim from the JWT token
    const jwtToken = localStorage.getItem('access_token');
    const jwtSubject = jwtToken ? this.parseJwt(jwtToken)?.['sub'] : null;

    const requestBody = {
      id: jwtSubject, // Use 'sub' as the 'id'
      name: this.user.name,
      surname: this.user.surname,
      address: this.user.address,
      city: this.user.city,
      country: this.user.country,
      phone: this.user.phone,
      email: this.user.email,
      password: this.user.password
      // Add other fields as needed
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.put(updateProfileEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
      },
      (error) => {
        console.error('Profile update error:', error);
        alert('Profile error: Invalid fields');
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
