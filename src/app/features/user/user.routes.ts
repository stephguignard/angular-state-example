import {Routes} from '@angular/router';

export const USER_ROUTE: Routes = [
  {
    path: 'test',
    loadComponent: () => import('./pages/user-page/user-page.component').then((c) => c.UserPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./pages/user-search-list-page/user-search-list-page.component').then((c) => c.UserSearchListPageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/user-detail-page/user-detail-page.component').then((c) => c.UserDetailPageComponent),
  }
];
