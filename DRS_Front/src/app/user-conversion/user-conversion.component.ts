// user-conversion.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-conversion',
  templateUrl: './user-conversion.component.html',
  styleUrls: ['./user-conversion.component.css']
})
export class UserConversionComponent implements OnInit {
  paymentsData: any = { money: 0, currency: '' };
  currencies: string[] = [];
  newProduct: any = { money: 0, currency: '' };
  equivalentAmount: number | null = null;
  exchangeRateData: any; // Variable to store the exchange rate data

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Fetch payments data and currencies when the component is initialized
    this.fetchPaymentsData();
    this.fetchCurrencies();
  }

  fetchPaymentsData() {
    // Replace 'http://localhost:4000/cash' with your actual endpoint for fetching payments data
    const getPaymentsEndpoint = 'http://localhost:4000/cash';

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.get<any>(getPaymentsEndpoint, { headers }).subscribe(
      (data) => {
        console.log('Cash API Response:', data);
        this.paymentsData = data;

        // Assuming the response has properties 'money' and 'currency'
        if (this.paymentsData) {
          this.newProduct.money = this.paymentsData.money;
          this.newProduct.currency = this.paymentsData.currency;
        }
      },
      (error) => {
        console.error('Error fetching payments data:', error);
      }
    );
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

  onCurrencyChange() {
    // Calculate equivalent amount in the selected currency
    if (
      this.newProduct.currency &&
      this.paymentsData.currency &&
      this.exchangeRateData &&
      this.exchangeRateData.rates &&
      this.exchangeRateData.rates[this.newProduct.currency] &&
      this.exchangeRateData.rates[this.paymentsData.currency]
    ) {
      const targetCurrencyRate = this.exchangeRateData.rates[this.newProduct.currency];
      const baseCurrencyRate = this.exchangeRateData.rates[this.paymentsData.currency];

      // Convert directly between currencies
      this.equivalentAmount = (this.newProduct.money / baseCurrencyRate) * targetCurrencyRate;

      // Update the displayed equivalent amount without making an additional API call
      this.paymentsData.money = this.equivalentAmount;
      this.cdr.detectChanges();

      // Send a PUT request to update the currency on the server
      this.updateCurrencyOnServer();
    } else {
      this.equivalentAmount = null;
    }

    // Add your logic here that should happen when the currency selection changes
    console.log('Currency changed:', this.newProduct.currency);
    console.log('Equivalent Amount:', this.equivalentAmount);
    // You can add more logic or make API calls as needed
  }

  updateCurrencyOnServer() {
    // Replace 'http://localhost:4000/update-currency' with your actual endpoint for updating currency on the server
    const updateCurrencyEndpoint = 'http://localhost:4000/convert';

    // Retrieve the token from local storage
    const jwtToken = localStorage.getItem('access_token');

    // Set headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    // Prepare data for the PUT request
    const updateData = {
      currency: this.newProduct.currency
      // Add other data if needed
    };

    this.http.put<any>(updateCurrencyEndpoint, updateData, { headers }).subscribe(
      (response) => {
        console.log('Currency update successful:', response);
        // Handle success as needed
      },
      (error) => {
        console.error('Error updating currency:', error);
        // Handle error as needed
      }
    );
  }
}
