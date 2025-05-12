import { FormlyFieldConfig } from '@ngx-formly/core';

export interface FormlyFieldWithLogic extends FormlyFieldConfig {
  'x-jsonLogic-visibility'?: any;
  'x-jsonLogic-constraint'?: any;
}
