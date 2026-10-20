import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkitSelect } from './select';

@Component({
  imports: [SkitSelect],
  template: `
    <skit-select
      name="currency"
      id="currency"
      autocomplete="transaction-currency"
      required
      disabled
      aria-label="Currency"
      aria-describedby="currency-hint"
    >
      <option value="usd">US dollar</option>
    </skit-select>
  `,
})
class ForwardingHost {}

const FORWARDED: [attribute: string, expected: string][] = [
  ['name', 'currency'],
  ['id', 'currency'],
  ['autocomplete', 'transaction-currency'],
  ['required', ''],
  ['disabled', ''],
  ['aria-label', 'Currency'],
  ['aria-describedby', 'currency-hint'],
];

@Component({
  imports: [SkitSelect, ReactiveFormsModule],
  template: `
    <skit-select [formControl]="control" [placeholder]="placeholder()">
      @for (option of options(); track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
      }
    </skit-select>
  `,
})
class ReactiveHost {
  readonly control = new FormControl('eur', Validators.required);
  readonly placeholder = signal<string | undefined>(undefined);
  readonly options = signal([
    { value: 'usd', label: 'US dollar' },
    { value: 'eur', label: 'Euro' },
    { value: 'gbp', label: 'Pound sterling' },
  ]);
}

@Component({
  imports: [SkitSelect, FormsModule],
  template: `
    <skit-select [(ngModel)]="currency" name="currency">
      <option value="usd">US dollar</option>
      <option value="eur">Euro</option>
    </skit-select>
  `,
})
class NgModelHost {
  currency = 'eur';
}

async function create<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    fixture,
    host: fixture.componentInstance,
    skitSelect: element.querySelector('skit-select') as HTMLElement,
    select: element.querySelector('select') as HTMLSelectElement,
  };
}

function choose(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event('change'));
}

const settle = () => new Promise((resolve) => setTimeout(resolve));

describe('SkitSelect', () => {
  describe('forwards native attributes to the inner <select>', () => {
    it.each(FORWARDED)('forwards %s', async (attribute, expected) => {
      const { select } = await create(ForwardingHost);
      expect(select.getAttribute(attribute)).toBe(expected);
    });

    it.each(FORWARDED)('removes %s from the host element', async (attribute) => {
      const { skitSelect } = await create(ForwardingHost);
      expect(skitSelect.hasAttribute(attribute)).toBe(false);
    });
  });

  it('renders the projected options inside the native select', async () => {
    const { select } = await create(ReactiveHost);
    expect([...select.options].map((o) => o.value)).toEqual(['usd', 'eur', 'gbp']);
  });

  it('hides its chevron from screen readers', async () => {
    const { skitSelect } = await create(ReactiveHost);
    expect(skitSelect.querySelector('.chevron')?.getAttribute('aria-hidden')).toBe('true');
  });

  describe('reactive forms', () => {
    it('selects the option matching the control value', async () => {
      const { select } = await create(ReactiveHost);
      expect(select.value).toBe('eur');
    });

    it('updates the control when the user chooses', async () => {
      const { select, host } = await create(ReactiveHost);
      choose(select, 'gbp');
      expect(host.control.value).toBe('gbp');
    });

    it('follows control.setValue()', async () => {
      const { fixture, select, host } = await create(ReactiveHost);
      host.control.setValue('usd');
      await fixture.whenStable();
      expect(select.value).toBe('usd');
    });

    it('keeps the value when options arrive later', async () => {
      const { fixture, select, host } = await create(ReactiveHost);
      host.options.set([]);
      await fixture.whenStable();
      host.control.setValue('chf');
      await fixture.whenStable();
      host.options.set([
        { value: 'usd', label: 'US dollar' },
        { value: 'chf', label: 'Swiss franc' },
      ]);
      await fixture.whenStable();
      await settle();
      expect(select.value).toBe('chf');
    });

    it('is disabled by control.disable()', async () => {
      const { fixture, select, host } = await create(ReactiveHost);
      host.control.disable();
      await fixture.whenStable();
      expect(select.disabled).toBe(true);
    });

    it('marks the control touched on blur', async () => {
      const { select, host } = await create(ReactiveHost);
      select.dispatchEvent(new Event('blur'));
      expect(host.control.touched).toBe(true);
    });

    it('shows invalid only after the field was touched', async () => {
      const { fixture, select, host } = await create(ReactiveHost);
      host.control.setValue('');
      await fixture.whenStable();
      expect(select.hasAttribute('aria-invalid')).toBe(false);
      select.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      expect(select.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('placeholder', () => {
    it('adds a first, disabled option shown while nothing is chosen', async () => {
      const { fixture, select, host } = await create(ReactiveHost);
      host.placeholder.set('Choose a currency');
      host.control.setValue('');
      await fixture.whenStable();
      const first = select.options[0];
      expect(first.textContent?.trim()).toBe('Choose a currency');
      expect(first.disabled).toBe(true);
      expect(first.value).toBe('');
      expect(select.value).toBe('');
      expect(select.classList).toContain('field--placeholder');
    });

    it('drops the muted placeholder style once a value is chosen', async () => {
      const { fixture, select, host } = await create(ReactiveHost);
      host.placeholder.set('Choose a currency');
      await fixture.whenStable();
      expect(select.classList).not.toContain('field--placeholder');
    });
  });

  describe('ngModel', () => {
    it('shows the model value and writes back the choice', async () => {
      const { fixture, select, host } = await create(NgModelHost);
      await fixture.whenStable();
      await settle();
      expect(select.value).toBe('eur');
      choose(select, 'usd');
      expect(host.currency).toBe('usd');
    });
  });

  it('sets an explicit display on the host element', async () => {
    const { skitSelect } = await create(ReactiveHost);
    expect(getComputedStyle(skitSelect).display).toBe('block');
  });
});
