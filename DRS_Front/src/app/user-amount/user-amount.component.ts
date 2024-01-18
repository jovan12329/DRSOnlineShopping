// user-amount.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-amount',
  templateUrl: './user-amount.component.html',
  styleUrls: ['./user-amount.component.css']
})
export class UserAmountComponent implements OnInit {
  paymentsData: any = { money: 0, currency: '' };
  currencies: string[] = [];
  newProduct: any = { money: 0, currency: '' };
  equivalentAmount: number | null = null;
  exchangeRateData: any; // Variable to store the exchange rate data

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Fetch payments data and currencies when the component is initialized
    this.fetchCurrencies();
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
        alert('Amount Error: Verification');
      }
    );
  }

  onCurrencyAdd() {
    // Replace 'http://localhost:4000/add-amount' with your actual endpoint for adding amount on the server
    const addAmountEndpoint = 'http://localhost:4000/cash';

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    // Prepare data for the PUT request
    const addAmountData = {
      money: this.newProduct.money,
      currency: this.newProduct.currency
      // Add other data if needed
    };

    this.http.put<any>(addAmountEndpoint, addAmountData, { headers }).subscribe(
      (response) => {
        console.log('Amount added successfully:', response);
        // Handle success as needed
      },
      (error) => {
        console.error('Error adding amount:', error);
        alert('Amount Error: Verification');
        // Handle error as needed
      }
    );
  }
}
