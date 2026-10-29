import { Injectable, signal } from '@angular/core';
import type { SkitBadgeTone, SkitIconName } from '@vladlev/skit';
import { Cents, isoDate } from './money';

export interface Account {
  id: string;
  name: string;
  /** Fits a phone-width select next to the last four digits; the full name shows on cards and receipts. */
  shortName: string;
  number: string;
  icon: SkitIconName;
  balance: Cents;
  /** Savings withdrawals may be limited by the account agreement, which the review step discloses. */
  savings: boolean;
  badge?: { text: string; tone: SkitBadgeTone };
}

export type Frequency = 'once' | 'monthly';

export interface TransferRequest {
  fromId: string;
  toId: string;
  amount: Cents;
  date: string;
  frequency: Frequency;
  memo: string;
  emailReceipt: boolean;
}

export interface TransferReceipt extends TransferRequest {
  confirmation: string;
  status: 'completed' | 'scheduled';
}

const ACCOUNTS: Account[] = [
  {
    id: 'checking',
    name: 'Free Active Duty Checking',
    shortName: 'Active Duty Checking',
    number: '7012 4455 4821',
    icon: 'bank',
    balance: 421055,
    savings: false,
    badge: { text: 'Primary', tone: 'primary' },
  },
  { id: 'savings', name: 'Share Savings', shortName: 'Share Savings', number: '7012 4455 1190', icon: 'piggy-bank', balance: 1285000, savings: true },
  { id: 'money-market', name: 'Money Market Savings', shortName: 'Money Market', number: '7012 4455 3307', icon: 'coins', balance: 2604218, savings: true },
  {
    id: 'mil-savings',
    name: 'SaveFirst Account',
    shortName: 'SaveFirst',
    number: '7012 4455 6652',
    icon: 'wallet',
    balance: 87500,
    savings: true,
    badge: { text: 'Goal', tone: 'info' },
  },
];

/** Mock back end: data state lives here and in the page, never in the kit's components. */
@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly store = signal<Account[]>(ACCOUNTS);
  readonly accounts = this.store.asReadonly();
  readonly loading = signal(true);

  constructor() {
    setTimeout(() => this.loading.set(false), 700);
  }

  find(id: string): Account | undefined {
    return this.store().find((account) => account.id === id);
  }

  async send(request: TransferRequest): Promise<TransferReceipt> {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const now = request.date <= isoDate();
    if (now) {
      this.store.update((accounts) =>
        accounts.map((account) =>
          account.id === request.fromId
            ? { ...account, balance: account.balance - request.amount }
            : account.id === request.toId
              ? { ...account, balance: account.balance + request.amount }
              : account,
        ),
      );
    }
    return {
      ...request,
      confirmation: `NF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: now ? 'completed' : 'scheduled',
    };
  }
}
