import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, signal } from '@angular/core';
import { SkitFormControlBase } from '../shared/form-control-base';

export type SkitInputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' | 'date';
export type SkitInputSize = 'sm' | 'md' | 'lg';
export type SkitInputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

@Component({
  selector: 'skit-input',
  templateUrl: './input.html',
  styleUrls: ['../shared/field.css', './input.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.type]': 'null',
    '[attr.autocomplete]': 'null',
    '[attr.inputmode]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readonly]': 'null',
    '[attr.maxlength]': 'null',
    '[attr.minlength]': 'null',
    '[attr.pattern]': 'null',
  },
})
export class SkitInput extends SkitFormControlBase<string> {
  readonly type = input<SkitInputType>('text');
  readonly size = input<SkitInputSize>('md');
  /** e.g. "cc-number", "one-time-code", "email": lets browsers and password managers autofill. */
  readonly autocomplete = input<string>();
  /** e.g. "decimal" for amounts: opens the numeric keyboard on phones. */
  readonly inputmode = input<SkitInputMode>();
  readonly placeholder = input<string>();
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly maxlength = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly minlength = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly pattern = input<string>();

  /** Always a string, also for type="number", so amounts are never rounded by floating point. */
  protected readonly model = signal('');

  protected toValue(raw: unknown): string {
    return raw === null || raw === undefined ? '' : String(raw);
  }

  protected onInput(event: Event): void {
    this.commit((event.target as HTMLInputElement).value);
  }

  protected onBlur(): void {
    this.touch();
  }
}

function optionalNumber(value: unknown): number | undefined {
  return value === null || value === undefined || value === '' ? undefined : numberAttribute(value);
}
