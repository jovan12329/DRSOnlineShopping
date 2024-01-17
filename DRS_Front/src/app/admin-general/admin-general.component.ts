// admin-general.component.ts
import { Component } from '@angular/core';
import { LogoutComponent} from "../logout/logout.component";
import {LogoutService} from "../services/logout.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-general',
  templateUrl: './admin-general.component.html',
  styleUrls: ['./admin-general.component.css']
})
export class AdminGeneralComponent {
  showAddProductForm: boolean = false;
  showProductInfo: boolean = false;
  showTracking: boolean = false;
  showVerification: boolean = false;

  constructor(private router: Router, private logoutService: LogoutService) {} // Inject LogoutComponent

  toggleAddProductForm() {
    this.showAddProductForm = !this.showAddProductForm;
    // Hide other components when showing the add product form
    this.showProductInfo = false;
    this.showTracking = false;
    this.showVerification = false;
  }

  toggleProductInfo() {
    this.showProductInfo = !this.showProductInfo;
    // Hide the add product form when showing product info
    this.showAddProductForm = false;
    this.showTracking = false;
    this.showVerification = false;
  }

  toggleTracking() {
    this.showTracking = !this.showTracking;
    // Hide other components when showing tracking
    this.showAddProductForm = false;
    this.showProductInfo = false;
    this.showVerification = false;
  }

  toggleVerification() {
    this.showVerification = !this.showVerification;
    // Hide other components when showing verification
    this.showAddProductForm = false;
    this.showProductInfo = false;
    this.showTracking = false;
  }

logout() {
    // Call the logout method from the LogoutService
    this.logoutService.logout().subscribe(
      (response) => {
        console.log('Logout successful:', response);
        this.router.navigateByUrl('/login');

      },
      (error) => {
        console.error('Logout error:', error);
        // Additional error handling if needed
      }
    );
  }
}
