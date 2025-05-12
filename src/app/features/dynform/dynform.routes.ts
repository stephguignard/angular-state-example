import {Routes} from '@angular/router';

export const DYNFORM_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/form-one/form-one.component').then((c) => c.FormOneComponent),
  }
];
