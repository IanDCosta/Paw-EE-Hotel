import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Customer } from '../shared/models/customer';
import { sample_customers } from '../../data';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const endpoint = 'http://localhost:3000/api/users/'; //consertar isso

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(endpoint + 'customers/' + id).pipe(
      catchError(this.handleError)
    )
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
  /* private customerSubject = new BehaviorSubject<Customer>(new Customer());
  public customerObservable:Observable<Customer>;
  constructor() {
    this.customerObservable = this.customerSubject.asObservable();
  }

  login(customerLogin:IUserLogin):Observable<Customer>{
    
  } */

  /* getAll():Customer[]{
    return sample_customers;
  }

  getCustomerById(customerId:string):Customer{
    return this.getAll().find(customer => customer._id == customerId) ?? new Customer();
  } */
}
