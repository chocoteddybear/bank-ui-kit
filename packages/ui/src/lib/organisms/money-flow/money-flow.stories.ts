import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitAccountCard } from '../account-card/account-card';
import { SkitMoneyFlow } from './money-flow';

const meta: Meta<SkitMoneyFlow> = {
  title: 'Organisms/Money flow',
  component: SkitMoneyFlow,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitMoneyFlow, SkitAccountCard] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-money-flow>` pictures a transfer: the `slot="from"` content, the amount on the way, the `slot="to"` ' +
          'content (usually two `<skit-account-card>`s). `state="sending"` animates the line and sets `aria-busy`; ' +
          'the animation stops under reduced motion. Display only: the page runs the transfer.',
      },
    },
  },
  argTypes: { state: { control: 'inline-radio', options: ['idle', 'sending', 'done'] } },
  args: { amount: '500.00', currency: 'USD', state: 'idle' },
};
export default meta;

type Story = StoryObj<SkitMoneyFlow>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-sm skit:bg-background skit:p-8">
        <skit-money-flow [amount]="amount" [currency]="currency" [state]="state">
          <skit-account-card slot="from" name="Everyday Checking" number="4821" balance="4210.55" currency="USD"
            projectedBalance="3710.55" />
          <skit-account-card slot="to" name="Share Savings" number="1190" balance="12850.00" currency="USD"
            icon="piggy-bank" projectedBalance="13350.00" />
        </skit-money-flow>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, states: ['idle', 'sending', 'done'] },
    template: inBothModes(`
      <div class="skit:grid skit:gap-6 skit:md:grid-cols-3">
        @for (state of states; track state) {
          <skit-money-flow [amount]="state === 'idle' ? '' : '500.00'" currency="USD" [state]="state">
            <skit-account-card slot="from" name="Checking" number="4821" balance="4210.55" currency="USD" />
            <skit-account-card slot="to" name="Savings" number="1190" balance="12850.00" currency="USD" icon="piggy-bank" />
          </skit-money-flow>
        }
      </div>
    `),
  }),
};
