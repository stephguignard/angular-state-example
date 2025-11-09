import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {AmountCvaComponent} from '../../components/amount-cva/amount-cva.component';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-cva-page',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    AmountCvaComponent,
    ButtonDirective
  ],
  templateUrl: './cva-page.component.html',
  styleUrl: './cva-page.component.scss'
})
export class CvaPageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      amount: [null, {
        validators: [Validators.required, Validators.min(10),Validators.max(50)],
        updateOn: 'blur'
      }],
      amount2: [null, [ Validators.min(20)]],
    });

    this.form.setValue({amount: null, amount2: 10})
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('✅ Valeurs du formulaire', this.form.value);
    } else {
      console.warn('❌ Formulaire invalide');
    }
  }

  reset(): void {
    this.form.reset();
  }

  touchAmount(): void {
    this.form.get('amount')?.markAsTouched({ onlySelf: false, emitEvent: false});
    console.log('touchAmount', this.form.get('amount')?.touched);
  }
}
