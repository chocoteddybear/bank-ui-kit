import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { SkitFormControlBase } from '../shared/form-control-base';

/**
 * One option of a radio group. Give every radio of a group the same `name` and the same form control
 * (formControlName or ngModel): the control holds the `value` of the checked radio. The browser then
 * provides arrow-key navigation inside the group.
 */
@Component({
  selector: 'skit-radio',
  templateUrl: './radio.html',
  styleUrls: ['../shared/choice.css', './radio.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.value]': 'null',
  },
})
export class SkitRadio extends SkitFormControlBase<string | null> {
  /** The value the group's control takes when this radio is chosen. */
  readonly value = input.required<string>();

  protected readonly model = signal<string | null>(null);
  protected readonly checked = computed(() => this.model() === this.value());

  protected toValue(raw: unknown): string | null {
    return raw === null || raw === undefined ? null : String(raw);
  }

  protected onSelect(): void {
    this.commit(this.value());
  }

  protected onBlur(): void {
    this.touch();
  }
}
