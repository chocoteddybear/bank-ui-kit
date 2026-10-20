import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { SKIT_ICONS, SkitIconName } from './icons';

export type SkitIconSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'skit-icon',
  imports: [LucideDynamicIcon],
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
})
export class SkitIcon {
  readonly name = input.required<SkitIconName>();
  readonly size = input<SkitIconSize>('md');
  /** Set it when the icon carries meaning on its own. Without it the icon is decorative and hidden from screen readers. */
  readonly label = input<string>();

  protected readonly data = computed(() => SKIT_ICONS[this.name()]);
}
