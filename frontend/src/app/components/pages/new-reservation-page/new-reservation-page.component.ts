import { Component } from '@angular/core';
import { Room } from '../../../shared/models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../shared/models/reservation';
import { Customer } from '../../../shared/models/customer';
import { jwtDecode } from 'jwt-decode';
import { CustomerService } from '../../../services/customer.service';
import { GiftCard } from '../../../shared/models/giftCard';

@Component({
  selector: 'app-new-reservation-page',
  templateUrl: './new-reservation-page.component.html',
  styleUrl: './new-reservation-page.component.css',
})
export class NewReservationPageComponent {
  roomId: string = '';
  room!: Room;

  dateBegin: string | null = null; // Initialize with null or some date value
  beginMinDate: string = '';
  dateEnd: string | null = null; // Initialize with null or some date value
  endMinDate: string = '';
  beginMaxDate: string = '';
  observations: string = '';
  occupants: { name: string; age: number }[] = [];
  giftCards!: GiftCard[] | undefined;
  selectedGiftCard?: GiftCard;

  newOccupantName: string = '';
  newOccupantAge: number = 0;

  currentUser: any = localStorage.getItem('currentUser');
  currentUserDecoded: any = jwtDecode(this.currentUser);
  userId = this.currentUserDecoded.id;
  customer!: Customer;
  errorMessage!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService,
    private customerService: CustomerService,
    private reservationService: ReservationService
  ) {
    const today = new Date();
    this.beginMinDate = today.toISOString().split('T')[0];

    customerService.getCustomer(this.userId).subscribe({
      next: (data) => {
        this.customer = data;
        this.giftCards = this.customer.giftCards;
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }

  onBeginDateChange(newBeginDate: string) {
    this.dateBegin = newBeginDate;
    if (this.dateBegin) {
      const beginDate = new Date(this.dateBegin);
      beginDate.setDate(beginDate.getDate() + 1);
      this.endMinDate = beginDate.toISOString().split('T')[0];
    } else {
      this.endMinDate = '';
    }
  }

  onEndDateChange(newEndDate: string) {
    this.dateEnd = newEndDate;

    if (this.dateEnd) {
      const endDate = new Date(this.dateEnd);
      this.beginMaxDate = endDate.toISOString().split('T')[0];
    } else {
      this.beginMaxDate = '';
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.roomId = params['roomId'];
      if (this.roomId) {
        this.fetchRoomDetails(this.roomId);
      }
    });
  }

  fetchRoomDetails(roomId: string) {
    this.roomService.getRoomById(roomId).subscribe(
      (room: Room) => {
        this.room = room;
      },
      (error) => {
        console.error('Error fetching room details', error);
      }
    );
  }

  addNewOccupant(name: string, age: number) {
    if (this.room && name.trim() && age !== null) {
      const countedOccupants = this.occupants.filter(
        (occupant) => occupant.age > 3
      ).length;

      if (age > 3 && countedOccupants >= this.room.capacity) {
        alert(
          'Room capacity reached! Only occupants older than 3 years count towards the capacity.'
        );
      } else {
        this.occupants.push({ name, age });
      }
    } else {
      alert('Please enter a valid name and age for the occupant.');
    }
  }

  removeOccupant(index: number) {
    this.occupants.splice(index, 1);
  }

  get countedOccupants(): number {
    return this.occupants.filter(o => o.age > 3).length;
  }

  submitReservation() {
    if (!this.room || !this.dateBegin || !this.dateEnd) {
      alert('Please fill in all required fields.');
      return;
    }

    const reservation: Reservation = {
      _id: '',
      observations: this.observations,
      room: this.room,
      dateBegin: new Date(this.dateBegin),
      dateEnd: new Date(this.dateEnd),
      occupants: this.occupants,
      customer: this.customer,
      giftCard: this.selectedGiftCard,
      dailyPrice: this.room.dailyPrice,
      state: 'Pending',
    };

    this.reservationService.submitReservation(reservation).subscribe(
      (response) => {
        console.log('Reservation submitted successfully', response);

        if (this.room && this.room._id) {
          this.roomService.updateRoomVacancy(this.room._id, false).subscribe(
            (updatedRoom) => {
              console.log('Room vacancy updated successfully', updatedRoom);
            },
            (error) => {
              console.error('Error updating room vacancy', error);
            }
          );
        }

        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error submitting reservation', error);
      }
    );
  }
}
