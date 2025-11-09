import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountCvaComponent } from './amount-cva.component';

describe('AmountCvaComponent', () => {
  let component: AmountCvaComponent;
  let fixture: ComponentFixture<AmountCvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountCvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmountCvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
