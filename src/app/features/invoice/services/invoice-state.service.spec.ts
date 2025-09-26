import { TestBed } from '@angular/core/testing';

import { InvoiceStateService } from './invoice-state.service';

describe('InvoiceStateService', () => {
  let service: InvoiceStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
