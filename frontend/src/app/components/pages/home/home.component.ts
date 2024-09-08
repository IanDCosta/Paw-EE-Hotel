import { Component } from '@angular/core';
import { Room } from '../../../shared/models/room';
import { RoomService } from '../../../services/room.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  
  rooms: Room[] = [];

  constructor(private roomService: RoomService, activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.rooms = this.roomService.getAllRoomsBySearchTerm(params.searchTerm);
      } else {
        this.rooms = roomService.getAll();
      }
    });
    this.rooms = roomService.getAll();
  }
}
