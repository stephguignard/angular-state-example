import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';

import { FormOneComponent } from './form-one.component';
import { PanelFieldWrapperComponent } from '../../components/panel-field-wrapper/panel-field-wrapper.component';
import { RepeatTableTypeComponent } from '../../components/repeat-table-type/repeat-table-type.component';

describe('FormOneComponent', () => {
  let component: FormOneComponent;
  let fixture: ComponentFixture<FormOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOneComponent],
      providers: [
        provideFormlyCore([
          ...withFormlyPrimeNG(),
          {
            validationMessages: [{ name: 'required', message: 'This field is required' }],
            wrappers: [{ name: 'panel', component: PanelFieldWrapperComponent }],
            types: [{ name: 'repeat-table', component: RepeatTableTypeComponent }],
          },
        ]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
