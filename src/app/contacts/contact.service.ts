import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs'
import { Contact } from '../model/contact.model';
import { AuthManager } from '../auth/auth.manager';
import { catchError } from "rxjs/internal/operators";
import { ConnectionService } from '../web/connection.service';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactUrl = 'api/contacts';
  public online: boolean;

  constructor(
    private authManager: AuthManager,
    private http: HttpClient,
    private connectionService: ConnectionService
  ) {
    this.registerConnectionEvents();
    this.online = connectionService.isOnline;
  }

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

  private registerConnectionEvents() {
    this.connectionService.connectionChanged.subscribe(online => {
      if(online) {
        console.log('online');
      }
      else {
        console.log('offline');
      }
      this.online = online;
    })
  }

}
