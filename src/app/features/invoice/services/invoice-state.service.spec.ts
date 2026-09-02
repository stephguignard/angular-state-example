import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { InvoiceStateService } from './invoice-state.service';

describe('InvoiceStateService', () => {
  let service: InvoiceStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), InvoiceStateService],
    });
    service = TestBed.inject(InvoiceStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
