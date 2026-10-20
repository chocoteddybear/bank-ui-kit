import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkitSwitch } from './switch';

@Component({
  imports: [SkitSwitch],
  template: `
    <skit-switch
      name="freeze"
      id="freeze"
      required
      disabled
      aria-label="Freeze card"
      aria-describedby="freeze-hint"
    >
      Freeze card
    </skit-switch>
  `,
})
class ForwardingHost {}

const FORWARDED: [attribute: string, expected: string][] = [
  ['name', 'freeze'],
  ['id', 'freeze'],
  ['required', ''],
  ['disabled', ''],
  ['aria-label', 'Freeze card'],
  ['aria-describedby', 'freeze-hint'],
];

@Component({
  imports: [SkitSwitch, ReactiveFormsModule],
  template: `<skit-switch [formControl]="control">Freeze card</skit-switch>`,
})
class ReactiveHost {
  readonly control = new FormControl(false);
}

@Component({
  imports: [SkitSwitch, FormsModule],
  template: `<skit-switch [(ngModel)]="notifications" name="notifications">Push notifications</skit-switch>`,
})
class NgModelHost {
  notifications = true;
}

async function create<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    fixture,
    host: fixture.componentInstance,
    skitSwitch: element.querySelector('skit-switch') as HTMLElement,
    input: element.querySelector('input') as HTMLInputElement,
  };
}

describe('SkitSwitch', () => {
  describe('forwards native attributes to the inner checkbox', () => {
    it.each(FORWARDED)('forwards %s', async (attribute, expected) => {
      const { input } = await create(ForwardingHost);
      expect(input.getAttribute(attribute)).toBe(expected);
    });

    it.each(FORWARDED)('removes %s from the host element', async (attribute) => {
      const { skitSwitch } = await create(ForwardingHost);
      expect(skitSwitch.hasAttribute(attribute)).toBe(false);
    });
  });

  it('is a native checkbox with role="switch", so screen readers say on/off', async () => {
    const { input, skitSwitch } = await create(ReactiveHost);
    expect(input.type).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');
    expect(skitSwitch.querySelector('.thumb')?.getAttribute('aria-hidden')).toBe('true');
  });

  describe('reactive forms', () => {
    it('reflects the control value', async () => {
      const { fixture, input, host } = await create(ReactiveHost);
      expect(input.checked).toBe(false);
      host.control.setValue(true);
      await fixture.whenStable();
      expect(input.checked).toBe(true);
    });

    it('updates the control when toggled', async () => {
      const { input, host } = await create(ReactiveHost);
      input.click();
      expect(host.control.value).toBe(true);
    });

    it('toggles when the label text is clicked', async () => {
      const { skitSwitch, host } = await create(ReactiveHost);
      (skitSwitch.querySelector('.text') as HTMLElement).click();
      expect(host.control.value).toBe(true);
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
  });

  describe('ngModel', () => {
    it('shows the model value and writes back changes', async () => {
      const { fixture, input, host } = await create(NgModelHost);
      await fixture.whenStable();
      expect(input.checked).toBe(true);
      input.click();
      expect(host.notifications).toBe(false);
    });
  });

  it('sets an explicit display on the host element', async () => {
    const { skitSwitch } = await create(ReactiveHost);
    expect(getComputedStyle(skitSwitch).display).toBe('inline-flex');
  });
});
