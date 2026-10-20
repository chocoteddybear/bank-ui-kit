import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkitRadio } from './radio';

@Component({
  imports: [SkitRadio],
  template: `
    <skit-radio
      value="sepa"
      name="method"
      id="method-sepa"
      required
      disabled
      aria-label="SEPA transfer"
      aria-describedby="method-hint"
    >
      SEPA transfer
    </skit-radio>
  `,
})
class ForwardingHost {}

const FORWARDED: [attribute: string, expected: string][] = [
  ['value', 'sepa'],
  ['name', 'method'],
  ['id', 'method-sepa'],
  ['required', ''],
  ['disabled', ''],
  ['aria-label', 'SEPA transfer'],
  ['aria-describedby', 'method-hint'],
];

@Component({
  imports: [SkitRadio, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <skit-radio formControlName="speed" name="speed" value="standard">Standard (free)</skit-radio>
      <skit-radio formControlName="speed" name="speed" value="instant">Instant ($1.00)</skit-radio>
      <skit-radio formControlName="speed" name="speed" value="scheduled">Scheduled</skit-radio>
    </form>
  `,
})
class ReactiveHost {
  readonly form = new FormGroup({ speed: new FormControl<string | null>('instant') });
}

@Component({
  imports: [SkitRadio, FormsModule],
  template: `
    <form>
      <skit-radio [(ngModel)]="speed" name="speed" value="standard">Standard</skit-radio>
      <skit-radio [(ngModel)]="speed" name="speed" value="instant">Instant</skit-radio>
    </form>
  `,
})
class NgModelHost {
  speed = 'standard';
}

async function create<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  const inputs = [...element.querySelectorAll('input')] as HTMLInputElement[];
  return {
    fixture,
    host: fixture.componentInstance,
    element,
    inputs,
    checked: () => inputs.filter((i) => i.checked).map((i) => i.value),
  };
}

describe('SkitRadio', () => {
  describe('forwards native attributes to the inner radio', () => {
    it.each(FORWARDED)('forwards %s', async (attribute, expected) => {
      const { inputs } = await create(ForwardingHost);
      expect(inputs[0].getAttribute(attribute)).toBe(expected);
    });

    it.each(FORWARDED)('removes %s from the host element', async (attribute) => {
      const { element } = await create(ForwardingHost);
      expect(element.querySelector('skit-radio')!.hasAttribute(attribute)).toBe(false);
    });
  });

  it('is a native radio inside a label with the projected text', async () => {
    const { inputs } = await create(ReactiveHost);
    expect(inputs[0].type).toBe('radio');
    expect(inputs[0].closest('label')?.textContent?.trim()).toBe('Standard (free)');
  });

  describe('reactive forms (one control shared by the group)', () => {
    it('checks the radio whose value matches the control', async () => {
      const { checked } = await create(ReactiveHost);
      expect(checked()).toEqual(['instant']);
    });

    it('sets the control to the chosen radio and unchecks the others', async () => {
      const { fixture, inputs, host, checked } = await create(ReactiveHost);
      inputs[2].click();
      await fixture.whenStable();
      expect(host.form.value.speed).toBe('scheduled');
      expect(checked()).toEqual(['scheduled']);
    });

    it('follows setValue()', async () => {
      const { fixture, host, checked } = await create(ReactiveHost);
      host.form.controls.speed.setValue('standard');
      await fixture.whenStable();
      expect(checked()).toEqual(['standard']);
    });

    it('checks nothing for null', async () => {
      const { fixture, host, checked } = await create(ReactiveHost);
      host.form.controls.speed.setValue(null);
      await fixture.whenStable();
      expect(checked()).toEqual([]);
    });

    it('disables the whole group with control.disable()', async () => {
      const { fixture, inputs, host } = await create(ReactiveHost);
      host.form.controls.speed.disable();
      await fixture.whenStable();
      expect(inputs.every((i) => i.disabled)).toBe(true);
    });

    it('marks the control touched on blur', async () => {
      const { inputs, host } = await create(ReactiveHost);
      inputs[0].dispatchEvent(new Event('blur'));
      expect(host.form.controls.speed.touched).toBe(true);
    });
  });

  describe('ngModel', () => {
    it('shows the model value and writes back the choice', async () => {
      const { fixture, inputs, host, checked } = await create(NgModelHost);
      await fixture.whenStable();
      expect(checked()).toEqual(['standard']);
      inputs[1].click();
      await fixture.whenStable();
      expect(host.speed).toBe('instant');
      expect(checked()).toEqual(['instant']);
    });
  });

  it('sets an explicit display on the host element', async () => {
    const { element } = await create(ReactiveHost);
    expect(getComputedStyle(element.querySelector('skit-radio')!).display).toBe('inline-flex');
  });
});
