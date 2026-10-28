import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkitAmount, SkitAmountValue } from '../../atoms/amount/amount';
import { SkitIcon } from '../../atoms/icon/icon';

export type SkitMoneyFlowState = 'idle' | 'sending' | 'done';

/**
 * A picture of money moving between two accounts: the "from" slot, the amount on the way, the "to" slot.
 * Usually holds two skit-account-cards. It only shows a state; the page runs the transfer.
 */
@Component({
  selector: 'skit-money-flow',
  imports: [SkitAmount, SkitIcon],
  templateUrl: './money-flow.html',
  styleUrl: './money-flow.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
    '[attr.aria-busy]': 'state() === "sending" ? "true" : null',
    '[attr.data-state]': 'state()',
  },
})
export class SkitMoneyFlow {
  /** Empty or missing while the user hasn't entered a valid amount yet. */
  readonly amount = input<SkitAmountValue | null>();
  readonly currency = input.required<string>();
  readonly state = input<SkitMoneyFlowState>('idle');
  readonly label = input('Transfer preview');
  readonly fromLabel = input('From');
  readonly toLabel = input('To');
  readonly emptyText = input('Enter an amount');

  protected readonly hasAmount = computed(() => {
    const amount = this.amount();
    return amount !== null && amount !== undefined && amount !== '';
  });
}
