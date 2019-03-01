import { Injectable } from '@angular/core';
import  Dexie  from 'dexie';
import { Contact } from '../model/contact.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private db: any;

  constructor() {
    this.createDatabase();
  }

  private  createDatabase() {
    this.db = new Dexie('Nexus');
    this.db.version(1).stores({
        contacts: 'id'
    });
  }

  public getContacts(): any {
    return this.db.contacts.toArray();
  }

  public addContacts(contacts): void {
    this.db.contacts.bulkAdd(contacts)
  }

  public  clearContacts(): Promise<Contact[]> {
    return this.db.contacts.clear();
  }

}
