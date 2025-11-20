import { FormlyFieldConfig } from '@ngx-formly/core';

export interface FormlyFieldWithLogic extends FormlyFieldConfig {
  'x-jsonLogic-visibility'?: any;
  'x-jsonLogic-validator'?: any;

  // très important : on ouvre le type pour accepter des props custom
  [key: string]: any;
}
