import {Routes} from '@angular/router';
import {provideFormlyCore} from '@ngx-formly/core';
import {withFormlyPrimeNG} from '@ngx-formly/primeng';
import {
  PanelFieldWrapperComponent
} from './components/panel-field-wrapper/panel-field-wrapper.component';
import {RepeatTableTypeComponent} from './components/repeat-table-type/repeat-table-type.component';

export const DYNFORM_ROUTE: Routes = [
  {
    path: '',
    providers: [
      provideFormlyCore([
        ...withFormlyPrimeNG(),
        {
          validationMessages: [
            {name: 'required', message: 'This field is required'},
          ],
          wrappers: [
            {name: 'panel', component: PanelFieldWrapperComponent},
          ],
          types: [
            {
              name: 'repeat-table',
              component: RepeatTableTypeComponent,
            },
          ],
        },
      ]),
    ],
    loadComponent: () => import('./pages/form-one/form-one.component').then((c) => c.FormOneComponent),
  }
];
