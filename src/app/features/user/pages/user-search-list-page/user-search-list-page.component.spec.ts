import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchListPageComponent } from './user-search-list-page.component';

describe('UserSearchListPageComponent', () => {
  let component: UserSearchListPageComponent;
  let fixture: ComponentFixture<UserSearchListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSearchListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
