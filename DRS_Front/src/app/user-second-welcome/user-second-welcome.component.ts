// user-second-welcome.component.ts
import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LogoutService} from "../services/logout.service";

@Component({
  selector: 'app-user-second-welcome',
  templateUrl: './user-second-welcome.component.html',
  styleUrls: ['./user-second-welcome.component.css']
})
export class UserSecondWelcomeComponent {
  showForms: { [key: string]: boolean } = {
    showStoreForm: false,
    showProfileForm: false,
    showVerificationForm: false,
    showPaymentsForm: false,
    showConversionForm: false,
    showHistoryForm: false,
    showAmountForm: false  // Added for app-user-amount component

  };

  constructor(private router: Router, private logoutService: LogoutService) {} // Inject LogoutComponent

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
  toggleForm(formKey: string) {
    // Hide other forms when showing a new form
    Object.keys(this.showForms).forEach(key => {
      if (key !== formKey) {
        this.showForms[key] = false;
      }
    });

    this.showForms[formKey] = !this.showForms[formKey];
  }

  toggleStoreForm() {
    this.toggleForm('showStoreForm');
  }

  toggleProfileForm() {
    this.toggleForm('showProfileForm');
  }

  toggleVerificationForm() {
    this.toggleForm('showVerificationForm');
  }

  togglePaymentsForm() {
    this.toggleForm('showPaymentsForm');
  }

  toggleConversionForm() {
    this.toggleForm('showConversionForm');
  }

  toggleHistoryForm() {
    this.toggleForm('showHistoryForm');
  }

  toggleAmountForm() {
    this.toggleForm('showAmountForm');
  }
}
