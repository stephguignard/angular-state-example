import {Component, computed, inject} from '@angular/core';
import {InvoiceFacadeService} from '../../services/invoice-facade.service';
import {Invoice, InvoiceStatus} from '../../models/invoice.model';
import {
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {InvoiceStateService} from '../../services/invoice-state.service';

@Component({
  selector: 'app-invoice-page',
  imports: [
    CurrencyPipe,
    NgSwitch,
    RouterLink,
    FormsModule,
    JsonPipe,
    DatePipe,
    NgIf,
    NgSwitchDefault,
    NgSwitchCase,
    NgForOf
  ],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.scss',
  providers: [InvoiceFacadeService,InvoiceStateService],
})
export class InvoicePageComponent {
  readonly facade = inject(InvoiceFacadeService);
  readonly state = this.facade.state;


  searchText = this.state.q() ?? '';
  statuses: InvoiceStatus[] = ['DRAFT','SENT','PAID','CANCELLED','OVERDUE'];
  status: InvoiceStatus | null = this.state.status();
  yearInput: number | null = this.state.year();


  readonly detailVisible = computed(() => this.state.selectedId() != null);


  prev() { this.state.setPage(this.state.page() - 1); }
  next() { this.state.setPage(this.state.page() + 1); }
  onSearch(v: string) { this.state.setQuery(v ?? null); }
  onStatus(s: InvoiceStatus | null) { this.state.setStatus(s); }
  onYear(y: number | null) { this.state.setYear(y ? Number(y) : null); }


  newInvoice() {
    this.facade.create({
      number: 'INV-2025-1234',
      customerName: 'ACME SA',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 1000*60*60*24*30).toISOString(),
      status: 'DRAFT',
      currency: 'CHF',
      amount: 1200,
    });
  }
  edit(id: number) { this.facade.selectId(id); }
  remove(inv: Invoice) {
    if (!confirm(`Delete invoice ${inv.number}?`)) return;
    this.facade.remove(inv);
  }
}
