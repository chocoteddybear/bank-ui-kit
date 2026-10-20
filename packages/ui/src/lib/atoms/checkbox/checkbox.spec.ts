import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkitCheckbox } from './checkbox';

@Component({
  imports: [SkitCheckbox],
  template: `
    <skit-checkbox
      name="terms"
      id="terms"
      required
      disabled
      aria-label="Accept the terms"
      aria-describedby="terms-hint"
    >
      I accept the terms
    </skit-checkbox>
  `,
})
class ForwardingHost {}

const FORWARDED: [attribute: string, expected: string][] = [
  ['name', 'terms'],
  ['id', 'terms'],
  ['required', ''],
  ['disabled', ''],
  ['aria-label', 'Accept the terms'],
  ['aria-describedby', 'terms-hint'],
];

@Component({
  imports: [SkitCheckbox, ReactiveFormsModule],
  template: `<skit-checkbox [formControl]="control">I accept the terms</skit-checkbox>`,
})
class ReactiveHost {
  readonly control = new FormControl<boolean | string>(false, Validators.requiredTrue);
}

@Component({
  imports: [SkitCheckbox, FormsModule],
  template: `<skit-checkbox [(ngModel)]="remember" name="remember">Remember this device</skit-checkbox>`,
})
class NgModelHost {
  remember = true;
}

async function create<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    fixture,
    host: fixture.componentInstance,
    skitCheckbox: element.querySelector('skit-checkbox') as HTMLElement,
    input: element.querySelector('input') as HTMLInputElement,
  };
}

describe('SkitCheckbox', () => {
  describe('forwards native attributes to the inner checkbox', () => {
    it.each(FORWARDED)('forwards %s', async (attribute, expected) => {
      const { input } = await create(ForwardingHost);
      expect(input.getAttribute(attribute)).toBe(expected);
    });

    it.each(FORWARDED)('removes %s from the host element', async (attribute) => {
      const { skitCheckbox } = await create(ForwardingHost);
      expect(skitCheckbox.hasAttribute(attribute)).toBe(false);
    });
  });

  it('is a native checkbox inside a label with the projected text', async () => {
    const { input, skitCheckbox } = await create(ReactiveHost);
    expect(input.type).toBe('checkbox');
    expect(input.closest('label')?.textContent?.trim()).toBe('I accept the terms');
    expect(skitCheckbox.querySelector('.mark')?.getAttribute('aria-hidden')).toBe('true');
  });

  describe('reactive forms', () => {
    it('reflects the control value', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      expect(input.checked).toBe(false);
      host.control.setValue(true);
      await fixture.whenStable();
      expect(input.checked).toBe(true);
    });

    it('updates the control when clicked', async () => {
      const { input, host } = await create(ReactiveHost);
      input.click();
      expect(host.control.value).toBe(true);
      input.click();
      expect(host.control.value).toBe(false);
    });

    it('toggles when the label text is clicked', async () => {
      const { skitCheckbox, host } = await create(ReactiveHost);
      (skitCheckbox.querySelector('.text') as HTMLElement).click();
      expect(host.control.value).toBe(true);
    });

    it('treats only true as checked', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      host.control.setValue('true');
      await fixture.whenStable();
      expect(input.checked).toBe(false);
    });

    it('is disabled by control.disable()', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      host.control.disable();
      await fixture.whenStable();
      expect(input.disabled).toBe(true);
    });

    it('marks the control touched on blur', async () => {
      const { input, host } = await create(ReactiveHost);
      input.dispatchEvent(new Event('blur'));
      expect(host.control.touched).toBe(true);
    });

    it('shows invalid (requiredTrue) only after the field was touched', async () => {
      const { fixture, input } = await create(ReactiveHost);
      expect(input.hasAttribute('aria-invalid')).toBe(false);
      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      expect(input.getAttribute('aria-invalid')).toBe('true');
      input.click();
      await fixture.whenStable();
      expect(input.hasAttribute('aria-invalid')).toBe(false);
    });
  });

  describe('ngModel', () => {
    it('shows the model value and writes back changes', async () => {
      const { fixture, input, host } = await create(NgModelHost);
      await fixture.whenStable();
      expect(input.checked).toBe(true);
      input.click();
      expect(host.remember).toBe(false);
    });
  });

  it('sets an explicit display on the host element', async () => {
    const { skitCheckbox } = await create(ReactiveHost);
    expect(getComputedStyle(skitCheckbox).display).toBe('inline-flex');
  });
});
