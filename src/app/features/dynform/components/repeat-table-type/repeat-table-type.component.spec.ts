import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatTableTypeComponent } from './repeat-table-type.component';

describe('RepeatTableTypeComponent', () => {
  let component: RepeatTableTypeComponent;
  let fixture: ComponentFixture<RepeatTableTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepeatTableTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatTableTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
