export type Currency = 'CHF' | 'EUR' | 'USD';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED' | 'OVERDUE';


export interface Invoice {
  id: number;
  number: string; // human-friendly invoice no (e.g., INV-2025-0001)
  customerName: string;
  issueDate: string; // ISO
  dueDate: string; // ISO
  paidDate?: string | null; // ISO
  status: InvoiceStatus;
  currency: Currency;
  amount: number; // total gross
  createdAt: string; // ISO
  updatedAt: string; // ISO
}


export type CreateInvoice = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'paidDate'> & { paidDate?: string | null };
export type UpdateInvoice = Partial<Omit<Invoice, 'createdAt' | 'updatedAt'>> & { id: number };


export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
