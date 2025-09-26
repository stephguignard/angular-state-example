import { Injectable } from '@angular/core';
import {delay, Observable, of, throwError} from 'rxjs';
import {CreateInvoice, Invoice, InvoiceStatus, Page, UpdateInvoice} from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceMockRepositoryService {
  private invoices: Invoice[] = [
    {
      id: 1,
      number: 'INV-2025-0001',
      customerName: 'ACME SA',
      issueDate: '2025-01-10',
      dueDate: '2025-02-10',
      status: 'SENT',
      currency: 'CHF',
      amount: 1200,
      createdAt: '2025-01-10T12:00:00Z',
      updatedAt: '2025-01-10T12:00:00Z',
    },
    {
      id: 2,
      number: 'INV-2025-0002',
      customerName: 'Globex SARL',
      issueDate: '2025-02-15',
      dueDate: '2025-03-15',
      status: 'PAID',
      currency: 'EUR',
      amount: 890,
      createdAt: '2025-02-15T10:00:00Z',
      updatedAt: '2025-02-20T09:00:00Z',
      paidDate: '2025-02-20',
    },
  ];

  private idSeq = this.invoices.length + 1;

  constructor() {}

  list(params: {
    page: number;
    pageSize: number;
    q?: string | null;
    status?: InvoiceStatus | null;
    year?: number | null;
  }): Observable<Page<Invoice>> {
    let items = [...this.invoices];

    if (params.q) {
      const qLower = params.q.toLowerCase();
      items = items.filter(
        (inv) =>
          inv.customerName.toLowerCase().includes(qLower) ||
          inv.number.toLowerCase().includes(qLower)
      );
    }
    if (params.status) {
      items = items.filter((inv) => inv.status === params.status);
    }
    if (params.year) {
      items = items.filter(
        (inv) => new Date(inv.issueDate).getFullYear() === params.year
      );
    }

    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return of({
      items: paged,
      total: items.length,
      page: params.page,
      pageSize: params.pageSize,
    }).pipe(delay(300)); // simulate latency
  }

  getById(id: number): Observable<Invoice> {
    const found = this.invoices.find((i) => i.id === id);
    return found
      ? of(found).pipe(delay(200))
      : throwError(() => new Error(`Invoice ${id} not found`));
  }

  create(payload: CreateInvoice): Observable<Invoice> {
    const inv: Invoice = {
      ...payload,
      id: this.idSeq++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.push(inv);
    return of(inv).pipe(delay(200));
  }

  update(payload: UpdateInvoice): Observable<Invoice> {
    const idx = this.invoices.findIndex((i) => i.id === payload.id);
    if (idx === -1) return throwError(() => new Error(`Invoice not found`));

    const updated: Invoice = {
      ...this.invoices[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    this.invoices[idx] = updated;
    return of(updated).pipe(delay(200));
  }

  delete(id: number): Observable<void> {
    const idx = this.invoices.findIndex((i) => i.id === id);
    if (idx === -1) return throwError(() => new Error(`Invoice not found`));

    this.invoices.splice(idx, 1);
    return of(void 0).pipe(delay(200));
  }
}
