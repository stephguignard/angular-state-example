import { Component, computed, inject, signal } from '@angular/core';
import { InvoiceFacadeService } from '../../services/invoice-facade.service';
import { Invoice, InvoiceStatus, UpdateInvoice } from '../../models/invoice.model';
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
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';

/**
 * Composant de page des factures:
 * - Liste, filtres, pagination
 * - Edition d'une invoice via un panneau PrimeNG style Tailwind
 */
@Component({
  selector: 'app-invoice-page',
  standalone: true,
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
    NgForOf,
    DatePicker,
    SelectModule
  ],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.scss',
  providers: [InvoiceFacadeService],
})
export class InvoicePageComponent {
  readonly facade = inject(InvoiceFacadeService);
  readonly state = this.facade.state;

  // Filtres
  searchText = this.state.q() ?? '';
  statuses: InvoiceStatus[] = ['DRAFT','SENT','PAID','CANCELLED','OVERDUE'];
  status: InvoiceStatus | null = this.state.status();
  yearInput: number | null = this.state.year();

  // Détail visible quand un id est sélectionné
  readonly detailVisible = computed(() => this.state.selectedId() != null);

  // Formulaire d'édition
  // On stocke Date pour les datepickers, conversion ISO au save
  editing = signal<boolean>(false);
  form = signal<UpdateInvoice & {
    issueDateObj?: Date | null;
    dueDateObj?: Date | null;
    paidDateObj?: Date | null;
  }>({
    id: 0,
    number: '',
    customerName: '',
    issueDate: '',
    dueDate: '',
    paidDate: null,
    status: 'DRAFT',
    currency: 'CHF',
    amount: 0,
    issueDateObj: null,
    dueDateObj: null,
    paidDateObj: null
  });

  // Navigation / filtres
  prev() { this.state.setPage(this.state.page() - 1); }
  next() { this.state.setPage(this.state.page() + 1); }
  onSearch(v: string) { this.state.setQuery(v ?? null); }
  onStatus(s: InvoiceStatus | null) { this.state.setStatus(s); }
  onYear(y: number | null) { this.state.setYear(y ? Number(y) : null); }

  // Création rapide
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

  // Sélection via la liste (affiche détail)
  edit(id: number) {
    // // Passage en mode édition avec les données de détail si déjà chargées,
    // // sinon on déclenche la sélection et attend la valeur.
    // this.facade.selectId(id);
    // const cur = this.facade.detailRes.value();
    // if (cur && cur.id === id) {
    //   this.openEdit(cur);
    // } else {
    //   // Abonnement one-shot: on attend que le détail arrive puis on ouvre l'édition
    //   const sub = this.facade.detailRes.select(v => !!v).subscribe(() => {
    //     const data = this.facade.detailRes.value();
    //     if (data && data.id === id) {
    //       this.openEdit(data);
    //       sub.unsubscribe();
    //     }
    //   });
    // }
  }

  // Ouverture de l'éditeur avec mapping Date
  private openEdit(inv: Invoice) {
    this.editing.set(true);
    this.form.set({
      id: inv.id,
      number: inv.number,
      customerName: inv.customerName,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      paidDate: inv.paidDate ?? null,
      status: inv.status,
      currency: inv.currency,
      amount: inv.amount,
      issueDateObj: inv.issueDate ? new Date(inv.issueDate) : null,
      dueDateObj: inv.dueDate ? new Date(inv.dueDate) : null,
      paidDateObj: inv.paidDate ? new Date(inv.paidDate) : null,
    });
  }

  // Annuler l'édition
  cancelEdit() {
    this.editing.set(false);
  }

  // Sauvegarder l'édition
  save() {
    const val = this.form();
    if (!val.id) return;

    const updated: UpdateInvoice = {
      id: val.id,
      number: val.number,
      customerName: val.customerName,
      issueDate: val.issueDateObj ? toIsoDate(val.issueDateObj) : val.issueDate,
      dueDate: val.dueDateObj ? toIsoDate(val.dueDateObj) : val.dueDate,
      paidDate: val.paidDateObj ? toIsoDate(val.paidDateObj) : null,
      status: val.status,
      currency: val.currency,
      amount: Number(val.amount ?? 0),
    };

    this.facade.update(updated);
    this.editing.set(false);
    this.facade.listRes.reload();
  }

  // Helpers pour binding
  updateField<K extends keyof ReturnType<typeof this.form>>(key: K, value: ReturnType<typeof this.form>[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
  }
}

// Util: format ISO yyyy-MM-ddTHH:mm:ss.sssZ (à partir d'un Date local)
function toIsoDate(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
