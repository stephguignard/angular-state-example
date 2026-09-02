import { TestBed } from '@angular/core/testing';

import { UserDetailStateService } from './user-detail-state.service';

describe('UserDetailStateService', () => {
  let service: UserDetailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDetailStateService],
    });
    service = TestBed.inject(UserDetailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
