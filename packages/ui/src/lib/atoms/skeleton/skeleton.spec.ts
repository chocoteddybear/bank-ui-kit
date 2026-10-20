import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkitSkeleton, SkitSkeletonLength, SkitSkeletonShape } from './skeleton';

@Component({
  imports: [SkitSkeleton],
  template: `<skit-skeleton [shape]="shape()" [width]="width()" [height]="height()" />`,
})
class Host {
  readonly shape = signal<SkitSkeletonShape>('text');
  readonly width = signal<SkitSkeletonLength | undefined>(undefined);
  readonly height = signal<SkitSkeletonLength | undefined>(undefined);
}

@Component({
  imports: [SkitSkeleton],
  template: `<skit-skeleton />`,
})
class DefaultsHost {}

async function setup(inputs: { shape?: SkitSkeletonShape; width?: SkitSkeletonLength; height?: SkitSkeletonLength } = {}) {
  const fixture = TestBed.createComponent(Host);
  const host = fixture.componentInstance;
  if (inputs.shape) host.shape.set(inputs.shape);
  if (inputs.width !== undefined) host.width.set(inputs.width);
  if (inputs.height !== undefined) host.height.set(inputs.height);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('skit-skeleton') as HTMLElement;
}

describe('SkitSkeleton', () => {
  it('is hidden from screen readers', async () => {
    const skeleton = await setup();
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults to the text shape with no inline size', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    const skeleton = (fixture.nativeElement as HTMLElement).querySelector('skit-skeleton') as HTMLElement;
    expect(skeleton.getAttribute('data-shape')).toBe('text');
    expect(skeleton.style.width).toBe('');
    expect(skeleton.style.height).toBe('');
  });

  it.each<SkitSkeletonShape>(['text', 'rect', 'circle'])('applies the %s shape', async (shape) => {
    const skeleton = await setup({ shape });
    expect(skeleton.getAttribute('data-shape')).toBe(shape);
  });

  it('treats numbers as pixels', async () => {
    const skeleton = await setup({ width: 120, height: 16 });
    expect(skeleton.style.width).toBe('120px');
    expect(skeleton.style.height).toBe('16px');
  });

  it('passes CSS lengths through', async () => {
    const skeleton = await setup({ width: '60%', height: '2rem' });
    expect(skeleton.style.width).toBe('60%');
    expect(skeleton.style.height).toBe('2rem');
  });

  it('sets an explicit display on the host element', async () => {
    const skeleton = await setup();
    expect(getComputedStyle(skeleton).display).toBe('block');
  });
});
