import { Component, effect, signal} from '@angular/core';
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
  userDropdown = signal(false);

  constructor(private authService: AuthServiceService) {
    // Effect to change the visibility of the dropdown on userDropdown signal change
    // Tried a few other ways using .toggle but failed to get it to work so i guess this works
    effect(() =>
        {
          if (typeof(document) === 'undefined') return;
          if (this.userDropdown()){
            document.querySelector('.dropdown')?.classList.remove('hidden');
          }
          else {
            document.querySelector('.dropdown')?.classList.add('hidden');
          }
        }
    );
  }

  ngOnInit() {
    this.currentUser = this.authService.userData;
  }

  logout(){
    this.authService.logout();
  }

  loginWithGoogle(){
    this.authService.loginWithGoogle();
  }

  toggleDropdown() {
    this.userDropdown.update(value => !value);
  }




}
