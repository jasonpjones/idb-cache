import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of, Subject, throwError } from 'rxjs'
import { Contact } from '../model/contact.model';
import { AuthManager } from '../auth/auth.manager';
import { catchError, tap } from "rxjs/internal/operators";
import { ConnectionService } from '../web/connection.service';
import { CacheService } from '../cache/cache.service';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactUrl = 'api/contacts';
  public online: boolean;

  constructor(
    private authManager: AuthManager,
    private http: HttpClient,
    private connectionService: ConnectionService,
    private cacheService: CacheService
  ) {
    this.registerConnectionEvents();
    this.online = connectionService.isOnline;
  }

  getUrl(): string {
    return `${this.authManager.getServer()}${this.contactUrl}`;
  }

  getContacts(): Observable<Contact[]> {
    if(this.online) {
      return <Observable<Contact[]>>this.getContactsFromServer();
    }
    else {
      return <Observable<Contact[]>>from(this.cacheService.getContacts());
    }
  }

  getContactsFromServer(): Observable<any> {
    const url = this.getUrl();
    return this.http
      .get<Contact[]>(url)
      .pipe(
        tap((contacts) => {
          let subcons = contacts.slice(0,20);
          this.cacheService.clearContacts().then(() => {
            this.cacheService.addContacts(subcons);
          });
      }),
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
