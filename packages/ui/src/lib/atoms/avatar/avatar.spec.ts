import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitAvatar, SkitAvatarSize, skitInitials } from './avatar';

@Component({
  imports: [SkitAvatar],
  template: `<skit-avatar [name]="name()" [src]="src()" [size]="size()" />`,
})
class Host {
  readonly name = signal('Anna Smith');
  readonly src = signal<string | undefined>(undefined);
  readonly size = signal<SkitAvatarSize>('md');
}

async function setup(inputs: { name?: string; src?: string; size?: SkitAvatarSize } = {}) {
  const fixture = TestBed.createComponent(Host);
  const host = fixture.componentInstance;
  if (inputs.name !== undefined) host.name.set(inputs.name);
  if (inputs.src !== undefined) host.src.set(inputs.src);
  if (inputs.size) host.size.set(inputs.size);
  await fixture.whenStable();
  const avatar = (fixture.nativeElement as HTMLElement).querySelector('skit-avatar') as HTMLElement;
  return { fixture, host, avatar };
}

describe('skitInitials', () => {
  it.each([
    ['Anna Smith', 'AS'],
    ['Anna Maria Smith', 'AS'],
    ['anna', 'A'],
    ['  Jean-Luc   Picard  ', 'JP'],
    ['élodie durand', 'ÉD'],
    ['', ''],
  ])('"%s" → "%s"', (name, expected) => {
    expect(skitInitials(name)).toBe(expected);
  });
});

describe('SkitAvatar', () => {
  describe('with an image', () => {
    it('shows the image with the name as alt text', async () => {
      const { avatar } = await setup({ src: 'https://example.test/anna.jpg' });
      const img = avatar.querySelector('img') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('https://example.test/anna.jpg');
      expect(img.alt).toBe('Anna Smith');
      expect(avatar.querySelector('.initials')).toBeNull();
    });

    it('falls back to initials when the image fails to load', async () => {
      const { fixture, avatar } = await setup({ src: 'https://example.test/broken.jpg' });
      avatar.querySelector('img')!.dispatchEvent(new Event('error'));
      await fixture.whenStable();
      expect(avatar.querySelector('img')).toBeNull();
      expect(avatar.querySelector('.initials')?.textContent?.trim()).toBe('AS');
    });

    it('tries again when a new src is set after a failure', async () => {
      const { fixture, host, avatar } = await setup({ src: 'https://example.test/broken.jpg' });
      avatar.querySelector('img')!.dispatchEvent(new Event('error'));
      await fixture.whenStable();
      host.src.set('https://example.test/new.jpg');
      await fixture.whenStable();
      expect(avatar.querySelector('img')?.getAttribute('src')).toBe('https://example.test/new.jpg');
    });
  });

  describe('without an image', () => {
    it('shows the initials', async () => {
      const { avatar } = await setup();
      expect(avatar.querySelector('.initials')?.textContent?.trim()).toBe('AS');
    });

    it('exposes the full name, not the letters, to screen readers', async () => {
      const { avatar } = await setup();
      const initials = avatar.querySelector('.initials') as HTMLElement;
      expect(initials.getAttribute('role')).toBe('img');
      expect(initials.getAttribute('aria-label')).toBe('Anna Smith');
      expect(initials.querySelector('[aria-hidden="true"]')?.textContent).toBe('AS');
    });
  });

  it('defaults to md', async () => {
    const { avatar } = await setup();
    expect(avatar.getAttribute('data-size')).toBe('md');
  });

  it.each<SkitAvatarSize>(['sm', 'md', 'lg'])('applies the %s size', async (size) => {
    const { avatar } = await setup({ size });
    expect(avatar.getAttribute('data-size')).toBe(size);
  });

  it('sets an explicit display on the host element', async () => {
    const { avatar } = await setup();
    expect(getComputedStyle(avatar).display).toBe('inline-flex');
  });
});
