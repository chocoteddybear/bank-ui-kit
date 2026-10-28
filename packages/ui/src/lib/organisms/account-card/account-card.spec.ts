import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitBadge } from '../../atoms/badge/badge';
import { SkitAccountCard, skitLastFour } from './account-card';

@Component({
  imports: [SkitAccountCard, SkitBadge],
  template: `
    <skit-account-card
      name="Everyday Checking"
      number="0001 2345 4821"
      balance="4210.55"
      currency="USD"
      [projectedBalance]="projected()"
      [loading]="loading()"
    >
      <skit-badge tone="primary">Primary</skit-badge>
    </skit-account-card>
  `,
})
class Host {
  readonly projected = signal<string | undefined>(undefined);
  readonly loading = signal(false);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const card = (fixture.nativeElement as HTMLElement).querySelector('skit-account-card') as HTMLElement;
  return { fixture, card, host: fixture.componentInstance };
}

describe('skitLastFour', () => {
  it.each([
    ['0001 2345 4821', '4821'],
    ['•••• 1190', '1190'],
    ['12', '12'],
  ])('%s → %s', (input, expected) => {
    expect(skitLastFour(input)).toBe(expected);
  });
});

describe('SkitAccountCard', () => {
  it('is a group named after the account', async () => {
    const { card } = await setup();
    expect(card.getAttribute('role')).toBe('group');
    expect(card.getAttribute('aria-label')).toBe('Everyday Checking');
  });

  it('shows only the last four digits, spoken as "ending in"', async () => {
    const { card } = await setup();
    const number = card.querySelector('.number') as HTMLElement;
    expect(card.textContent).not.toContain('2345');
    expect(number.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('•• 4821');
    expect(number.querySelector('.visually-hidden')?.textContent?.trim()).toBe('ending in 4821');
  });

  it('shows the balance as an amount in the account currency, without a plus sign', async () => {
    const { card } = await setup();
    const amount = card.querySelector('.balance skit-amount [aria-hidden="true"]') as HTMLElement;
    expect(amount.textContent).toBe('$4,210.55');
  });

  it('projects a badge into the header', async () => {
    const { card } = await setup();
    expect(card.querySelector('.header skit-badge')?.textContent?.trim()).toBe('Primary');
  });

  it('previews the balance after a pending change only when given', async () => {
    const { fixture, card, host } = await setup();
    expect(card.querySelector('.projected')).toBeNull();
    host.projected.set('3710.55');
    await fixture.whenStable();
    expect(card.querySelector('.projected')?.textContent).toContain('3,710.55');
  });

  it('shows skeletons and is busy while loading', async () => {
    const { fixture, card, host } = await setup();
    host.loading.set(true);
    await fixture.whenStable();
    expect(card.getAttribute('aria-busy')).toBe('true');
    expect(card.getAttribute('aria-label')).toBe('Loading account');
    expect(card.querySelectorAll('skit-skeleton').length).toBeGreaterThan(0);
    expect(card.querySelector('skit-amount')).toBeNull();
    expect(card.querySelector('skit-badge')).toBeNull();
  });

  it('is not busy once loaded', async () => {
    const { card } = await setup();
    expect(card.hasAttribute('aria-busy')).toBe(false);
    expect(card.querySelector('skit-skeleton')).toBeNull();
  });

  it('sets an explicit display on the host element', async () => {
    const { card } = await setup();
    expect(getComputedStyle(card).display).toBe('flex');
  });
});
