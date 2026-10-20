import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitSpinner } from './spinner';

const meta: Meta<SkitSpinner> = {
  title: 'Atoms/Spinner',
  component: SkitSpinner,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitSpinner] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-spinner>` is a `role="status"` region. Its `label` is read by screen readers and announced when it appears, ' +
          'so make it specific: "Loading transactions". The ring follows the surrounding text color.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: { size: 'md', label: 'Loading transactions' },
};
export default meta;

type Story = StoryObj<SkitSpinner>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="skit-root skit:bg-background skit:p-8"><skit-spinner [size]="size" [label]="label" /></div>`,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:items-end skit:gap-6">
        <div class="skit:flex skit:flex-col skit:items-center skit:gap-2"><skit-spinner size="sm" /><small class="skit:text-muted">sm · 16</small></div>
        <div class="skit:flex skit:flex-col skit:items-center skit:gap-2"><skit-spinner size="md" /><small class="skit:text-muted">md · 24</small></div>
        <div class="skit:flex skit:flex-col skit:items-center skit:gap-2"><skit-spinner size="lg" /><small class="skit:text-muted">lg · 32</small></div>
      </div>
    `),
  }),
};

export const InContext: Story = {
  name: 'In context',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:items-center skit:gap-3 skit:rounded-lg skit:border skit:bg-surface skit:p-6 skit:text-muted">
        <skit-spinner label="Loading transactions" />
        <span class="skit:text-body-sm">Loading transactions…</span>
      </div>
      <p class="skit:mt-6 skit:flex skit:items-center skit:gap-2 skit:text-link">
        <skit-spinner size="sm" label="Refreshing balance" /> Primary color via the text color
      </p>
    `),
  }),
};
