import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitAmount, SkitAmountSign, SkitAmountSize, SkitAmountValue } from './amount';

@Component({
  imports: [SkitAmount],
  template: `<skit-amount [value]="value()" [currency]="currency()" [size]="size()" [sign]="sign()" />`,
})
class Host {
  readonly sign = signal<SkitAmountSign>('always');
  readonly value = signal<SkitAmountValue>(0);
  readonly currency = signal('USD');
  readonly size = signal<SkitAmountSize>('md');
}

async function render(value: SkitAmountValue, currency = 'USD', size?: SkitAmountSize, sign?: SkitAmountSign) {
  const fixture = TestBed.createComponent(Host);
  const host = fixture.componentInstance;
  host.value.set(value);
  if (sign) host.sign.set(sign);
  host.currency.set(currency);
  if (size) host.size.set(size);
  await fixture.whenStable();
  const amount = (fixture.nativeElement as HTMLElement).querySelector('skit-amount') as HTMLElement;
  return {
    amount,
    fixture,
    host,
    visible: () => amount.querySelector('[aria-hidden="true"]')?.textContent ?? '',
    spoken: () => amount.querySelector('.visually-hidden')?.textContent ?? '',
  };
}

describe('SkitAmount', () => {
  describe('always shows the sign', () => {
    it('adds "+" to deposits', async () => {
      const { visible } = await render(3200);
      expect(visible()).toBe('+$3,200.00');
    });

    it('keeps "-" on purchases', async () => {
      const { visible } = await render(-84.2);
      expect(visible()).toBe('-$84.20');
    });

    it('shows no sign for zero', async () => {
      const { visible } = await render(0);
      expect(visible()).toBe('$0.00');
    });
  });

  describe('sign="negative" (balances, neutral sums)', () => {
    it.each<[SkitAmountValue, string, string]>([
      [3200, '$3,200.00', '$3,200.00'],
      [-84.2, '-$84.20', 'minus $84.20'],
      [0, '$0.00', '$0.00'],
    ])('%s shows "%s" and is read as "%s"', async (value, shown, read) => {
      const { visible, spoken } = await render(value, 'USD', undefined, 'negative');
      expect(visible()).toBe(shown);
      expect(spoken()).toBe(read);
    });

    it('follows a change of the sign input', async () => {
      const { fixture, host, visible } = await render(3200);
      expect(visible()).toBe('+$3,200.00');
      host.sign.set('negative');
      await fixture.whenStable();
      expect(visible()).toBe('$3,200.00');
    });
  });

  describe('screen readers', () => {
    it('hear "plus" for deposits', async () => {
      const { spoken } = await render(3200);
      expect(spoken()).toBe('plus $3,200.00');
    });

    it('hear "minus" for purchases', async () => {
      const { spoken } = await render(-84.2);
      expect(spoken()).toBe('minus $84.20');
    });

    it('hear no sign word for zero', async () => {
      const { spoken } = await render(0);
      expect(spoken()).toBe('$0.00');
    });

    it('do not read the visible symbols', async () => {
      const { amount } = await render(-84.2);
      expect(amount.querySelector('[aria-hidden="true"]')).toBeTruthy();
    });
  });

  describe('exact decimal strings', () => {
    it('formats a string amount', async () => {
      const { visible } = await render('-1234.5');
      expect(visible()).toBe('-$1,234.50');
    });

    it('keeps digits a JavaScript number would lose', async () => {
      // As a number this would round to ...992.
      const { visible } = await render('9007199254740993.10');
      expect(visible()).toBe('+$9,007,199,254,740,993.10');
    });
  });

  it('uses the currency\'s own decimal places', async () => {
    const { visible } = await render(1500, 'JPY');
    expect(visible()).toBe('+¥1,500');
  });

  it('follows the app locale', async () => {
    registerLocaleData(localeDe);
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }] });
    const { visible } = await render(-1234.5, 'EUR');
    expect(visible()).toBe('-1.234,50 €');
  });

  it('updates when the value changes', async () => {
    const { fixture, host, visible } = await render(10);
    host.value.set(-10);
    await fixture.whenStable();
    expect(visible()).toBe('-$10.00');
  });

  it.each<SkitAmountValue>(['abc', '', '1,234.50', Number.NaN])('shows a dash for an invalid value (%s)', async (value) => {
    const { amount } = await render(value);
    expect(amount.textContent?.trim()).toBe('—');
  });

  it('defaults to md', async () => {
    const { amount } = await render(1);
    expect(amount.getAttribute('data-size')).toBe('md');
  });

  it.each<SkitAmountSize>(['sm', 'md', 'lg'])('applies the %s size', async (size) => {
    const { amount } = await render(1, 'USD', size);
    expect(amount.getAttribute('data-size')).toBe(size);
  });

  it('sets an explicit display and tabular digits on the host element', async () => {
    const { amount } = await render(1);
    const style = getComputedStyle(amount);
    expect(style.display).toBe('inline-block');
    expect(style.fontVariantNumeric).toBe('tabular-nums');
  });
});
