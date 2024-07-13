import { Component } from '@angular/core';
import { Hotel } from '../../../shared/models/Hotel';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  hotels:Hotel[] = [];
  constructor(private hotelService:HotelService) {
    /* this.hotels = hotelService.getAll() */
  }

}
