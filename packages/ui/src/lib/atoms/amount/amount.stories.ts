import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitAvatar } from '../avatar/avatar';
import { SkitBadge } from '../badge/badge';
import { SkitAmount } from './amount';

const TRANSACTIONS = [
  { name: 'Salary · Acme Corp', date: '12 Oct', value: '3200.00', status: null },
  { name: 'Whole Foods Market', date: '11 Oct', value: '-84.20', status: null },
  { name: 'Anna Smith', date: '10 Oct', value: '-1250.00', status: 'Pending' },
  { name: 'Refund · Airline', date: '9 Oct', value: '412.75', status: null },
  { name: 'Coffee', date: '9 Oct', value: '-4.5', status: null },
];

const meta: Meta<SkitAmount> = {
  title: 'Atoms/Amount',
  component: SkitAmount,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitAmount, SkitAvatar, SkitBadge] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-amount>` formats money in the app locale and always shows the sign (`+$3,200.00`, `-$84.20`). ' +
          'It is never red or green: direction comes from the sign. Screen readers hear "plus" or "minus" in words. ' +
          'Pass decimal strings ("1234.50") for exact amounts; numbers are limited by floating point.',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    currency: { control: 'inline-radio', options: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { value: '-84.20', currency: 'USD', size: 'md' },
};
export default meta;

type Story = StoryObj<SkitAmount>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="skit-root skit:bg-background skit:p-8"><skit-amount [value]="value" [currency]="currency" [size]="size" /></div>`,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:flex-col skit:gap-3">
        <span><skit-amount value="12480.32" currency="USD" size="lg" /> <small class="skit:text-muted">lg · balance</small></span>
        <span><skit-amount value="-84.20" currency="USD" /> <small class="skit:text-muted">md</small></span>
        <span><skit-amount value="3200" currency="EUR" size="sm" /> <small class="skit:text-muted">sm</small></span>
        <span><skit-amount value="0" currency="USD" /> <small class="skit:text-muted">zero has no sign</small></span>
        <span><skit-amount value="1500" currency="JPY" /> <small class="skit:text-muted">JPY has no decimals</small></span>
      </div>
    `),
  }),
};

export const TransactionList: Story = {
  name: 'In a transaction list',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, transactions: TRANSACTIONS },
    template: inBothModes(`
      <div class="skit:rounded-lg skit:border skit:bg-surface skit:px-4">
        @for (t of transactions; track t.name) {
          <div class="skit:flex skit:items-center skit:gap-3 skit:border-b skit:py-3 skit:last:border-b-0">
            <skit-avatar [name]="t.name" size="sm" />
            <div class="skit:flex skit:flex-1 skit:flex-col">
              <span class="skit:text-body-sm">{{ t.name }}</span>
              <span class="skit:text-caption skit:text-muted">{{ t.date }}</span>
            </div>
            @if (t.status) { <skit-badge tone="warning">{{ t.status }}</skit-badge> }
            <skit-amount [value]="t.value" currency="USD" />
          </div>
        }
      </div>
    `),
  }),
};
