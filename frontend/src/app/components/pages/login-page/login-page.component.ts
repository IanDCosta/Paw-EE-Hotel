import { Component } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRestService } from '../../../services/auth-rest.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  errorMessage!: string;
  

  constructor(
    private router: Router,
    private authService: AuthRestService,
  ) {
    this.password = '';
    this.email = '';
  }

  login(): void {
    console.log(this.email);
    console.log(this.password);
    
    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (response: any) => {
          if (response && response.token) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            const decodedToken: any = jwtDecode(response.token);
            const userRole = decodedToken.role;

            if (userRole === 'customer') {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/login']);
            }
          } else {
            this.errorMessage = 'Login error!';
          }
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    }

  /* loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    //fc.email e fc.password
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.userService
      .login({
        email: this.fc.email.value,
        password: this.fc.password.value,
      })
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  } */
}
