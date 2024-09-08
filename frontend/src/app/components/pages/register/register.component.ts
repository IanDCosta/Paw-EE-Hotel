import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRestService } from '../../../services/auth-rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  contact: string = '';
  address: string = '';

  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthRestService) {}

  registerUser(): void {
    this.authService
      .registerUser(this.email, this.password, this.name, this.contact, this.address)
      .subscribe(
        (response: any) => {
          if (response && response.token) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.router.navigate(['/profile']);
          } else {
            this.errorMessage = 'Registration error!';
          }
        },
        (error) => {
          console.error('Error registering donor:', error);
          this.errorMessage = error.error ? error.error : 'Registration error!';
        }
      );
  }
}
