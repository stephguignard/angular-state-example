import {Routes} from '@angular/router';

export const TODO_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/todo-search-list-page/todo-search-list-page.component').then((c) => c.TodoSearchListPageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/todo-detail-page/todo-detail-page.component').then((c) => c.TodoDetailPageComponent),
  }
];
