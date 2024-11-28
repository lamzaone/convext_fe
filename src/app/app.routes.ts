import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthComponent } from './homepage/auth/auth.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // {
  //   path: 'home',
  //   component: HomepageComponent,
  // }
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'auth/callback',
    component: AuthComponent
  },
  { path: '**',
    redirectTo: '' // TODO: Redirect to 404 page
  },
];
