import {Routes} from '@angular/router';

export const CVA_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cva-page/cva-page.component').then((c) => c.CvaPageComponent),
  },
];
