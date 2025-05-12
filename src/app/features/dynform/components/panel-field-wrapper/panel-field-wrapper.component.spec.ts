import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFieldWrapperComponent } from './panel-field-wrapper.component';

describe('PanelFieldWrapperComponent', () => {
  let component: PanelFieldWrapperComponent;
  let fixture: ComponentFixture<PanelFieldWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelFieldWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelFieldWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
