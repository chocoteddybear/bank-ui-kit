import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitDetailList, SkitDetailRow } from './detail-list';

@Component({
  imports: [SkitDetailList, SkitDetailRow],
  template: `
    <skit-detail-list>
      <skit-detail-row label="From">Checking ·· 4821</skit-detail-row>
      <skit-detail-row label="Memo">Rent, November</skit-detail-row>
    </skit-detail-list>
  `,
})
class Host {}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  return {
    list: element.querySelector('skit-detail-list') as HTMLElement,
    rows: Array.from(element.querySelectorAll('skit-detail-row')) as HTMLElement[],
  };
}

describe('SkitDetailList', () => {
  it('is a list of list items', async () => {
    const { list, rows } = await setup();
    expect(list.getAttribute('role')).toBe('list');
    expect(rows.map((row) => row.getAttribute('role'))).toEqual(['listitem', 'listitem']);
  });

  it('shows each label next to its projected value', async () => {
    const { rows } = await setup();
    expect(rows[0].querySelector('.label')?.textContent).toBe('From');
    expect(rows[0].querySelector('.value')?.textContent?.trim()).toBe('Checking ·· 4821');
    expect(rows[1].querySelector('.label')?.textContent).toBe('Memo');
  });

  it('reads the label before the value', async () => {
    const { rows } = await setup();
    expect(rows[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('FromChecking ·· 4821');
  });

  it('sets an explicit display on the host elements', async () => {
    const { list, rows } = await setup();
    expect(getComputedStyle(list).display).toBe('flex');
    expect(getComputedStyle(rows[0]).display).toBe('flex');
  });
});
