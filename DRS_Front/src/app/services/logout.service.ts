// logout.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private http: HttpClient) {}

  logout() {
    const logoutEndpoint = 'http://localhost:4000/logout';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    return this.http.post(logoutEndpoint, {}, { headers });
  }
}
