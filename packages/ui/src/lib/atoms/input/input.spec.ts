import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkitInput, SkitInputSize } from './input';

@Component({
  imports: [SkitInput],
  template: `
    <skit-input
      type="email"
      name="email"
      id="email"
      autocomplete="email"
      inputmode="email"
      placeholder="you@bank.com"
      required
      disabled
      readonly
      maxlength="40"
      minlength="5"
      pattern="[a-z@.]+"
      aria-label="Email address"
      aria-describedby="email-hint"
    />
  `,
})
class ForwardingHost {}

const FORWARDED: [attribute: string, expected: string][] = [
  ['type', 'email'],
  ['name', 'email'],
  ['id', 'email'],
  ['autocomplete', 'email'],
  ['inputmode', 'email'],
  ['placeholder', 'you@bank.com'],
  ['required', ''],
  ['disabled', ''],
  ['readonly', ''],
  ['maxlength', '40'],
  ['minlength', '5'],
  ['pattern', '[a-z@.]+'],
  ['aria-label', 'Email address'],
  ['aria-describedby', 'email-hint'],
];

@Component({
  imports: [SkitInput, ReactiveFormsModule],
  template: `<skit-input [formControl]="control" [size]="size()" />`,
})
class ReactiveHost {
  readonly control = new FormControl<string | number | null>('100.50', Validators.required);
  readonly size = signal<SkitInputSize>('md');
}

@Component({
  imports: [SkitInput, FormsModule],
  template: `<skit-input [(ngModel)]="amount" name="amount" />`,
})
class NgModelHost {
  amount = '42';
}

@Component({
  imports: [SkitInput],
  template: `<skit-input />`,
})
class DefaultsHost {}

function type(input: HTMLInputElement, text: string): void {
  input.value = text;
  input.dispatchEvent(new Event('input'));
}

async function create<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    fixture,
    host: fixture.componentInstance,
    skitInput: element.querySelector('skit-input') as HTMLElement,
    input: element.querySelector('input') as HTMLInputElement,
  };
}

describe('SkitInput', () => {
  describe('forwards native attributes to the inner <input>', () => {
    it.each(FORWARDED)('forwards %s', async (attribute, expected) => {
      const { input } = await create(ForwardingHost);
      expect(input.getAttribute(attribute)).toBe(expected);
    });

    it.each(FORWARDED)('removes %s from the host element', async (attribute) => {
      const { skitInput } = await create(ForwardingHost);
      expect(skitInput.hasAttribute(attribute)).toBe(false);
    });

    it('keeps the id unique on the page', async () => {
      const { fixture } = await create(ForwardingHost);
      expect((fixture.nativeElement as HTMLElement).querySelectorAll('#email')).toHaveLength(1);
    });
  });

  describe('defaults', () => {
    it('is a text input with no optional attributes', async () => {
      const { input } = await create(DefaultsHost);
      expect(input.type).toBe('text');
      for (const [attribute] of FORWARDED.filter(([a]) => a !== 'type')) {
        expect(input.hasAttribute(attribute)).toBe(false);
      }
    });
  });

  describe('reactive forms', () => {
    it('shows the control value', async () => {
      const { input } = await create(ReactiveHost);
      expect(input.value).toBe('100.50');
    });

    it('updates the control as the user types', async () => {
      const { input, host } = await create(ReactiveHost);
      type(input, '84.20');
      expect(host.control.value).toBe('84.20');
    });

    it('follows control.setValue()', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      host.control.setValue('3200');
      await fixture.whenStable();
      expect(input.value).toBe('3200');
    });

    it('turns non-string values into strings and null into empty', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      host.control.setValue(12.5);
      await fixture.whenStable();
      expect(input.value).toBe('12.5');
      host.control.setValue(null);
      await fixture.whenStable();
      expect(input.value).toBe('');
    });

    it('is disabled by control.disable()', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      host.control.disable();
      await fixture.whenStable();
      expect(input.disabled).toBe(true);
      host.control.enable();
      await fixture.whenStable();
      expect(input.disabled).toBe(false);
    });

    it('marks the control touched on blur', async () => {
      const { input, host } = await create(ReactiveHost);
      input.dispatchEvent(new Event('blur'));
      expect(host.control.touched).toBe(true);
    });

    it('shows invalid only after the field was touched', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      type(input, '');
      await fixture.whenStable();
      expect(host.control.invalid).toBe(true);
      expect(input.hasAttribute('aria-invalid')).toBe(false);

      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('shows invalid after markAllAsTouched(), e.g. on submit', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      host.control.setValue('');
      host.control.markAllAsTouched();
      fixture.changeDetectorRef.markForCheck();
      await fixture.whenStable();
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('clears invalid once the value is valid', async () => {
      const { fixture, input } = await create(ReactiveHost);
      type(input, '');
      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      type(input, '5');
      await fixture.whenStable();
      expect(input.hasAttribute('aria-invalid')).toBe(false);
    });
  });

  describe('ngModel', () => {
    it('shows the model value and writes back typed text', async () => {
      const { fixture, input, host } = await create(NgModelHost);
      await fixture.whenStable();
      expect(input.value).toBe('42');
      type(input, '43');
      expect(host.amount).toBe('43');
    });
  });

  describe('Angular validators read the host attributes', () => {
    @Component({
      imports: [SkitInput, ReactiveFormsModule],
      template: `<skit-input [formControl]="control" required maxlength="3" />`,
    })
    class ValidatorsHost {
      readonly control = new FormControl('');
    }

    it('applies required and maxlength without extra setup', async () => {
      const { fixture, input, host } = await create(ValidatorsHost);
      expect(host.control.hasError('required')).toBe(true);
      type(input, '1234');
      await fixture.whenStable();
      expect(host.control.hasError('maxlength')).toBe(true);
    });
  });

  it('applies the size', async () => {
    const { fixture, skitInput, host } = await create(ReactiveHost);
    expect(skitInput.getAttribute('data-size')).toBe('md');
    host.size.set('lg');
    await fixture.whenStable();
    expect(skitInput.getAttribute('data-size')).toBe('lg');
  });

  it('sets an explicit display on the host element', async () => {
    const { skitInput } = await create(DefaultsHost);
    expect(getComputedStyle(skitInput).display).toBe('block');
  });
});
