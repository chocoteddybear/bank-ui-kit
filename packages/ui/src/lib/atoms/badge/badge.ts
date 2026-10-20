import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SkitBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'skit-badge',
  template: '<ng-content />',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
  },
})
export class SkitBadge {
  readonly tone = input<SkitBadgeTone>('neutral');
}
