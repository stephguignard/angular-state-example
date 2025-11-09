import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvaPageComponent } from './cva-page.component';

describe('CvaPageComponent', () => {
  let component: CvaPageComponent;
  let fixture: ComponentFixture<CvaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
