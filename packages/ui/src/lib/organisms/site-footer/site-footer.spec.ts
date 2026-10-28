import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitInsuredNotice } from '../../molecules/insured-notice/insured-notice';
import { SkitSiteFooter } from './site-footer';

@Component({
  imports: [SkitSiteFooter, SkitInsuredNotice],
  template: `
    <skit-site-footer>
      <a slot="links" href="/privacy">Privacy</a>
      <a slot="links" href="/accessibility">Accessibility</a>
      <skit-insured-notice slot="notice" variant="short" />
      <p>Equal Housing Lender</p>
      <p>Routing number 000000000</p>
    </skit-site-footer>
  `,
})
class Host {}

@Component({
  imports: [SkitSiteFooter],
  template: `<skit-site-footer linksLabel="Footer links"><a slot="links" href="/help">Help</a></skit-site-footer>`,
})
class LinksOnlyHost {}

async function setup<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('skit-site-footer') as HTMLElement;
}

describe('SkitSiteFooter', () => {
  it('puts the links inside a labelled navigation', async () => {
    const footer = await setup(Host);
    const nav = footer.querySelector('nav') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Legal and help');
    expect(Array.from(nav.querySelectorAll('a')).map((a) => a.textContent)).toEqual(['Privacy', 'Accessibility']);
  });

  it('takes a custom navigation label', async () => {
    const footer = await setup(LinksOnlyHost);
    expect(footer.querySelector('nav')?.getAttribute('aria-label')).toBe('Footer links');
  });

  it('places the insurance notice and the legal lines', async () => {
    const footer = await setup(Host);
    expect(footer.querySelector('.notice skit-insured-notice')).not.toBeNull();
    expect(Array.from(footer.querySelectorAll('.legal p')).map((p) => p.textContent)).toEqual([
      'Equal Housing Lender',
      'Routing number 000000000',
    ]);
  });

  it('adds no footer landmark of its own', async () => {
    const footer = await setup(Host);
    expect(footer.querySelector('footer')).toBeNull();
    expect(footer.hasAttribute('role')).toBe(false);
  });

  it('hides the notice and legal areas when empty', async () => {
    const footer = await setup(LinksOnlyHost);
    expect(getComputedStyle(footer.querySelector('.notice') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(footer.querySelector('.legal') as HTMLElement).display).toBe('none');
  });

  it('sets an explicit display on the host element', async () => {
    const footer = await setup(Host);
    expect(getComputedStyle(footer).display).toBe('flex');
  });
});
