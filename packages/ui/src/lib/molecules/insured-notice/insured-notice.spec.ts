import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitInsuredNotice, SkitInsuredNoticeVariant, SkitInsurer } from './insured-notice';

@Component({
  imports: [SkitInsuredNotice],
  template: `<skit-insured-notice [insurer]="insurer()" [variant]="variant()" />`,
})
class Host {
  readonly insurer = signal<SkitInsurer>('ncua');
  readonly variant = signal<SkitInsuredNoticeVariant>('full');
}

@Component({
  imports: [SkitInsuredNotice],
  template: `<skit-insured-notice />`,
})
class DefaultsHost {}

async function setup(insurer: SkitInsurer, variant: SkitInsuredNoticeVariant) {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.insurer.set(insurer);
  fixture.componentInstance.variant.set(variant);
  await fixture.whenStable();
  const notice = (fixture.nativeElement as HTMLElement).querySelector('skit-insured-notice') as HTMLElement;
  const parts = () => Array.from(notice.querySelectorAll('.text span'));
  return {
    notice,
    text: () =>
      parts().length
        ? parts().map((span) => span.textContent?.trim()).join(' ')
        : notice.querySelector('.text')?.textContent?.trim(),
  };
}

describe('SkitInsuredNotice', () => {
  it('defaults to the full NCUA notice', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    const notice = (fixture.nativeElement as HTMLElement).querySelector('skit-insured-notice') as HTMLElement;
    expect(notice.getAttribute('data-variant')).toBe('full');
    expect(notice.textContent).toContain('National Credit Union Administration, a U.S. Government Agency');
  });

  it.each<[SkitInsurer, SkitInsuredNoticeVariant, string]>([
    [
      'ncua',
      'full',
      'Your savings federally insured to at least $250,000 and backed by the full faith and credit of the United States Government. National Credit Union Administration, a U.S. Government Agency',
    ],
    ['ncua', 'short', 'Federally insured by NCUA'],
    [
      'fdic',
      'full',
      'FDIC-Insured - Backed by the full faith and credit of the U.S. Government Federal Deposit Insurance Corporation',
    ],
    ['fdic', 'short', 'Member FDIC'],
  ])('%s %s reads the official wording', async (insurer, variant, expected) => {
    const { text } = await setup(insurer, variant);
    expect(text()).toBe(expected);
  });

  it('is plain text: a paragraph, with the shield icon hidden from screen readers', async () => {
    const { notice } = await setup('ncua', 'full');
    expect(notice.querySelector('p')).not.toBeNull();
    expect(notice.querySelector('skit-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('sets an explicit display on the host element', async () => {
    const { notice } = await setup('ncua', 'short');
    expect(getComputedStyle(notice).display).toBe('flex');
  });
});
