import { Component } from '@angular/core';
import { Customer } from '../../../shared/models/customer';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthRestService } from '../../../services/auth-rest.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService:AuthRestService) { }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);

    this.isLoggedIn = currentUser !== null;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
