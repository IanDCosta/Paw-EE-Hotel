import { Injectable } from '@angular/core';
import { Room } from '../shared/models/room';
import { sample_rooms } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor() { }

  getAll():Room[]{
    return sample_rooms;
  }

  getAllRoomsBySearchTerm(searchTerm:string){
    return this.getAll().filter(room => room.typology.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  getRoomById(roomId:string):Room{
    return this.getAll().find(room => room._id == roomId) ?? new Room(666,"hellish",666,666,null);
  }
}
