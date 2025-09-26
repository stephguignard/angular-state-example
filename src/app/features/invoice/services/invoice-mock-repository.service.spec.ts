import { TestBed } from '@angular/core/testing';

import { InvoiceMockRepositoryService } from './invoice-mock-repository.service';

describe('InvoiceMockRepositoryService', () => {
  let service: InvoiceMockRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceMockRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
