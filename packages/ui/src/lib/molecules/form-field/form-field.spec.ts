import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkitInput } from '../../atoms/input/input';
import { SkitSelect } from '../../atoms/select/select';
import { SkitFormField } from './form-field';

@Component({
  imports: [SkitFormField, SkitInput, ReactiveFormsModule],
  template: `
    <skit-form-field label="Amount" [hint]="hint()" error="Enter an amount.">
      <skit-input [formControl]="control" />
    </skit-form-field>
  `,
})
class Host {
  readonly control = new FormControl('', Validators.required);
  readonly hint = signal<string | undefined>('Up to $5,000 a day');
}

@Component({
  imports: [SkitFormField, SkitSelect, ReactiveFormsModule],
  template: `
    <skit-form-field label="From" for="from-account">
      <skit-select [formControl]="control" aria-describedby="own-note"><option value="a">A</option></skit-select>
    </skit-form-field>
  `,
})
class ExplicitIdHost {
  readonly control = new FormControl('a');
}

async function create<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    fixture,
    host: fixture.componentInstance,
    field: element.querySelector('skit-form-field') as HTMLElement,
    label: element.querySelector('label') as HTMLLabelElement,
    control: element.querySelector('input, select') as HTMLInputElement | HTMLSelectElement,
    error: () => element.querySelector('.error'),
  };
}

describe('SkitFormField', () => {
  it('labels the projected control', async () => {
    const { label, control } = await create(Host);
    expect(label.textContent?.trim()).toBe('Amount');
    expect(control.id).toBeTruthy();
    expect(label.htmlFor).toBe(control.id);
    expect(control.labels?.[0]).toBe(label);
  });

  it('gives every field a unique control id', async () => {
    const first = await create(Host);
    const second = await create(Host);
    expect(first.control.id).not.toBe(second.control.id);
  });

  it('uses the id set with "for" and removes the attribute from the host', async () => {
    const { label, control, field } = await create(ExplicitIdHost);
    expect(control.id).toBe('from-account');
    expect(label.htmlFor).toBe('from-account');
    expect(field.hasAttribute('for')).toBe(false);
  });

  it('describes the control with the hint', async () => {
    const { control } = await create(Host);
    const hint = document.getElementById(control.getAttribute('aria-describedby') ?? '');
    expect(hint?.textContent?.trim()).toBe('Up to $5,000 a day');
  });

  it('drops the hint reference when there is no hint', async () => {
    const { fixture, control, host } = await create(Host);
    host.hint.set(undefined);
    await fixture.whenStable();
    expect(control.hasAttribute('aria-describedby')).toBe(false);
  });

  it('keeps an explicit aria-describedby next to the field ids', async () => {
    const { control } = await create(ExplicitIdHost);
    expect(control.getAttribute('aria-describedby')).toBe('own-note');
  });

  it('shows the error only once the control is touched and invalid', async () => {
    const { fixture, control, field, error } = await create(Host);
    expect(error()).toBeNull();

    control.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(error()?.textContent?.trim()).toBe('Enter an amount.');
    expect(field.hasAttribute('data-invalid')).toBe(true);
    expect(control.getAttribute('aria-describedby')?.split(' ')).toContain(error()?.id);
  });

  it('hides the error again once the value is valid', async () => {
    const { fixture, control, host, error } = await create(Host);
    control.dispatchEvent(new Event('blur'));
    host.control.setValue('12');
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(error()).toBeNull();
  });

  it('places the error inside a polite live region', async () => {
    const { fixture, control, error } = await create(Host);
    control.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(error()?.parentElement?.getAttribute('aria-live')).toBe('polite');
  });

  it('sets an explicit display on the host element', async () => {
    const { field } = await create(Host);
    expect(getComputedStyle(field).display).toBe('flex');
  });
});
