import { Component, OnInit, DoCheck, inject } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Signal,
  WritableSignal,
  computed,
  input,
  signal,
  DestroyRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { startWith } from 'rxjs/operators';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-amount-cva',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './amount-cva.component.html',
  styles: [`
    :host { display: inline-flex; flex-direction: column; gap: .25rem; }
  `],
})
export class AmountCvaComponent implements ControlValueAccessor, OnInit, DoCheck {
  // ---------- Inputs (Signals) ----------
  readonly label        = input<string | undefined>(undefined);
  readonly placeholder  = input<string | undefined>(undefined);
  readonly min          = input<number | undefined>(undefined);
  readonly max          = input<number | undefined>(undefined);
  readonly step         = input<number>(1);
  readonly prefix       = input<string | undefined>(undefined);
  readonly suffix       = input<string | undefined>(undefined);
  readonly mode         = input<'decimal' | 'currency'>('decimal');
  readonly useGrouping  = input<boolean>(true);
  readonly debug        = input<boolean>(false);

  // ---------- DI ----------
  private readonly ngControl    = inject(NgControl,          { self: true, optional: true });
  private readonly ngForm       = inject(NgForm,             { host: true, optional: true });
  private readonly formGroupDir = inject(FormGroupDirective, { host: true, optional: true });
  private readonly destroyRef   = inject(DestroyRef);

  constructor() {
    // S'enregistrer comme value accessor → évite NG0200
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  // ---------- CVA callbacks ----------
  private onChange:  (v: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  // ---------- État interne ----------
  readonly innerModel:   WritableSignal<number | null> = signal<number | null>(null);
  readonly isDisabled:   WritableSignal<boolean>       = signal<boolean>(false);
  private readonly localTouched: WritableSignal<boolean> = signal<boolean>(false);

  private lastWritten: number | null = null;

  // Pulses pour réveiller les computed
  private readonly statusText = signal<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>('VALID');
  private readonly valuePulse = signal(0);
  private readonly statePulse = signal(0); // 👈 réveille sur ngDoCheck

  // Exposition simple pour le template (debug)
  readonly status: Signal<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'> =
    computed(() => this.statusText());

  // Dérivés UI
  readonly dirty = computed(() => this.innerModel() !== this.lastWritten);

  // touched = Angular.touched || blur local ; réveillé par pulses + DoCheck
  readonly touched = computed(() => {
    void this.statusText();
    void this.valuePulse();
    void this.statePulse(); // 👈
    const c = this.ngControl?.control;
    const angTouched = !!c && c.touched;
    return angTouched || this.localTouched();
  });

  // invalid Angular ; réveillé par pulses + DoCheck
  private readonly ngInvalid = computed(() => {
    void this.statusText();
    void this.valuePulse();
    void this.statePulse(); // 👈
    const c = this.ngControl?.control ?? null;
    return !!c && c.invalid;
  });

  private readonly _submitted = signal(false);
  readonly submitted = computed(() => this._submitted());

  readonly isInvalid = computed(() =>
    this.ngInvalid() && (this.dirty() || this.touched() || this.submitted())
  );
  readonly showError = this.isInvalid;

  // ---------- Lifecycle ----------
  ngOnInit(): void {
    const c = this.ngControl?.control ?? null;

    if (c) {
      // 1) Statut
      c.statusChanges
        .pipe(startWith(c.status), takeUntilDestroyed(this.destroyRef))
        .subscribe(s => this.statusText.set(s as any));

      // 2) Valeur (pulse même si statut stable)
      c.valueChanges
        .pipe(startWith(c.value), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.valuePulse.set(this.valuePulse() + 1));
    }

    // 3) Submitted (template-driven & reactive)
    this.ngForm?.ngSubmit
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this._submitted.set(true));

    this.formGroupDir?.ngSubmit
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this._submitted.set(true));

    // 4) Heuristique de reset (pristine & untouched)
    if (c) {
      merge(
        c.statusChanges.pipe(startWith(c.status)),
        c.valueChanges.pipe(startWith(c.value)),
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          if (c.pristine && !c.touched) {
            this._submitted.set(false);
            this.localTouched.set(false);
            this.lastWritten = this.innerModel();
          }
        });
    }
  }

  // 🔎 Détecte markAsTouched()/reset() sans events (emitEvent:false)
  private _lastAngTouched = false;
  private _lastPristine = true;

  ngDoCheck(): void {
    const c = this.ngControl?.control ?? null;
    if (!c) return;

    // touched changé sans events (ex: markAsTouched({emitEvent:false}))
    if (c.touched !== this._lastAngTouched) {
      this._lastAngTouched = c.touched;
      this.statePulse.set(this.statePulse() + 1);
    }

    // pristine changé (ex: reset())
    if (c.pristine !== this._lastPristine) {
      this._lastPristine = c.pristine;
      this.statePulse.set(this.statePulse() + 1);
      if (c.pristine && !c.touched) {
        this._submitted.set(false);
        this.localTouched.set(false);
        this.lastWritten = this.innerModel();
      }
    }
  }

  // ---------- Handlers ----------
  onInnerChange(v: number | null): void {
    // Mise à jour + propagation synchrones → évite NG0100
    this.innerModel.set(v);
    this.onChange(v);
  }

  handleBlur(): void {
    this.localTouched.set(true);
    this.onTouched();
  }

  // ---------- CVA ----------
  writeValue(value: number | null): void {
    this.lastWritten = value ?? null;
    this.innerModel.set(value ?? null);
  }
  registerOnChange(fn: (value: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled.set(isDisabled); }
}
