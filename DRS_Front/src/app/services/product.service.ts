// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:4000';
  private productEndpoint = '/product';
  private trackingDataEndpoint = '/api/tracking';
  private userHistoryDataEndpoint = '/api/user-history';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    const url = `${this.baseUrl}${this.productEndpoint}`;
    return this.http.get<any[]>(url);
  }

  addProduct(product: any, headers?: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}${this.productEndpoint}`;
    return this.http.post<any>(url, product, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding product:', error);
          return throwError(error);
        })
      );
  }

  increaseQuantity(productId: number): Observable<any> {
    const url = `${this.baseUrl}${this.productEndpoint}/${productId}/increase-quantity`;
    return this.http.put<any>(url, {});
  }

  getTrackingData(): Observable<any[]> {
    const url = `${this.baseUrl}${this.trackingDataEndpoint}`;
    return this.http.get<any[]>(url);
  }

  getUserHistoryData(): Observable<any[]> {
    const url = `${this.baseUrl}${this.userHistoryDataEndpoint}`;
    return this.http.get<any[]>(url);
  }
}
