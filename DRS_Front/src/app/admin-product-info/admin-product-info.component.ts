// admin-product-info.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-product-info',
  templateUrl: './admin-product-info.component.html',
  styleUrls: ['./admin-product-info.component.css']
})
export class AdminProductInfoComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  increaseQuantity(product: any) {
    // Replace 'http://localhost:4000/increase' with your actual endpoint
    const increaseQuantityEndpoint = `http://localhost:4000/product`;

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    // Construct the request body with the updated fields
    const requestBody = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      quantity: product.quantity + 1,
      // Add other fields as needed
    };

    this.http.put(increaseQuantityEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        console.log('Quantity increased successfully:', response);
        // Optionally, you can update the local product quantity
        product.quantity = requestBody.quantity;
      },
      (error) => {
        console.error('Quantity increase error:', error);
      }
    );
  }
}
