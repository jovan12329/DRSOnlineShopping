// registration.component.ts
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user = {
    name: '',
    surname: '',
    address: '',
    city: '',
    country: '',
    telephone: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const registrationEndpoint = 'http://localhost:4000/register';
    const requestBody = {
      name: this.user.name,
      surname: this.user.surname,
      address: this.user.address,
      city: this.user.city,
      country: this.user.country,
      phone: this.user.telephone,
      email: this.user.email,
      password: this.user.password
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(registrationEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        // Use Router to navigate programmatically
        this.router.navigateByUrl('/login');
      },
      (error) => {
        console.error('Registration error:', error);
        alert('Registration error: User already exists');
      }
    );
  }
}
