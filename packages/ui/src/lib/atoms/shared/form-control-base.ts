import { booleanAttribute, computed, Directive, DoCheck, inject, input, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SKIT_FORM_FIELD } from './form-field-context';

/**
 * Shared Angular-forms plumbing for the form atoms: ControlValueAccessor, disabled state from both the
 * input and the form, touched, and the invalid state. Attributes that belong to the inner native element
 * are inputs here and are removed from the host, so ids stay unique and ARIA stays valid.
 */
@Directive({
  host: {
    '[attr.id]': 'null',
    '[attr.name]': 'null',
    '[attr.required]': 'null',
    '[attr.disabled]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-describedby]': 'null',
  },
})
export abstract class SkitFormControlBase<T> implements ControlValueAccessor, DoCheck {
  readonly id = input<string>();
  readonly name = input<string>();
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly ariaDescribedby = input<string | undefined>(undefined, { alias: 'aria-describedby' });

  private readonly field = inject(SKIT_FORM_FIELD, { optional: true });
  /** An explicit id wins; otherwise a wrapping field supplies one. */
  protected readonly controlId = computed(() => this.id() ?? this.field?.controlId());
  /** Explicit and field descriptions are combined, so an app can add its own hint next to the field's. */
  protected readonly describedBy = computed(
    () => [this.ariaDescribedby(), this.field?.describedBy()].filter(Boolean).join(' ') || undefined,
  );

  /** The form value, as Angular forms see it. */
  protected abstract readonly model: WritableSignal<T>;
  protected abstract toValue(raw: unknown): T;

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  /** Shown only once the user has left the field (or the app marks it touched), not while typing. */
  protected readonly invalid = signal(false);

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  // Injected instead of providing NG_VALUE_ACCESSOR, so the atom can also read the control's validity.
  protected readonly ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  writeValue(raw: unknown): void {
    this.model.set(this.toValue(raw));
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  // Form status isn't a signal, so it is read on every check; cheap, and it also catches markAllAsTouched().
  ngDoCheck(): void {
    const control = this.ngControl;
    this.invalid.set(!!control?.invalid && !!control.touched);
  }

  protected commit(value: T): void {
    this.model.set(value);
    this.onChange(value);
  }

  protected touch(): void {
    this.onTouched();
  }
}
