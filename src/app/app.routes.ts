import { Routes } from '@angular/router';
import { AppComponent } from '..';

export const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
