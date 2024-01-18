// admin-verification.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-verification',
  templateUrl: './admin-verification.component.html',
  styleUrls: ['./admin-verification.component.css']
})
export class AdminVerificationComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    // Replace 'http://localhost:4000/users' with your actual endpoint for fetching users
    const getUsersEndpoint = `http://localhost:4000/verify`;

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.get(getUsersEndpoint, { headers }).subscribe(
      (data) => {
        this.users = data as any[];
      },
      (error) => {
        console.error('Error fetching users:', error);
                alert('Error: ' + error);
      }
    );
  }

  verify(user: any) {
    // Replace 'http://localhost:4000/user' with your actual endpoint for user verification
    const verifyUserEndpoint = `http://localhost:4000/verify`;

    // Retrieve the token from local storage if needed
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    // Construct the request body with the updated fields
    const requestBody = {
      userId: user.userId,
      // Add other fields as needed
    };

    this.http.put(verifyUserEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        console.log('User verified successfully:', response);
                        alert('User verified successfully:');
        // Optionally, you can update the local user status or perform other actions
      },
      (error) => {
        console.error('User verification error:', error);
                alert('Error: ' + error);
      }
    );
  }
}
