// logout.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../services/logout.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private router: Router, private logoutService: LogoutService) {}

  logout() {
    console.log('Logging out...');

    this.logoutService.logout().subscribe(
      (response) => {
        console.log('Logout successful:', response);

        // Explicitly remove access_token after successful logout
        console.log('Before removal:', localStorage.getItem('access_token'));
        localStorage.removeItem('access_token');
        console.log('After removal:', localStorage.getItem('access_token'));

        // Navigate to login page
        this.router.navigateByUrl('/login');
      },
      (error) => {
        console.error('Logout error:', error);

        // Handle error as needed
      }
    );
  }
}
