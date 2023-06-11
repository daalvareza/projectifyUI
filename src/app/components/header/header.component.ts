
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor( private router: Router, private localStorageService: LocalStorageService) {}

  // Removes JWT token from localStorage and redirects user to login page
  logout() {
    // Call removeItem method from localStorageService, providing 'jwt' as the key to be removed
    this.localStorageService.removeItem('jwt');
    
    // Use router service to navigate to the login page
    this.router.navigate(['/login']);
  }
}