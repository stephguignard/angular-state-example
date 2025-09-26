import {inject, Injectable} from '@angular/core';
import {InvoiceRepositoryService} from './invoice-repository.service';
import {InvoiceStateService} from './invoice-state.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {CreateInvoice, Invoice, UpdateInvoice} from '../models/invoice.model';
import {InvoiceMockRepositoryService} from './invoice-mock-repository.service';

@Injectable()
export class InvoiceFacadeService {
  private readonly repo = inject(InvoiceMockRepositoryService);
  readonly state = inject(InvoiceStateService);


// List (depends on URL-backed query)
  readonly listRes = rxResource({
    request: () => ({
      page: this.state.page(),
      pageSize: this.state.pageSize(),
      q: this.state.q(),
      status: this.state.status(),
      year: this.state.year(),
    }),
    loader: ({ request }) => this.repo.list(request),
  });


// Detail (depends on selectedId)
  readonly detailRes = rxResource({
    request: () => this.state.selectedId(),
    loader: ({ request }) => {
      const id = request;
      return id == null ? (null as any) : this.repo.getById(id);
    },
  });


// Actions
  selectId(id: number | null) { this.state.selectId(id); }


  create(dto: CreateInvoice) {
    this.repo.create(dto).subscribe({
      next: (created) => {
        this.listRes.reload();
        this.state.selectId(created.id);
        this.detailRes.reload();
      },
      error: (err) => console.error('create invoice failed', err),
    });
  }


  update(dto: UpdateInvoice) {
    this.repo.update(dto).subscribe({
      next: (updated) => {
        this.listRes.reload();
        this.state.selectId(updated.id);
        this.detailRes.reload();
      },
      error: (err) => console.error('update invoice failed', err),
    });
  }


  remove(inv: Invoice) {
    this.repo.delete(inv.id).subscribe({
      next: () => {
        this.listRes.reload();
        if (this.state.selectedId() === inv.id) this.state.selectId(null);
      },
      error: (err) => console.error('delete invoice failed', err),
    });
  }
}
