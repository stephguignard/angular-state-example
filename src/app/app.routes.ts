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
      {
        path: 'todo',
        loadChildren: () => import('./features/todo/todo.routes').then((r) => r.TODO_ROUTE),
      },

      { path: '**', redirectTo: '/home' },
    ],
  },
];
