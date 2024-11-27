import { Injectable, signal } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  currentUser = signal<any>(null);

  // DUMMY USER DATA //

  user={
    displayName: "Guest",
    email: "guest@localhost",
  }
  constructor() {
    this.currentUser.set(this.user);
  }


}

