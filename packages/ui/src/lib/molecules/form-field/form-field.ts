import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DoCheck,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { SkitIcon } from '../../atoms/icon/icon';
import { SKIT_FORM_FIELD, SkitFormFieldContext } from '../../atoms/shared/form-field-context';

let nextId = 0;

/**
 * Label, control, hint and error as one unit. The projected form atom gets its id and aria-describedby
 * from this field, so the label, hint and error are always wired for screen readers.
 */
@Component({
  selector: 'skit-form-field',
  imports: [SkitIcon],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SKIT_FORM_FIELD, useExisting: forwardRef(() => SkitFormField) }],
  host: {
    '[attr.for]': 'null',
    '[attr.data-invalid]': 'showError() ? "" : null',
  },
})
export class SkitFormField implements SkitFormFieldContext, DoCheck {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  /** Shown once the control is touched and invalid. The page decides the text, e.g. per validator. */
  readonly error = input<string>();
  /** The control's id, when the page needs a known one. Set it here, not on the control, so the label matches. */
  readonly for = input<string>();

  private readonly baseId = `skit-field-${nextId++}`;
  protected readonly hintId = `${this.baseId}-hint`;
  protected readonly errorId = `${this.baseId}-error`;

  readonly controlId = computed(() => this.for() ?? `${this.baseId}-control`);

  private readonly ngControl = contentChild(NgControl, { descendants: true });
  private readonly invalid = signal(false);
  protected readonly showError = computed(() => this.invalid() && !!this.error());

  readonly describedBy = computed(
    () => [this.hint() ? this.hintId : '', this.showError() ? this.errorId : ''].filter(Boolean).join(' ') || undefined,
  );

  // Same rule as the atoms: form status isn't a signal, so it is read on every check.
  ngDoCheck(): void {
    const control = this.ngControl();
    this.invalid.set(!!control?.invalid && !!control.touched);
  }
}
