import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkitIcon } from '../../atoms/icon/icon';
import { SkitIconName } from '../../atoms/icon/icons';

export type SkitAlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<SkitAlertTone, SkitIconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'error',
};

@Component({
  selector: 'skit-alert',
  imports: [SkitIcon],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Only real problems interrupt the screen reader; everything else waits its turn.
    '[attr.role]': 'tone() === "danger" ? "alert" : "status"',
    '[attr.data-tone]': 'tone()',
  },
})
export class SkitAlert {
  readonly tone = input<SkitAlertTone>('info');
  readonly title = input<string>();

  protected readonly icon = computed(() => ICONS[this.tone()]);
}
