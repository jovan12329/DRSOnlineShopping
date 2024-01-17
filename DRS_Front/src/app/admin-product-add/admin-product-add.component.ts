// admin-product-add.component.ts
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-admin-product-add',
  templateUrl: './admin-product-add.component.html',
  styleUrls: ['./admin-product-add.component.css']
})
export class AdminProductAddComponent implements OnInit {
  @Output() closeForm = new EventEmitter<void>();
  @Output() fetchProducts = new EventEmitter<void>();
  currencies: string[] = [];
  exchangeRateData: any; // Variable to store the exchange rate data

  newProduct = {
    name: '',
    price: 0,
    currency: '',
    quantity: 0
  };

  constructor(private http: HttpClient, private productService: ProductService) {}

    ngOnInit() {
    // Fetch payments data and currencies when the component is initialized
    this.fetchCurrencies();
  }

  closeAddProductForm() {
    this.closeForm.emit();
  }

    fetchCurrencies() {
    const exchangeRateApi = 'https://api.exchangerate-api.com/v4/latest/USD'; // USD is the base currency

    this.http.get<any>(exchangeRateApi).subscribe(
      (data) => {
        console.log('ExchangeRate API Response:', data);

        // Store the exchange rate data
        this.exchangeRateData = data;

        // Assuming the response has a 'rates' property with currency codes
        if (this.exchangeRateData && this.exchangeRateData.rates) {
          this.currencies = Object.keys(this.exchangeRateData.rates);
        }
      },
      (error) => {
        console.error('Error fetching currencies from ExchangeRate API:', error);
      }
    );
  }

  onSubmit() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      'Content-Type': 'application/json'
    });

    this.productService.addProduct(this.newProduct, headers).subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        this.fetchProducts.emit();
        this.newProduct = {
          name: '',
          price: 0,
          currency: '',
          quantity: 0
        };
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }
}
