// user-history.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Add this import

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {
  historyData: any[] = [];

  constructor(private productService: ProductService, private http: HttpClient) {} // Add HttpClient to the constructor

  ngOnInit() {
    this.fetchHistoryData();
  }

  fetchHistoryData() {
    // Replace 'http://localhost:4000/history' with your actual endpoint for fetching user history data
    const getHistoryEndpoint = `http://localhost:4000/history`;

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.get(getHistoryEndpoint, { headers }).subscribe(
      (data) => {
        this.historyData = data as any[];
      },
      (error) => {
        console.error('Error fetching user history data:', error);
                //alert('Error: ' + error);
      }
    );
  }
}
