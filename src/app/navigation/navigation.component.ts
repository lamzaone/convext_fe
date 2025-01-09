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
    let handleClickOutside: (event: Event) => void;

    effect(() => {
      if (typeof document === 'undefined') return;

      const dropdown = document.querySelector('.dropdown') as HTMLElement | null;
      const userinfo = document.querySelector('.user-info') as HTMLElement | null;

      if (this.userDropdown() && dropdown && userinfo) {
        // Set height to match dropdown items count (2rem per item)
        dropdown.style.height = `${2 * document.querySelectorAll('.dropdown-item').length}rem`;

        // Define the event listener if not already defined
        handleClickOutside = handleClickOutside || ((event: Event) => {
          if (
            !dropdown.contains(event.target as Node) &&
            !userinfo.contains(event.target as Node)
          ) {
            this.userDropdown.set(false);
          }
        });

        // Add the event listener
        document.addEventListener('click', handleClickOutside);
      } else if (dropdown) {
        // Set height to 0 to hide the dropdown
        dropdown.style.height = '0rem';

        // Remove the event listener
        if (handleClickOutside) {
          document.removeEventListener('click', handleClickOutside);
        }
      }
    });
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
