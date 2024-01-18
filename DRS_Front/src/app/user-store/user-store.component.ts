// user-store.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-store',
  templateUrl: './user-store.component.html',
  styleUrls: ['./user-store.component.css']
})
export class UserStoreComponent implements OnInit {
  products: any[] = [];
  currencies: string[] = [];
  selectedCurrency: string = 'USD';
  exchangeRateData: any; // Declare exchangeRateData

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchCurrencies();
    this.fetchStoreItems();
  }

  fetchStoreItems() {
    // Assume your API endpoint for store items is 'http://localhost:4000/products'
    const getProductsEndpoint = 'http://localhost:4000/product';

    this.http.get<any[]>(getProductsEndpoint).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching store items:', error);
        alert('Store Error: Verification');
      }
    );
  }

  fetchCurrencies() {
    const exchangeRateApi = 'https://api.exchangerate-api.com/v4/latest/USD';

    this.http.get<any>(exchangeRateApi).subscribe(
      (data) => {
        console.log('ExchangeRate API Response:', data);

        // Store the exchange rate data
        this.exchangeRateData = data;

        if (this.exchangeRateData && this.exchangeRateData.rates) {
          this.currencies = Object.keys(this.exchangeRateData.rates);
        }
      },
      (error) => {
        console.error('Error fetching currencies from ExchangeRate API:', error);
        alert('Store Error: Verification');
      }
    );
  }

  onCurrencyChange(product: any) {
    // Check if the product has a valid currency
    if (
      product.currency &&
      this.selectedCurrency &&
      this.exchangeRateData &&
      this.exchangeRateData.rates &&
      this.exchangeRateData.rates[product.currency] &&
      this.exchangeRateData.rates[this.selectedCurrency]
    ) {
      const targetCurrencyRate = this.exchangeRateData.rates[this.selectedCurrency];
      const baseCurrencyRate = this.exchangeRateData.rates[product.currency];

      // Calculate equivalent amount in the selected currency
      const equivalentPrice = (product.price / baseCurrencyRate) * targetCurrencyRate;

      // Update the product's price with the equivalent amount
      product.price = equivalentPrice;

      // Update the displayed equivalent amount without making an additional API call
      this.cdr.detectChanges();
    }
  }

  buyProduct(product: any) {
    const buyProductEndpoint = `http://localhost:4000/buy`;
    const jwtToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const requestBody = {
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      quantity: 1,
    };

    this.http.post(buyProductEndpoint, requestBody, { headers }).subscribe(
      (response) => {
        console.log('Product purchased successfully:', response);
        this.fetchStoreItems(); // Fetch store items after the purchase
      },
      (error) => {
        console.error('Product purchase error:', error);
        alert('Store Error: Verification');
      }
    );
  }

// user-store.component.ts
// ... (previous code)

// user-store.component.ts
// ... (previous code)

updateProduct(product: any) {
  const updateProductEndpoint = 'http://localhost:4000/convert';
  const jwtToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  });

  const requestBody = {
    id: product.id,
    price: product.price,
    currency: product.currency
  };

  this.http.post(updateProductEndpoint, requestBody, { headers }).subscribe(
    (response: any) => {
      console.log('Product updated successfully:', response);

      // Update the displayed values without fetching the entire list
      product.price = response.money;
      product.currency = response.currency;

      // Update the displayed equivalent amount without making an additional API call
      //this.onCurrencyChange(product);
    },
    (error) => {
      console.error('Product update error:', error);
              alert('Error: ' + error);
    }
  );
}


// ... (remaining code)


// ... (remaining code)


}
