import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { SkitIcon } from '../../atoms/icon/icon';

/** Where the user is in a multi-step flow. Display only: the page owns navigation between steps. */
@Component({
  selector: 'skit-stepper',
  imports: [SkitIcon],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkitStepper {
  readonly steps = input.required<readonly string[]>();
  /** Zero-based index of the current step. Steps before it are done; `steps.length` marks the whole flow finished. */
  readonly current = input(0, { transform: numberAttribute });
}
