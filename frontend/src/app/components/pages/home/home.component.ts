import { Component } from '@angular/core';
import { Room } from '../../../shared/models/room';
import { RoomService } from '../../../services/room.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  
  roomsWithImages: {room: Room, imageData: string }[] = [];
  errorMessage!: string;

  constructor(private roomService: RoomService, activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        /* this.roomService.getAll().subscribe({
          next: (data: Room[]) => {
            this.roomsWithImages = data.filter(room => room.typology.toLowerCase().includes(params.searchTerm.toLowerCase()));
          },
          error: (error) => {
            this.errorMessage = error;
          }
        }); */
        this.roomService.getAll().subscribe({
          next: (data: Room[]) => {
            this.fetchImages(data.filter(room => room.typology.toLowerCase().includes(params.searchTerm.toLowerCase())));
          },
          error: err => this.errorMessage = err
        });
      } else {
        /* this.roomService.getAll().subscribe({
          next: (data: Room[]) => {
            this.roomsWithImages = data;
          },
          error: (error) => {
            this.errorMessage = error;
          }
        }); */
        this.roomService.getAll().subscribe({
          next: (data: Room[]) => {
            this.fetchImages(data);
          },
          error: err => this.errorMessage = err
        });
      }
    });
  }

  ngOnInit(): void {}

  fetchImages(rooms: Room[]): void {
    const imageObservables = rooms.map(room =>
      this.roomService.getImage(room.photoName as string).pipe(
        catchError(error => {
          console.error(`Error fetching image ${room.photoName}:`, error);
          return of(null); // Return null if there is an error
        })
      )
    );

    forkJoin(imageObservables).subscribe({
      next: (blobs: (Blob | null)[]) => {
        blobs.forEach((blob, index) => {
          if (blob) {
            this.createImageFromBlob(blob, rooms[index]);
          }
        });
      },
      error: err => this.errorMessage = err
    });
  }

  createImageFromBlob(image: Blob, room: Room): void {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.roomsWithImages.push({ room, imageData: reader.result as string });
    }, false);

    reader.addEventListener("error", () => {
      console.error("Error reading image file");
    });

    if (image) {
      reader.readAsDataURL(image);
    } else {
      console.error("Received null image");
    }
  }
}
