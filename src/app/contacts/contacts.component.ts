import { Component, OnInit } from '@angular/core';

import { Contact } from '../model/contact.model';
import { ContactService } from './contact.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[];

  get connectionStatus() {
    return this.contactService.online? "Online" : "Offline";
  }

  constructor(private contactService: ContactService)
  {}

  getContacts(): void {
    this.contactService.getContacts()
      .subscribe(contacts => this.contacts = contacts)
  }

  ngOnInit() {
    this.getContacts();
  }

}
