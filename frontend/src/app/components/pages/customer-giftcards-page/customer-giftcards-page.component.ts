import { Component } from '@angular/core';
import { GiftCard } from '../../../shared/models/giftCard';
import { Customer } from '../../../shared/models/customer';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { GiftCardService } from '../../../services/gift-card.service';

@Component({
  selector: 'app-customer-giftcards-page',
  templateUrl: './customer-giftcards-page.component.html',
  styleUrl: './customer-giftcards-page.component.css'
})
export class CustomerGiftcardsPageComponent {
  giftCards!: GiftCard[] | undefined;

  currentUser: any = localStorage.getItem('currentUser');
  currentUserDecoded: any = jwtDecode(this.currentUser);
  userId = this.currentUserDecoded.id;
  customer!: Customer;

  errorMessage!: string;

   constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    customerService.getCustomer(this.userId).subscribe({
      next: (data) => {
        this.customer = data;
        this.giftCards = data.giftCards;
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }
}
