import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitAlert, SkitAlertTone } from './alert';

@Component({
  imports: [SkitAlert],
  template: `<skit-alert [tone]="tone()" [title]="title()">Your transfer was sent.</skit-alert>`,
})
class Host {
  readonly tone = signal<SkitAlertTone>('info');
  readonly title = signal<string | undefined>('Transfer complete');
}

@Component({
  imports: [SkitAlert],
  template: `<skit-alert>Heads up</skit-alert>`,
})
class DefaultsHost {}

async function setup(tone?: SkitAlertTone) {
  const fixture = TestBed.createComponent(Host);
  if (tone) fixture.componentInstance.tone.set(tone);
  await fixture.whenStable();
  const alert = (fixture.nativeElement as HTMLElement).querySelector('skit-alert') as HTMLElement;
  return { fixture, alert, host: fixture.componentInstance };
}

describe('SkitAlert', () => {
  it('shows the title and the projected message', async () => {
    const { alert } = await setup();
    expect(alert.querySelector('.title')?.textContent?.trim()).toBe('Transfer complete');
    expect(alert.querySelector('.body')?.textContent?.trim()).toBe('Your transfer was sent.');
  });

  it('renders no title element without a title', async () => {
    const { fixture, alert, host } = await setup();
    host.title.set(undefined);
    await fixture.whenStable();
    expect(alert.querySelector('.title')).toBeNull();
  });

  it('defaults to the info tone', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('skit-alert') as HTMLElement;
    expect(alert.getAttribute('data-tone')).toBe('info');
  });

  it.each<[SkitAlertTone, string]>([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'status'],
    ['danger', 'alert'],
  ])('%s uses role="%s"', async (tone, role) => {
    const { alert } = await setup(tone);
    expect(alert.getAttribute('data-tone')).toBe(tone);
    expect(alert.getAttribute('role')).toBe(role);
  });

  it('keeps the icon decorative', async () => {
    const { alert } = await setup('success');
    expect(alert.querySelector('skit-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses a different icon per tone', async () => {
    const paths = new Set<string>();
    for (const tone of ['info', 'success', 'warning', 'danger'] as const) {
      const { alert } = await setup(tone);
      paths.add(alert.querySelector('skit-icon svg')?.innerHTML ?? '');
    }
    expect(paths.size).toBe(4);
  });

  it('sets an explicit display on the host element', async () => {
    const { alert } = await setup();
    expect(getComputedStyle(alert).display).toBe('flex');
  });
});
