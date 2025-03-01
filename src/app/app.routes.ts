import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then(r => r.HOME_ROUTE),
      },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then((r) => r.USER_ROUTE),
      },

      { path: '**', redirectTo: '/home' },
    ],
  },
];
