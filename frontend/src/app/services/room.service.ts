import { Injectable } from '@angular/core';
import { Room } from '../shared/models/room';
import { sample_rooms } from '../../data';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const endpoint = 'http://localhost:3000/api/rooms/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Room[]>{
    return this.http.get<Room[]>(endpoint + 'rooms/').pipe(
      catchError(this.handleError)
    )
  }

  getRoomById(roomId:string):Observable<Room>{
    return this.http.get<Room>(endpoint + 'rooms/' + roomId).pipe(
      catchError(this.handleError)
    );
  }

  updateRoomVacancy(roomId: string, isVacant: boolean): Observable<Room> {
    return this.http.put<Room>(endpoint + 'rooms/' + roomId, { isVacant }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getImage(imageName: String): Observable<Blob> { //mudar path
    return this.http.get(endpoint + `rooms/images/${imageName}`, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage =
        error.error.errorMessage || error.error.error || 'Server error';
    }
    return throwError(errorMessage);
  }
}
