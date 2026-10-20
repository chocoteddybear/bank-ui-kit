import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SkitFormControlBase } from '../shared/form-control-base';

/** An on/off setting that applies immediately (e.g. "Freeze card"). For choices submitted with a form, prefer skit-checkbox. */
@Component({
  selector: 'skit-switch',
  templateUrl: './switch.html',
  styleUrls: ['../shared/choice.css', './switch.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkitSwitch extends SkitFormControlBase<boolean> {
  protected readonly model = signal(false);

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
