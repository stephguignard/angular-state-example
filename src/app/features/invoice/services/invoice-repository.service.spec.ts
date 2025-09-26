import { TestBed } from '@angular/core/testing';

import { InvoiceRepositoryService } from './invoice-repository.service';

describe('InvoiceRepositoryService', () => {
  let service: InvoiceRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
