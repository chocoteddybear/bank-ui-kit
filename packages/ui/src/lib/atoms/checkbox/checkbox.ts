import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { SKIT_ICONS } from '../icon/icons';
import { SkitFormControlBase } from '../shared/form-control-base';

/**
 * A checkbox bound to a boolean. For "must be checked" (accept terms), use Validators.requiredTrue on the
 * control: Angular's plain required validator treats false as a valid value.
 */
@Component({
  selector: 'skit-checkbox',
  imports: [LucideDynamicIcon],
  templateUrl: './checkbox.html',
  styleUrls: ['../shared/choice.css', './checkbox.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkitCheckbox extends SkitFormControlBase<boolean> {
  protected readonly model = signal(false);
  protected readonly checkIcon = SKIT_ICONS.check;

  protected toValue(raw: unknown): boolean {
    return raw === true;
  }

  protected onToggle(event: Event): void {
    this.commit((event.target as HTMLInputElement).checked);
  }

  protected onBlur(): void {
    this.touch();
  }
}
