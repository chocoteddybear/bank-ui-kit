import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitMoneyFlow, SkitMoneyFlowState } from './money-flow';

@Component({
  imports: [SkitMoneyFlow],
  template: `
    <skit-money-flow [amount]="amount()" currency="USD" [state]="state()">
      <div slot="from">Checking</div>
      <div slot="to">Savings</div>
    </skit-money-flow>
  `,
})
class Host {
  readonly amount = signal<string | null>('500.00');
  readonly state = signal<SkitMoneyFlowState>('idle');
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const flow = (fixture.nativeElement as HTMLElement).querySelector('skit-money-flow') as HTMLElement;
  return { fixture, flow, host: fixture.componentInstance };
}

describe('SkitMoneyFlow', () => {
  it('places "from" before the amount and "to" after it', async () => {
    const { flow } = await setup();
    const [from, to] = Array.from(flow.querySelectorAll('.end'));
    expect(from.textContent).toContain('From');
    expect(from.textContent).toContain('Checking');
    expect(to.textContent).toContain('To');
    expect(to.textContent).toContain('Savings');
    expect(flow.querySelector('.connector')?.previousElementSibling).toBe(from);
  });

  it('shows the amount on the way', async () => {
    const { flow } = await setup();
    expect(flow.querySelector('.pill skit-amount [aria-hidden="true"]')?.textContent).toBe('$500.00');
  });

  it('shows the empty text without an amount', async () => {
    const { fixture, flow, host } = await setup();
    for (const empty of [null, '']) {
      host.amount.set(empty);
      await fixture.whenStable();
      expect(flow.querySelector('.pill skit-amount')).toBeNull();
      expect(flow.querySelector('.empty')?.textContent).toBe('Enter an amount');
    }
  });

  it('is a labelled group', async () => {
    const { flow } = await setup();
    expect(flow.getAttribute('role')).toBe('group');
    expect(flow.getAttribute('aria-label')).toBe('Transfer preview');
  });

  it('is busy only while sending', async () => {
    const { fixture, flow, host } = await setup();
    expect(flow.hasAttribute('aria-busy')).toBe(false);
    host.state.set('sending');
    await fixture.whenStable();
    expect(flow.getAttribute('aria-busy')).toBe('true');
    expect(flow.getAttribute('data-state')).toBe('sending');
    host.state.set('done');
    await fixture.whenStable();
    expect(flow.hasAttribute('aria-busy')).toBe(false);
  });

  it('swaps the arrow for a check when done', async () => {
    const { fixture, flow, host } = await setup();
    const icon = () => flow.querySelector('.pill skit-icon svg')?.innerHTML;
    const arrow = icon();
    host.state.set('done');
    await fixture.whenStable();
    expect(icon()).not.toBe(arrow);
  });

  it('hides the animated track from screen readers', async () => {
    const { flow } = await setup();
    expect(flow.querySelector('.track')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('sets an explicit display on the host element', async () => {
    const { flow } = await setup();
    expect(getComputedStyle(flow).display).toBe('flex');
  });
});
