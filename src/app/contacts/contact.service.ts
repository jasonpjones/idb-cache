import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs'
import { Contact } from '../model/contact.model';
import { AuthManager } from '../auth/auth.manager';
import { catchError } from "rxjs/internal/operators";


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactUrl = 'api/contacts';

  constructor(
    private authManager: AuthManager,
    private http: HttpClient
  ) { }

  getUrl(): string {
    return `${this.authManager.getServer()}${this.contactUrl}`;
  }

  getContacts(): Observable<Contact[]> {
    return <Observable<Contact[]>>this.getContactsFromServer();
  }


  getContactsFromServer(): Observable<any> {
    const url = this.getUrl();
    return this.http
      .get<Contact[]>(url)
      .pipe(
        catchError(error => this.handleError(error)),
      );
  }

  private handleError(error: Error): Observable<Error> {
    console.log(error.message);
    return throwError(error);
  }

}
