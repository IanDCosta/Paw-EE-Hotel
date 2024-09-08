import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { Room } from '../../../shared/models/room';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css'
})
export class RoomPageComponent {
  room!: Room;
  constructor(activatedRoute:ActivatedRoute, roomService:RoomService){
    activatedRoute.params.subscribe((params) => {
      if(params.id){
        this.room = roomService.getRoomById(params.id);
      }
    })
  }
}
