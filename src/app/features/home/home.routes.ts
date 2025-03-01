import {Routes} from '@angular/router';

export const HOME_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then((c) => c.HomePageComponent),
  }
];
