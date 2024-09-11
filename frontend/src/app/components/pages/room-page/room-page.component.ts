import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { Room } from '../../../shared/models/room';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css',
})
export class RoomPageComponent {
  roomWithImage!: { room: Room; imageData: string };
  errorMessage!: string;

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    private roomService: RoomService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.roomService.getRoomById(params.id).subscribe({
          next: (data: Room) => {
            this.fetchImage(data);
          },
          error: (error) => {
            this.errorMessage = error;
          },
        });
      }
    });
  }

  fetchImage(room: Room): void {
    this.roomService
      .getImage(room.photoName as string)
      .pipe(
        catchError((error) => {
          console.error(`Error fetching image ${room.photoName}:`, error);
          return of(null); // Return null if there is an error
        })
      )
      .subscribe({
        next: (blob: Blob | null) => {
          if (blob) {
            this.createImageFromBlob(blob, room);
          }
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  createImageFromBlob(image: Blob, room: Room): void {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.roomWithImage = { room, imageData: reader.result as string };
      },
      false
    );

    reader.addEventListener('error', () => {
      console.error('Error reading image file');
    });

    if (image) {
      reader.readAsDataURL(image);
    } else {
      console.error('Received null image');
    }
  }

  navigateToReservation() {
    this.router.navigate(['/newReservation'], {
      queryParams: {
        roomId: this.roomWithImage.room._id
      },
    });
  }
}