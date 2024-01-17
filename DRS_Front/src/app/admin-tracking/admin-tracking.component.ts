// admin-tracking.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Add this import

@Component({
  selector: 'app-admin-tracking',
  templateUrl: './admin-tracking.component.html',
  styleUrls: ['./admin-tracking.component.css']
})
export class AdminTrackingComponent implements OnInit {
  trackingData: any[] = [];

  constructor(private productService: ProductService, private http: HttpClient) {} // Add HttpClient to the constructor

  ngOnInit() {
    this.fetchTrackingData();
  }

  fetchTrackingData() {
    // Replace 'http://localhost:4000/buy' with your actual endpoint for fetching tracking data
    const getTrackingEndpoint = `http://localhost:4000/buy`;

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.get(getTrackingEndpoint, { headers }).subscribe(
      (data) => {
        this.trackingData = data as any[];
      },
      (error) => {
        console.error('Error fetching tracking data:', error);
      }
    );
  }
}
