import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkitAmount, SkitAmountValue } from '../../atoms/amount/amount';
import { SkitIcon } from '../../atoms/icon/icon';
import { SkitIconName } from '../../atoms/icon/icons';
import { SkitSkeleton } from '../../atoms/skeleton/skeleton';

/** "0001 2345 4821" → "4821". Only the last four digits are ever shown. */
export function skitLastFour(accountNumber: string): string {
  return accountNumber.replace(/\D/g, '').slice(-4);
}

/**
 * One account: name and masked number on the left of the header, an optional projected skit-badge on the
 * right, then the balance. `projectedBalance` previews the balance after a pending change.
 */
@Component({
  selector: 'skit-account-card',
  imports: [SkitAmount, SkitIcon, SkitSkeleton],
  templateUrl: './account-card.html',
  styleUrl: './account-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': 'loading() ? "Loading account" : name()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class SkitAccountCard {
  readonly name = input.required<string>();
  /** The full or partly masked account number; only the last four digits are rendered. */
  readonly number = input.required<string>();
  readonly balance = input<SkitAmountValue>();
  /** ISO 4217 code, as for skit-amount. */
  readonly currency = input.required<string>();
  readonly icon = input<SkitIconName>('bank');
  /** The balance after a pending change, e.g. while a transfer is being filled in. */
  readonly projectedBalance = input<SkitAmountValue>();
  readonly balanceLabel = input('Available balance');
  /** Shows skeletons in place of the content, e.g. while accounts load. */
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly lastFour = computed(() => skitLastFour(this.number()));
}
