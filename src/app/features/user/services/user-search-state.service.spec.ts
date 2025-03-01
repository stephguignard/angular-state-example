import { TestBed } from '@angular/core/testing';

import { UserSearchStateService } from './user-search-state.service';

describe('UserSearchStateService', () => {
  let service: UserSearchStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSearchStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
