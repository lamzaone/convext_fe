import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthComponent } from './homepage/auth/auth.component';
import { AboutComponent } from './about/about.component';
import { MyfilesComponent } from './myfiles/myfiles.component';
import { Component } from '@angular/core';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomepageComponent,
  },
  {
    path: 'auth/callback',
    component: AuthComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'myfiles',
    component: MyfilesComponent
  },
  { path: '**',
    redirectTo: '' // TODO: Redirect to 404 page
  },
];
