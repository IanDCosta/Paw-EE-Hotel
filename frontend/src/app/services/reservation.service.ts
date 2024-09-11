import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Reservation } from '../shared/models/reservation';

const endpoint = 'http://localhost:3000/api/reservations/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(endpoint + 'reservations/').pipe(
      catchError(this.handleError)
    )
  }

  getReservationById(reservationId:string):Observable<Reservation>{
    return this.http.get<Reservation>(endpoint + 'reservations/' + reservationId).pipe(
      catchError(this.handleError)
    );
  }

  getReservationByCustomer(customerId: string): Observable<Reservation[]> {
    return this.getAll().pipe(
      map((reservations: Reservation[]) =>
        reservations.filter(reservation => reservation.customer._id === customerId)
      ),
      catchError(this.handleError)
    );
  }

  submitReservation(reservation: Reservation): Observable<Reservation>{
    return this.http.post<Reservation>(endpoint + 'reservations/', reservation).pipe(
      catchError(this.handleError)
    )
  }

  deleteReservation(reservationId:string):Observable<Reservation>{
    return this.http.delete<Reservation>(endpoint + 'reservations/' + reservationId).pipe(
      catchError(this.handleError)
    );
  }

  updateReservationState(reservationId: string, state: string): Observable<Reservation> {
    return this.http.put<Reservation>(endpoint + 'reservations/' + reservationId, { state }, httpOptions)
      .pipe(
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
