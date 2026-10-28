import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitAlert } from './alert';

type AlertArgs = SkitAlert & { message: string };

const meta: Meta<AlertArgs> = {
  title: 'Molecules/Alert',
  component: SkitAlert,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitAlert] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-alert>` is a tinted message with a tone icon and an optional title. `danger` renders `role="alert"` ' +
          'and interrupts screen readers, so keep it for real problems; the other tones are a polite `role="status"`.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    title: { control: 'text' },
    message: { control: 'text', description: 'Projected content (not an input)' },
  },
  args: { tone: 'info', title: 'Scheduled', message: 'This transfer will be sent on Nov 3.' } as Partial<AlertArgs>,
};
export default meta;

type Story = StoryObj<AlertArgs>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-md skit:bg-background skit:p-8">
        <skit-alert [tone]="tone" [title]="title">{{ message }}</skit-alert>
      </div>
    `,
  }),
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:max-w-md skit:flex-col skit:gap-3">
        <skit-alert title="Scheduled">This transfer will be sent on Nov 3.</skit-alert>
        <skit-alert tone="success" title="Transfer complete">Confirmation number NF-48213.</skit-alert>
        <skit-alert tone="warning" title="Daily limit almost reached">You can send $420.00 more today.</skit-alert>
        <skit-alert tone="danger" title="Insufficient funds">This amount is more than the available balance.</skit-alert>
        <skit-alert>A message without a title.</skit-alert>
      </div>
    `),
  }),
};
