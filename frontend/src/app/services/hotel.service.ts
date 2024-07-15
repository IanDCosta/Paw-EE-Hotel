import { Injectable } from '@angular/core';
import { Hotel } from '../shared/models/hotel';
import { sample_hotels } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor() { }

  getAll():Hotel[]{
    return sample_hotels;
  }

  getAllHotelsBySearchTerm(searchTerm:string){
    return this.getAll().filter(hotel => hotel.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  getHotelById(hotelId:string):Hotel{
    return this.getAll().find(hotel => hotel._id == hotelId) ?? new Hotel();
  }
}
