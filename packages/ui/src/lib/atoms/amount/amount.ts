import { ChangeDetectionStrategy, Component, computed, inject, input, LOCALE_ID } from '@angular/core';

export type SkitAmountSize = 'sm' | 'md' | 'lg';
/** `always`: +/- on every non-zero amount (transactions). `negative`: only a minus (balances, neutral sums). */
export type SkitAmountSign = 'always' | 'negative';
/**
 * A number, or a plain decimal string ("1234.50") for amounts that must stay exact:
 * strings are formatted digit for digit, numbers are limited by floating point.
 */
export type SkitAmountValue = number | string;

@Component({
  selector: 'skit-amount',
  templateUrl: './amount.html',
  styleUrl: './amount.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class SkitAmount {
  readonly value = input.required<SkitAmountValue>();
  /** ISO 4217 code: "USD", "EUR", "JPY". Decimal places follow the currency. */
  readonly currency = input.required<string>();
  readonly size = input<SkitAmountSize>('md');
  readonly sign = input<SkitAmountSign>('always');

  private readonly locale = inject(LOCALE_ID);

  protected readonly parts = computed(() => {
    const value = this.value();
    const numeric = Number(value);
    if (typeof value === 'string' && value.trim() === '') return null;
    if (!Number.isFinite(numeric)) return null;

    const format = (signDisplay: 'exceptZero' | 'auto' | 'never'): string =>
      new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency(), signDisplay })
        // Intl formats decimal strings exactly (ES2023); the cast only satisfies older TS lib typings.
        .format(value as number);

    const absolute = format('never');
    const always = this.sign() === 'always';
    return {
      visible: format(always ? 'exceptZero' : 'auto'),
      // A leading "-" is read inconsistently by screen readers ("dash", or skipped), so the sign is spelled out.
      spoken: numeric < 0 ? `minus ${absolute}` : numeric > 0 && always ? `plus ${absolute}` : absolute,
    };
  });
}
