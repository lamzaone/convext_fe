import { Component, Signal} from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { Router, RouterLinkActive, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  currentUser: any;

  constructor(private authService: AuthServiceService) { }
  ngOnInit() {
    this.currentUser = this.authService.userData;
  }

  logout(){
    this.authService.logout();
  }

  loginWithGoogle(){
    this.authService.loginWithGoogle();
  }


}
