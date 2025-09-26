import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {InvoiceStatus} from '../models/invoice.model';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class InvoiceStateService {
  // URL-backed
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly q = signal<string | null>(null);
  readonly status = signal<InvoiceStatus | null>(null);
  readonly year = signal<number | null>(null);
  readonly selectedId = signal<number | null>(null);


  readonly query = computed(() => ({
    page: this.page(),
    pageSize: this.pageSize(),
    q: this.q(),
    status: this.status(),
    year: this.year(),
  }));


  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);


  constructor() {
// Pull from URL
    const qp = this.route.snapshot.queryParamMap;
    const page = Number(qp.get('page') ?? '1');
    const pageSize = Number(qp.get('pageSize') ?? '10');
    const q = qp.get('q');
    const status = qp.get('status') as InvoiceStatus | null;
    const yearStr = qp.get('year');


    this.page.set(Number.isFinite(page) && page > 0 ? page : 1);
    this.pageSize.set(Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10);
    this.q.set(q && q.trim() !== '' ? q : null);
    this.status.set(status && ['DRAFT','SENT','PAID','CANCELLED','OVERDUE'].includes(status) ? status : null);
    this.year.set(yearStr ? Number(yearStr) : null);


    const idParam = this.route.snapshot.paramMap.get('id');
    this.selectedId.set(idParam ? Number(idParam) : null);


// Keep URL in sync
    effect(() => {
      const { page, pageSize, q, status, year } = this.query();
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page,
          pageSize,
          q: q ?? undefined,
          status: status ?? undefined,
          year: year ?? undefined,
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }


// mutations
  setPage(p: number) { this.page.set(Math.max(1, p)); }
  setPageSize(ps: number) { this.pageSize.set(Math.max(1, ps)); }
  setQuery(v: string | null) { this.q.set(v && v.trim() !== '' ? v : null); this.setPage(1); }
  setStatus(s: InvoiceStatus | null) { this.status.set(s); this.setPage(1); }
  setYear(y: number | null) { this.year.set(y); this.setPage(1); }
  selectId(id: number | null) { this.selectedId.set(id); }
}
