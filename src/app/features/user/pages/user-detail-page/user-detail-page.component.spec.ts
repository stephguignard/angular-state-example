import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { UserDetailPageComponent } from './user-detail-page.component';

describe('UserDetailPageComponent', () => {
  let component: UserDetailPageComponent;
  let fixture: ComponentFixture<UserDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailPageComponent],
      providers: [
        provideRouter([]),
        // The template binds [formGroup]="userForm", which is only built once a
        // user is loaded — feed a real id so ngOnInit resolves one from the mock repo.
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
