import { Component } from '@angular/core';
import { Reservation } from '../../../shared/models/reservation';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css',
})
export class ReservationPageComponent {
  reservation!: Reservation;
  errorMessage!: string;

  constructor(
    activatedRoute: ActivatedRoute,
    private reservationService: ReservationService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.reservationService.getReservationById(params.id).subscribe({
          next: (data: Reservation) => {
            console.log(data);
            
            this.reservation = data;
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
      }
    });
  }

  cancelReservation(){
    this.reservationService.updateReservationState(this.reservation._id, 'Cancelled').subscribe(
      (updatedReservation) => {
        console.log('Reservation cancelled succesfully', updatedReservation);
        window.location.reload();
      },
      (error) => {
        console.error('Error cancelling reservation', error);
      }
    )
  }
}
