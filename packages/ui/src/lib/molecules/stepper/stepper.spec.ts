import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitStepper } from './stepper';

@Component({
  imports: [SkitStepper],
  template: `<skit-stepper [steps]="steps" [current]="current()" />`,
})
class Host {
  readonly steps = ['Details', 'Review', 'Done'];
  readonly current = signal(1);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    fixture,
    host: fixture.componentInstance,
    stepper: element.querySelector('skit-stepper') as HTMLElement,
    items: () => Array.from(element.querySelectorAll('li')),
  };
}

describe('SkitStepper', () => {
  it('renders an ordered list with one item per step', async () => {
    const { stepper, items } = await setup();
    expect(stepper.querySelector('ol')).not.toBeNull();
    expect(items().map((li) => li.querySelector('.label')?.firstChild?.textContent?.trim())).toEqual([
      'Details',
      'Review',
      'Done',
    ]);
  });

  it('marks only the current step with aria-current="step"', async () => {
    const { items } = await setup();
    expect(items().map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step', null]);
  });

  it('marks earlier steps done, with a check and spoken "(completed)"', async () => {
    const { items } = await setup();
    const [done, current, upcoming] = items();
    expect(done.getAttribute('data-state')).toBe('done');
    expect(done.querySelector('skit-icon')).not.toBeNull();
    expect(done.textContent).toContain('(completed)');
    expect(current.getAttribute('data-state')).toBe('current');
    expect(current.textContent).not.toContain('(completed)');
    expect(upcoming.getAttribute('data-state')).toBe('upcoming');
  });

  it('numbers steps that are not done, and hides the marker from screen readers', async () => {
    const { items } = await setup();
    const marker = items()[2].querySelector('.marker') as HTMLElement;
    expect(marker.textContent?.trim()).toBe('3');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
  });

  it('follows the current input', async () => {
    const { fixture, host, items } = await setup();
    host.current.set(2);
    await fixture.whenStable();
    expect(items().map((li) => li.getAttribute('data-state'))).toEqual(['done', 'done', 'current']);
  });

  it('marks every step done, the last one too, once current is past the end', async () => {
    const { fixture, host, items } = await setup();
    host.current.set(3);
    await fixture.whenStable();
    expect(items().map((li) => li.getAttribute('data-state'))).toEqual(['done', 'done', 'done']);
    expect(items().every((li) => li.querySelector('skit-icon'))).toBe(true);
    expect(items().some((li) => li.hasAttribute('aria-current'))).toBe(false);
  });

  it('sets an explicit display on the host element', async () => {
    const { stepper } = await setup();
    expect(getComputedStyle(stepper).display).toBe('block');
  });
});
