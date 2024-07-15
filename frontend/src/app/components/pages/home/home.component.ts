import { Component } from '@angular/core';
import { Hotel } from '../../../shared/models/hotel';
import { HotelService } from '../../../services/hotel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  
  hotels: Hotel[] = [];

  constructor(private hotelService: HotelService, activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.hotels = this.hotelService.getAllHotelsBySearchTerm(params.searchTerm);
      } else {
        this.hotels = hotelService.getAll();
      }
    });
    this.hotels = hotelService.getAll();
  }
}
