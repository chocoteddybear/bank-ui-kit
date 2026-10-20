import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitBadge, SkitBadgeTone } from './badge';

@Component({
  imports: [SkitBadge],
  template: `<skit-badge [tone]="tone()">Pending</skit-badge>`,
})
class Host {
  readonly tone = signal<SkitBadgeTone>('neutral');
}

@Component({
  imports: [SkitBadge],
  template: `<skit-badge>Draft</skit-badge>`,
})
class DefaultsHost {}

async function setup(tone?: SkitBadgeTone) {
  const fixture = TestBed.createComponent(Host);
  if (tone) fixture.componentInstance.tone.set(tone);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('skit-badge') as HTMLElement;
}

describe('SkitBadge', () => {
  it('shows the projected text', async () => {
    const badge = await setup();
    expect(badge.textContent?.trim()).toBe('Pending');
  });

  it('defaults to the neutral tone', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    const badge = (fixture.nativeElement as HTMLElement).querySelector('skit-badge') as HTMLElement;
    expect(badge.getAttribute('data-tone')).toBe('neutral');
  });

  it.each<SkitBadgeTone>(['neutral', 'primary', 'success', 'warning', 'danger', 'info'])(
    'applies the %s tone',
    async (tone) => {
      const badge = await setup(tone);
      expect(badge.getAttribute('data-tone')).toBe(tone);
    },
  );

  it('sets an explicit display on the host element', async () => {
    const badge = await setup();
    expect(getComputedStyle(badge).display).toBe('inline-flex');
  });
});
