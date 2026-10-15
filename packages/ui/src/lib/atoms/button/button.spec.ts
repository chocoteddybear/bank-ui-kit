import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitButton, SkitButtonSize, SkitButtonType, SkitButtonVariant } from './button';

@Component({
  imports: [SkitButton],
  template: `
    <form (submit)="onSubmit($event)">
      <skit-button
        [variant]="variant()"
        [size]="size()"
        [type]="type()"
        [disabled]="disabled()"
        [loading]="loading()"
        (click)="clicks = clicks + 1"
      >
        Pay $84.20
      </skit-button>
    </form>
  `,
})
class Host {
  readonly variant = signal<SkitButtonVariant>('primary');
  readonly size = signal<SkitButtonSize>('md');
  readonly type = signal<SkitButtonType>('button');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  clicks = 0;
  submits = 0;

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submits++;
  }
}

/** Uses no bindings at all, so it sees the component's own defaults. */
@Component({
  imports: [SkitButton],
  template: `<form (submit)="onSubmit($event)"><skit-button>Pay</skit-button></form>`,
})
class DefaultsHost {
  submits = 0;

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submits++;
  }
}

async function setupDefaults() {
  const fixture = TestBed.createComponent(DefaultsHost);
  await fixture.whenStable();
  const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  return { host: fixture.componentInstance, button };
}

interface Inputs {
  variant?: SkitButtonVariant;
  size?: SkitButtonSize;
  type?: SkitButtonType;
  disabled?: boolean;
  loading?: boolean;
}

async function setup(inputs: Inputs = {}) {
  const fixture = TestBed.createComponent(Host);
  const host = fixture.componentInstance;
  if (inputs.variant) host.variant.set(inputs.variant);
  if (inputs.size) host.size.set(inputs.size);
  if (inputs.type) host.type.set(inputs.type);
  if (inputs.disabled !== undefined) host.disabled.set(inputs.disabled);
  if (inputs.loading !== undefined) host.loading.set(inputs.loading);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  const button = element.querySelector('button') as HTMLButtonElement;
  return { fixture, host, element, button };
}

describe('SkitButton', () => {
  it('renders a native <button> with the projected label', async () => {
    const { button } = await setup();
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe('Pay $84.20');
  });

  it('sets an explicit display on the host element', async () => {
    const { element } = await setup();
    const host = element.querySelector('skit-button') as HTMLElement;
    expect(getComputedStyle(host).display).toBe('inline-block');
  });

  describe('forwards type', () => {
    it('defaults to type="button" so it never submits a form by accident', async () => {
      const { button, host } = await setupDefaults();
      expect(button.type).toBe('button');
      button.click();
      expect(host.submits).toBe(0);
    });

    it.each<SkitButtonType>(['button', 'submit', 'reset'])('forwards type="%s"', async (type) => {
      const { button } = await setup({ type });
      expect(button.getAttribute('type')).toBe(type);
    });

    it('submits the surrounding form when type="submit"', async () => {
      const { button, host } = await setup({ type: 'submit' });
      button.click();
      expect(host.submits).toBe(1);
    });
  });

  describe('forwards disabled', () => {
    it('sets the native disabled property', async () => {
      const { button } = await setup({ disabled: true });
      expect(button.disabled).toBe(true);
    });

    it('is enabled by default', async () => {
      const { button } = await setupDefaults();
      expect(button.disabled).toBe(false);
    });

    it('does not emit clicks or submit while disabled', async () => {
      const { button, host } = await setup({ disabled: true, type: 'submit' });
      button.click();
      expect(host.clicks).toBe(0);
      expect(host.submits).toBe(0);
    });
  });

  describe('loading', () => {
    it('marks the button busy and disabled for assistive technology', async () => {
      const { button } = await setup({ loading: true });
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('stays focusable, unlike disabled', async () => {
      const { button } = await setup({ loading: true });
      expect(button.disabled).toBe(false);
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('shows a spinner hidden from screen readers and keeps the label in the accessible name', async () => {
      const { button } = await setup({ loading: true });
      const spinner = button.querySelector('.spinner');
      expect(spinner?.getAttribute('aria-hidden')).toBe('true');
      expect(button.textContent?.trim()).toBe('Pay $84.20');
    });

    it('blocks clicks and form submission', async () => {
      const { button, host } = await setup({ loading: true, type: 'submit' });
      button.click();
      expect(host.clicks).toBe(0);
      expect(host.submits).toBe(0);
    });

    it('drops the busy attributes when loading ends', async () => {
      const { fixture, host, button } = await setup({ loading: true });
      host.loading.set(false);
      await fixture.whenStable();
      expect(button.hasAttribute('aria-busy')).toBe(false);
      expect(button.hasAttribute('aria-disabled')).toBe(false);
      expect(button.querySelector('.spinner')).toBeNull();
    });
  });

  it('emits clicks when enabled', async () => {
    const { button, host } = await setup();
    button.click();
    expect(host.clicks).toBe(1);
  });

  it.each<SkitButtonVariant>(['primary', 'secondary', 'outline', 'ghost', 'danger'])(
    'applies the %s variant',
    async (variant) => {
      const { button } = await setup({ variant });
      expect(button.classList).toContain(`button--${variant}`);
    },
  );

  it.each<SkitButtonSize>(['sm', 'md', 'lg'])('applies the %s size', async (size) => {
    const { button } = await setup({ size });
    expect(button.classList).toContain(`button--${size}`);
  });

  it('defaults to primary and md', async () => {
    const { button } = await setupDefaults();
    expect(button.classList).toContain('button--primary');
    expect(button.classList).toContain('button--md');
    expect(button.classList).toContain('button');
  });
});

