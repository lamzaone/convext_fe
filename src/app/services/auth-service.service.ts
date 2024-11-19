import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  currentUser: {} | null = null;



  constructor() {
    this.initialize();
  }

  // TODO: Continue this implementation
  async initialize() {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/google-auth/', { headers: { Authorization: `Bearer ${token}` } });
    }
  }
}

