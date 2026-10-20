import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitIcon } from '../icon/icon';
import { SkitBadge } from './badge';

const TONES = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const;

type BadgeArgs = SkitBadge & { label: string };

const meta: Meta<BadgeArgs> = {
  title: 'Atoms/Badge',
  component: SkitBadge,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitBadge, SkitIcon] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-badge>` is a small tinted tag for a status. Tints flip with light and dark mode. ' +
          'Use `danger` only for real problems, never for ordinary outgoing payments.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    label: { control: 'text', description: 'Projected content (not an input)' },
  },
  args: { tone: 'neutral', label: 'Pending' } as Partial<BadgeArgs>,
};
export default meta;

type Story = StoryObj<BadgeArgs>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="skit-root skit:bg-background skit:p-8"><skit-badge [tone]="tone">{{ label }}</skit-badge></div>`,
  }),
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:flex-wrap skit:gap-2">
        <skit-badge>Draft</skit-badge>
        <skit-badge tone="primary">Premium</skit-badge>
        <skit-badge tone="success">Completed</skit-badge>
        <skit-badge tone="warning">Pending</skit-badge>
        <skit-badge tone="danger">Declined</skit-badge>
        <skit-badge tone="info">Scheduled</skit-badge>
      </div>
      <div class="skit:mt-6 skit:flex skit:flex-wrap skit:gap-2">
        <skit-badge tone="success"><skit-icon name="check" size="sm" /> Verified</skit-badge>
        <skit-badge tone="warning"><skit-icon name="clock" size="sm" /> Awaiting approval</skit-badge>
        <skit-badge tone="danger"><skit-icon name="lock" size="sm" /> Card frozen</skit-badge>
      </div>
    `),
  }),
};
