import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateInvoice, Invoice, InvoiceStatus, Page, UpdateInvoice} from '../models/invoice.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRepositoryService {

  constructor() { }

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/invoices';


  list(params: { page: number; pageSize: number; q?: string | null; status?: InvoiceStatus | null; year?: number | null }): Observable<Page<Invoice>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('pageSize', String(params.pageSize));
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.year != null) httpParams = httpParams.set('year', String(params.year));


    return this.http.get<Page<Invoice>>(this.baseUrl, { params: httpParams });
  }


  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }


  create(payload: CreateInvoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, payload);
  }


  update(payload: UpdateInvoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/${payload.id}`, payload);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
