import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { InvoicePageComponent } from './invoice-page.component';
import { InvoiceStateService } from '../../services/invoice-state.service';

describe('InvoicePageComponent', () => {
  let component: InvoicePageComponent;
  let fixture: ComponentFixture<InvoicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePageComponent],
      providers: [provideRouter([]), InvoiceStateService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
