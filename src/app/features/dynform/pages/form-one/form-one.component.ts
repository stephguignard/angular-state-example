import {Component} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { FormlyForm} from '@ngx-formly/core';
import {Button} from 'primeng/button';
import {JsonPipe} from '@angular/common';
import {PanelFieldWrapperComponent} from '../../components/panel-field-wrapper/panel-field-wrapper.component';
import {FormlyFieldWithLogic} from '../../utils/FormlyFieldWithLogic';
import jsonLogic from 'json-logic-js';

@Component({
  selector: 'app-form-one',
  imports: [
    ReactiveFormsModule, FormlyForm, Button, JsonPipe
  ],
  templateUrl: './form-one.component.html',
  styleUrl: './form-one.component.scss'
})
export class FormOneComponent {
  form = new FormGroup({});
  model = {};

  fields: FormlyFieldWithLogic[] = [
    {
      key: 'input',
      type: 'input',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        styleClass: 'mb-4',
        label: 'Input',
        placeholder: 'Input placeholder',
        required: true,
      },
    },
    {
      key: 'checkbox',
      type: 'checkbox',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        className: 'mb-4',
        label: 'Checkbox',
      },
    },
    {
      key: 'select',
      type: 'select',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        className: 'mb-4',
        label: 'Select',
        placeholder: 'Select placeholder',
        required: true,
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ],
      },
    },
    {
      key: 'textarea',
      type: 'textarea',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        className: 'mb-4',
        label: 'Textarea',
        placeholder: 'Textarea placeholder',
        required: true,
      },
      ['x-jsonLogic-visibility']: {
        "and": [
          { "===": [{ "var": "select" }, '2'] },
          { "===": [{ "var": "checkbox" }, true] }
        ]
      },
    },
    {
      key: 'radio',
      type: 'radio',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        label: 'Radio',
        required: true,
        options: [
          { label: 'Option 1', value: 1 },
          { label: 'Option 2', value: 2 },
          { label: 'Option 3', value: 3 },
          { label: 'Option 4', value: 4 },
          { label: 'Option 5', value: 5 },
        ],
      },
    },
    {
      key: 'subscribe',
      type: 'checkbox',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        label: 'S’abonner à la newsletter',
      },
    },
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'Adresse email',
        required: true,
      },
      ['x-jsonLogic-visibility']: {
        "or": [
          {
            "and": [
              { "===": [{ "var": "subscribe" }, true] },
              { ">": [{ "var": "radio" }, 3] }
            ]
          },
          {
            "===": [{ "var": "input" }, "salut"]
          }
        ]
      },

    },
  ];

  constructor() {
    this.applyJsonLogicToFields(this.fields, this.model);
  }

  applyJsonLogicToFields(fields: FormlyFieldWithLogic[], model: any): FormlyFieldWithLogic[] {
    return fields.map(field => {
      const logic = (field as any)['x-jsonLogic-visibility'];
      if (logic) {
        field.expressions = {hide: () => !jsonLogic.apply(logic, model)} ;
      }
      if (field.fieldGroup) {
        field.fieldGroup = this.applyJsonLogicToFields(field.fieldGroup, model);
      }
      return field;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model, null, 2));
    }
  }
}
