import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/pages/home-page/home-page.component').then((c) => c.HomePageComponent),
      },
      {
        path: 'user',
        loadComponent: () => import('./features/user/pages/user-page/user-page.component').then((c) => c.UserPageComponent),
      },

      { path: '**', redirectTo: '/home' },
    ],
  },
];
