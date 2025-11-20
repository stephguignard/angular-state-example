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
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormlyForm,
    Button,
    JsonPipe,
  ],
  templateUrl: './form-one.component.html',
  styleUrl: './form-one.component.scss',
})
export class FormOneComponent {
  form = new FormGroup({});
  model: any = {};

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
        // 👇 jsonLogic dans props
        'x-jsonLogic-visibility': {
          and: [
            { '===': [{ var: 'select' }, '2'] },
            { '===': [{ var: 'checkbox' }, true] },
          ],
        },
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
        'x-jsonLogic-visibility': {
          or: [
            {
              and: [
                { '===': [{ var: 'subscribe' }, true] },
                { '>': [{ var: 'radio' }, 3] },
              ],
            },
            {
              '===': [{ var: 'input' }, 'salut'],
            },
          ],
        },
      },
    },

    // ============================
    //  EXEMPLE MULTI-NIVEAUX
    // ============================
    {
      key: 'person',
      wrappers: [PanelFieldWrapperComponent],
      props: {
        label: 'Personne',
        styleClass: 'mb-4',
      },
      fieldGroup: [
        {
          key: 'firstName',
          type: 'input',
          props: {
            label: 'Prénom',
            required: true,
          },
        },
        {
          key: 'age',
          type: 'input',
          props: {
            type: 'number',
            label: 'Âge',
            required: true,
          },
        },
        {
          key: 'address',
          wrappers: [PanelFieldWrapperComponent],
          props: {
            label: 'Adresse',
          },
          fieldGroup: [
            {
              key: 'street',
              type: 'input',
              props: {
                label: 'Rue',
                required: true,
              },
            },
            {
              key: 'zip',
              type: 'input',
              props: {
                label: 'NPA',
                required: true,
              },
            },
            {
              key: 'country',
              type: 'select',
              props: {
                label: 'Pays',
                required: true,
                options: [
                  { label: 'Suisse', value: 'CH' },
                  { label: 'France', value: 'FR' },
                  { label: 'Italie', value: 'IT' },
                ],
              },
            },
          ],
        },
        {
          key: 'comment',
          type: 'textarea',
          props: {
            label: 'Commentaire (Suisse + majeur)',
            placeholder: 'Visible seulement si Suisse et âge >= 18',
            // 👇 multi-niveau person.age + person.address.country
            'x-jsonLogic-visibility': {
              and: [
                { '>=': [{ var: 'person.age' }, 18] },
                { '===': [{ var: 'person.address.country' }, 'CH'] },
              ],
            },
          },
        },
      ],
    },

    {
      key: 'children',
      type: 'repeat-table',
      templateOptions: {
        addText: 'Ajouter un enfant',
        columns: [
          { key: 'name', label: 'Nom' },
          { key: 'age', label: 'Âge' },
        ],
      },
      fieldArray: {
        fieldGroup: [
          {
            key: 'name',
            type: 'input',
            props: {
              required: true,
            },
          },
          {
            key: 'age',
            type: 'input',
            props: {
              type: 'number',
              required: true,
            },
            validators: {
              max18: {
                expression: (control: any) =>
                  !control.value || control.value <= 18,
                message: 'L’âge ne doit pas dépasser 18 ans',
              },
            },
          },
        ],
      },
    },
  ];

  constructor() {
    this.fields = this.applyJsonLogicToFields(this.fields);
  }

  /**
   * Parcourt récursivement tous les champs et,
   * si props['x-jsonLogic-visibility'] est défini, crée une expression Formly 'hide'
   * basée sur json-logic et le model complet.
   */
  private applyJsonLogicToFields(fields: FormlyFieldWithLogic[]): FormlyFieldWithLogic[] {
    return fields.map((field) => {
      if (typeof field === 'function') {
        return field as FormlyFieldWithLogic;
      }

      const logic = (field.props as any)?.['x-jsonLogic-visibility'];

      if (logic) {
        field.expressions = {
          ...(field.expressions ?? {}),
          hide: () => !jsonLogic.apply(logic, this.model),
        };
      }

      if (field.fieldGroup) {
        field.fieldGroup = this.applyJsonLogicToFields(
          field.fieldGroup as FormlyFieldWithLogic[],
        );
      }

      if (field.fieldArray && typeof field.fieldArray !== 'function') {
        const fa = field.fieldArray as FormlyFieldWithLogic;
        if (fa.fieldGroup) {
          fa.fieldGroup = this.applyJsonLogicToFields(
            fa.fieldGroup as FormlyFieldWithLogic[],
          );
        }
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
