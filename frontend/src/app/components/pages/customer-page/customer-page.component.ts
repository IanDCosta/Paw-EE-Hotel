import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../shared/models/customer';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css'
})
export class CustomerPageComponent {
  currentUser: any = localStorage.getItem('currentUser');
  currentUserDecoded: any = jwtDecode(this.currentUser);
  userId = this.currentUserDecoded.id;
  customer!: Customer;
  errorMessage!: string;

  constructor(
    private rest: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    rest.getCustomer(this.userId).subscribe({
      next: (data) => {
        this.customer = data;
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }

  ngOnInit(): void {
    console.log("id" + this.customer._id);
    console.log("name" + this.customer.name);
    console.log("email" + this.customer.email);
    console.log("password" + this.customer.password);
    console.log("contact" + this.customer.contact);
    console.log("address" + this.customer.address);
    console.log("role" + this.customer.role);
    console.log("state" + this.customer.state);
    
  }
}