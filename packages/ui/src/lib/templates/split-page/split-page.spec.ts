import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitSplitPage } from './split-page';

@Component({
  imports: [SkitSplitPage],
  template: `
    <skit-split-page>
      <div slot="header">Brand</div>
      <div slot="main">Form</div>
      <div slot="aside">Summary</div>
      <div slot="actions"><button>Continue</button></div>
      <p slot="footer">Legal</p>
    </skit-split-page>
  `,
})
class Host {}

@Component({
  imports: [SkitSplitPage],
  template: `<skit-split-page><div slot="main">Only main</div></skit-split-page>`,
})
class MainOnlyHost {}

async function setup<T>(component: new () => T = Host as new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('skit-split-page') as HTMLElement;
}

describe('SkitSplitPage', () => {
  it.each([
    ['header', 'Brand'],
    ['main', 'Form'],
    ['aside', 'Summary'],
    ['footer', 'Legal'],
  ])('puts slot="%s" into the <%s> landmark', async (landmark, text) => {
    const page = await setup();
    expect(page.querySelector(`:scope > ${landmark}, :scope > .body > ${landmark}`)?.textContent?.trim()).toBe(text);
  });

  it('puts slot="actions" into the actions area', async () => {
    const page = await setup();
    expect(page.querySelector('.body > .actions')?.textContent?.trim()).toBe('Continue');
  });

  it('keeps the reading order main → aside → actions on every screen size', async () => {
    const page = await setup();
    const order = Array.from(page.querySelectorAll('.body > *')).map((el) => el.className);
    expect(order).toEqual(['main', 'aside', 'actions']);
  });

  it('opts the page into kit tag styles with skit-root', async () => {
    const page = await setup();
    expect(page.classList.contains('skit-root')).toBe(true);
  });

  it('hides empty header, footer and actions', async () => {
    const page = await setup(MainOnlyHost);
    expect(getComputedStyle(page.querySelector('header') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(page.querySelector('footer') as HTMLElement).display).toBe('none');
    expect(getComputedStyle(page.querySelector('.actions') as HTMLElement).display).toBe('none');
  });

  it('sets an explicit display on the host element', async () => {
    const page = await setup();
    expect(getComputedStyle(page).display).toBe('flex');
  });
});
