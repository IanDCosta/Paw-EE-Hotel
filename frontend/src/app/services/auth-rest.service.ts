import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Customer } from '../shared/models/customer';

const endpoint = 'http://localhost:3000/api/auth/' //acho q ta certo, conexao com backend

const httpOptions ={
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthRestService {

  constructor(private http:HttpClient) {}

  login(email: string, password:string): Observable<AuthRestModelResponse>{
    return this.http.post<AuthRestModelResponse>(endpoint+"login", new LoginModel(email, password)).pipe(
      catchError(this.handleError)
    );;
  }
  
  logout() {
    localStorage.removeItem('currentUser');
  }

  registerUser(email: string, password: string, name: string, contact: string, address: string) :  Observable<AuthRestModelResponse>{
      return this.http.post<any>('http://localhost:3000/api/auth/registerCustomer', new Customer(email, password, name, contact, address)).pipe(
        catchError(this.handleError) //consertar esse path
      );
  }

private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Unknown error!';
  if (error.error instanceof ErrorEvent) {
    // Client-side errors
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // Server-side errors
    errorMessage = error.error.errorMessage || error.error.error || 'Server error';
  }
  return throwError(errorMessage);
}
}



export interface AuthRestModelResponse{

}

export class LoginModel{

  constructor(public email:string, public password:string){}

}

