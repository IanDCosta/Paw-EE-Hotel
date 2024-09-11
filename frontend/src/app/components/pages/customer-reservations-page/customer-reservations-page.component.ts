import { Component } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { Customer } from '../../../shared/models/customer';
import { jwtDecode } from 'jwt-decode';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../../shared/models/reservation';

@Component({
  selector: 'app-customer-reservations-page',
  templateUrl: './customer-reservations-page.component.html',
  styleUrl: './customer-reservations-page.component.css',
})
export class CustomerReservationsPageComponent {
  reservations: Reservation[] = [];

  currentUser: any = localStorage.getItem('currentUser');
  currentUserDecoded: any = jwtDecode(this.currentUser);
  userId = this.currentUserDecoded.id;
  customer!: Customer;

  errorMessage!: string;

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loadCustomerAndReservations();
  }

  loadCustomerAndReservations(): void {
    this.customerService.getCustomer(this.userId).subscribe({
      next: (data) => {
        this.customer = data;

        // Now that customer data is available, fetch the reservations
        this.reservationService
          .getReservationByCustomer(this.customer._id)
          .subscribe({
            next: (reservations: Reservation[]) => {
              this.reservations = reservations;
            },
            error: (err) => {
              this.errorMessage = err;
            },
          });
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }
}
