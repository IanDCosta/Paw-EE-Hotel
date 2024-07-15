import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { Hotel } from '../../../shared/models/hotel';

@Component({
  selector: 'app-hotel-page',
  templateUrl: './hotel-page.component.html',
  styleUrl: './hotel-page.component.css'
})
export class HotelPageComponent {
  hotel!: Hotel;
  constructor(activatedRoute:ActivatedRoute, hotelService:HotelService){
    activatedRoute.params.subscribe((params) => {
      if(params.id){
        this.hotel = hotelService.getHotelById(params.id);
      }
    })
  }
}
