import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitSpinner, SkitSpinnerSize } from './spinner';

@Component({
  imports: [SkitSpinner],
  template: `<skit-spinner [size]="size()" [label]="label()" />`,
})
class Host {
  readonly size = signal<SkitSpinnerSize>('md');
  readonly label = signal('Loading transactions');
}

@Component({
  imports: [SkitSpinner],
  template: `<skit-spinner />`,
})
class DefaultsHost {}

async function setup() {
  const announce = vi.fn().mockResolvedValue(undefined);
  TestBed.configureTestingModule({ providers: [{ provide: LiveAnnouncer, useValue: { announce } }] });
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const spinner = (fixture.nativeElement as HTMLElement).querySelector('skit-spinner') as HTMLElement;
  return { fixture, host: fixture.componentInstance, spinner, announce };
}

describe('SkitSpinner', () => {
  it('is a status region', async () => {
    const { spinner } = await setup();
    expect(spinner.getAttribute('role')).toBe('status');
  });

  it('contains the label as text for screen readers', async () => {
    const { spinner } = await setup();
    expect(spinner.textContent?.trim()).toBe('Loading transactions');
  });

  it('hides the visual ring from screen readers', async () => {
    const { spinner } = await setup();
    expect(spinner.querySelector('.ring')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('announces the label politely when it appears', async () => {
    const { announce } = await setup();
    expect(announce).toHaveBeenCalledWith('Loading transactions', 'polite');
  });

  it('announces again when the label changes', async () => {
    const { fixture, host, announce } = await setup();
    host.label.set('Almost done');
    await fixture.whenStable();
    expect(announce).toHaveBeenLastCalledWith('Almost done', 'polite');
  });

  it('defaults to "Loading" and md', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    const spinner = (fixture.nativeElement as HTMLElement).querySelector('skit-spinner') as HTMLElement;
    expect(spinner.textContent?.trim()).toBe('Loading');
    expect(spinner.getAttribute('data-size')).toBe('md');
  });

  it.each<SkitSpinnerSize>(['sm', 'md', 'lg'])('applies the %s size', async (size) => {
    const { fixture, host, spinner } = await setup();
    host.size.set(size);
    await fixture.whenStable();
    expect(spinner.getAttribute('data-size')).toBe(size);
  });

  it('sets an explicit display on the host element', async () => {
    const { spinner } = await setup();
    expect(getComputedStyle(spinner).display).toBe('inline-flex');
  });
});
