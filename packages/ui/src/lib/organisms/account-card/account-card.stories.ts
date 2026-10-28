import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitBadge } from '../../atoms/badge/badge';
import { SkitAccountCard } from './account-card';

const meta: Meta<SkitAccountCard> = {
  title: 'Organisms/Account card',
  component: SkitAccountCard,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitAccountCard, SkitBadge] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-account-card>` shows one account: name and masked number on the left of the header, an optional ' +
          'projected `<skit-badge>` on the right, then the balance. Only the last four digits are rendered. ' +
          '`projectedBalance` previews the balance after a pending change; `loading` shows skeletons.',
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: ['bank', 'wallet', 'piggy-bank', 'card', 'coins'] },
    loading: { control: 'boolean' },
  },
  args: {
    name: 'Everyday Checking',
    number: '0001 2345 4821',
    balance: '4210.55',
    currency: 'USD',
    icon: 'bank',
    loading: false,
  },
};
export default meta;

type Story = StoryObj<SkitAccountCard>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-sm skit:bg-background skit:p-8">
        <skit-account-card [name]="name" [number]="number" [balance]="balance" [currency]="currency"
          [icon]="icon" [projectedBalance]="projectedBalance" [loading]="loading" />
      </div>
    `,
  }),
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:max-w-sm skit:flex-col skit:gap-4">
        <skit-account-card name="Everyday Checking" number="0001 2345 4821" balance="4210.55" currency="USD">
          <skit-badge tone="primary">Primary</skit-badge>
        </skit-account-card>
        <skit-account-card name="Share Savings" number="0001 9876 1190" balance="12850.00" currency="USD"
          icon="piggy-bank" projectedBalance="13350.00" />
        <skit-account-card name="Credit Card" number="4111 1111 1111 9031" balance="-842.17" currency="USD"
          icon="card" balanceLabel="Current balance">
          <skit-badge tone="warning">Due Nov 5</skit-badge>
        </skit-account-card>
        <skit-account-card name="" number="" currency="USD" loading />
      </div>
    `),
  }),
};
