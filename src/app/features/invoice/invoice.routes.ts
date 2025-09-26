import {Routes} from '@angular/router';
import {InvoicePageComponent} from './pages/invoice-page/invoice-page.component';

export const INVOICE_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/invoice-page/invoice-page.component').then((c) => c.InvoicePageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/invoice-page/invoice-page.component').then((c) => c.InvoicePageComponent),
  }
];
