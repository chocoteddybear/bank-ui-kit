import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitIcon, SkitIconSize } from './icon';
import { SKIT_ICONS, SkitIconName } from './icons';

@Component({
  imports: [SkitIcon],
  template: `<skit-icon [name]="name()" [size]="size()" [label]="label()" />`,
})
class Host {
  readonly name = signal<SkitIconName>('wallet');
  readonly size = signal<SkitIconSize>('md');
  readonly label = signal<string | undefined>(undefined);
}

@Component({
  imports: [SkitIcon],
  template: `<skit-icon name="card" />`,
})
class DefaultsHost {}

async function setup(inputs: { name?: SkitIconName; size?: SkitIconSize; label?: string } = {}) {
  const fixture = TestBed.createComponent(Host);
  const host = fixture.componentInstance;
  if (inputs.name) host.name.set(inputs.name);
  if (inputs.size) host.size.set(inputs.size);
  if (inputs.label !== undefined) host.label.set(inputs.label);
  await fixture.whenStable();
  const icon = (fixture.nativeElement as HTMLElement).querySelector('skit-icon') as HTMLElement;
  return { fixture, host, icon, svg: () => icon.querySelector('svg') as SVGSVGElement };
}

describe('SkitIcon', () => {
  it('renders an svg with the icon drawing', async () => {
    const { svg } = await setup();
    expect(svg()).toBeTruthy();
    expect(svg().children.length).toBeGreaterThan(0);
  });

  it('draws a different icon when the name changes', async () => {
    const { fixture, host, svg } = await setup({ name: 'wallet' });
    const wallet = svg().innerHTML;
    host.name.set('card');
    await fixture.whenStable();
    expect(svg().innerHTML).not.toBe(wallet);
  });

  it.each(Object.keys(SKIT_ICONS) as SkitIconName[])('renders "%s"', async (name) => {
    const { svg } = await setup({ name });
    expect(svg().children.length).toBeGreaterThan(0);
  });

  it('sets an explicit display on the host element', async () => {
    const { icon } = await setup();
    expect(getComputedStyle(icon).display).toBe('inline-flex');
  });

  describe('accessibility', () => {
    it('is decorative by default: hidden from screen readers, no role, no name', async () => {
      const { icon } = await setup();
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.hasAttribute('role')).toBe(false);
      expect(icon.hasAttribute('aria-label')).toBe(false);
    });

    it('becomes an image with an accessible name when given a label', async () => {
      const { icon } = await setup({ label: 'Card frozen' });
      expect(icon.getAttribute('role')).toBe('img');
      expect(icon.getAttribute('aria-label')).toBe('Card frozen');
      expect(icon.hasAttribute('aria-hidden')).toBe(false);
    });

    it('keeps the inner svg hidden and out of the tab order', async () => {
      const { svg } = await setup({ label: 'Card frozen' });
      expect(svg().getAttribute('aria-hidden')).toBe('true');
      expect(svg().getAttribute('focusable')).toBe('false');
    });
  });

  it('defaults to md', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    const icon = (fixture.nativeElement as HTMLElement).querySelector('skit-icon') as HTMLElement;
    expect(icon.getAttribute('data-size')).toBe('md');
  });

  it.each<SkitIconSize>(['sm', 'md', 'lg'])('applies the %s size', async (size) => {
    const { icon } = await setup({ size });
    expect(icon.getAttribute('data-size')).toBe(size);
  });
});
