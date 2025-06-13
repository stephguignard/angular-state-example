import { TestBed } from '@angular/core/testing';

import { UserSearchRxResourceStateService } from './user-search-rx-resource-state.service';

describe('UserSearchRxResourceStateService', () => {
  let service: UserSearchRxResourceStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSearchRxResourceStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
