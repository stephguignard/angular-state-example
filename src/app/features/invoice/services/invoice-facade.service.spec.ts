import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { InvoiceFacadeService } from './invoice-facade.service';
import { InvoiceStateService } from './invoice-state.service';

describe('InvoiceFacadeService', () => {
  let service: InvoiceFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), InvoiceStateService, InvoiceFacadeService],
    });
    service = TestBed.inject(InvoiceFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
