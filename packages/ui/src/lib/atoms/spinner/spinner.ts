import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';

export type SkitSpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'skit-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    '[attr.data-size]': 'size()',
  },
})
export class SkitSpinner {
  readonly size = input<SkitSpinnerSize>('md');
  /** What is loading, read by screen readers. Be specific: "Loading transactions". */
  readonly label = input('Loading');

  constructor() {
    // A role="status" region that appears with its text already inside is often not announced,
    // so the label is also sent through the CDK announcer, once on appear and on every change.
    const announcer = inject(LiveAnnouncer);
    effect(() => {
      announcer.announce(this.label(), 'polite');
    });
  }
}
