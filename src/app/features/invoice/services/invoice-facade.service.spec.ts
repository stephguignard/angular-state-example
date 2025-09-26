import { TestBed } from '@angular/core/testing';

import { InvoiceFacadeService } from './invoice-facade.service';

describe('InvoiceFacadeService', () => {
  let service: InvoiceFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
