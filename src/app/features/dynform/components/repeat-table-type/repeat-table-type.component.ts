import { Component } from '@angular/core';
import { NgFor} from '@angular/common';
import {FormlyField, FieldArrayType, FormlyFieldConfig} from '@ngx-formly/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';


@Component({
  selector: 'app-repeat-table-type',
  imports: [
    NgFor,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    FormlyField],
  templateUrl: './repeat-table-type.component.html',
  styleUrl: './repeat-table-type.component.scss'
})
export class RepeatTableTypeComponent extends FieldArrayType{
  getColumnField(rowIndex: number, key: string): FormlyFieldConfig  {
    const row = this.field.fieldGroup?.[rowIndex];
    const config = row?.fieldGroup?.find(f => f.key === key);
    return config ? config : {} as FormlyFieldConfig;
  }
}
