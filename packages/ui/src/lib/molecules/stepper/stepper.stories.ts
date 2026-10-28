import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitStepper } from './stepper';

const meta: Meta<SkitStepper> = {
  title: 'Molecules/Stepper',
  component: SkitStepper,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitStepper] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-stepper>` shows progress through a flow: done steps get a check, the current one ' +
          '`aria-current="step"`. Set `current` to `steps.length` when the flow is finished: every step, the last ' +
          'one too, gets a check. Display only, the page owns navigation. In narrow containers only the ' +
          'current label stays visible, or the last one when finished (all labels are still read by screen readers).',
      },
    },
  },
  argTypes: { current: { control: { type: 'range', min: 0, max: 4 } } },
  args: { steps: ['Details', 'Review', 'Sending', 'Done'], current: 1 },
};
export default meta;

type Story = StoryObj<SkitStepper>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-xl skit:bg-background skit:p-8">
        <skit-stepper [steps]="steps" [current]="current" />
      </div>
    `,
  }),
};

export const Progress: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, steps: ['Details', 'Review', 'Sending', 'Done'] },
    template: inBothModes(`
      <div class="skit:flex skit:flex-col skit:gap-6">
        @for (current of [0, 1, 2, 3, 4]; track current) {
          <skit-stepper [steps]="steps" [current]="current" />
        }
        <div class="skit:max-w-xs"><skit-stepper [steps]="steps" [current]="1" /></div>
        <div class="skit:max-w-xs"><skit-stepper [steps]="steps" [current]="4" /></div>
      </div>
    `),
  }),
};
