import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SkitSkeletonShape = 'text' | 'rect' | 'circle';
/** A number means pixels; a string is any CSS length ("100%", "12rem"). */
export type SkitSkeletonLength = number | string;

const toLength = (value: SkitSkeletonLength | undefined): string | null =>
  value === undefined ? null : typeof value === 'number' ? `${value}px` : value;

@Component({
  selector: 'skit-skeleton',
  template: '',
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Purely visual: the loading state is announced by the container (aria-busy) or a skit-spinner.
    'aria-hidden': 'true',
    '[attr.data-shape]': 'shape()',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
  },
})
export class SkitSkeleton {
  readonly shape = input<SkitSkeletonShape>('text');
  readonly width = input<string | null, SkitSkeletonLength | undefined>(null, { transform: toLength });
  readonly height = input<string | null, SkitSkeletonLength | undefined>(null, { transform: toLength });
}
