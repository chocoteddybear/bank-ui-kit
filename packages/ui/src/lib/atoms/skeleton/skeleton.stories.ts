import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitSkeleton } from './skeleton';

const meta: Meta<SkitSkeleton> = {
  title: 'Atoms/Skeleton',
  component: SkitSkeleton,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitSkeleton] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-skeleton>` is a placeholder shape shown while content loads. It is hidden from screen readers; ' +
          'mark the loading container with `aria-busy="true"` or show a `skit-spinner` with a label. ' +
          '`width` and `height` take pixels (number) or any CSS length (string).',
      },
    },
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: { shape: 'text' },
};
export default meta;

type Story = StoryObj<SkitSkeleton>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="skit-root skit:bg-background skit:p-8"><skit-skeleton [shape]="shape" [width]="width" [height]="height" /></div>`,
  }),
};

export const TransactionList: Story = {
  name: 'Loading a transaction list',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, rows: [1, 2, 3, 4] },
    template: inBothModes(`
      <div class="skit:rounded-lg skit:border skit:bg-surface skit:p-4" aria-busy="true">
        @for (row of rows; track row) {
          <div class="skit:flex skit:items-center skit:gap-3 skit:py-3">
            <skit-skeleton shape="circle" />
            <div class="skit:flex skit:flex-1 skit:flex-col skit:gap-2">
              <skit-skeleton width="45%" />
              <skit-skeleton width="25%" height="0.75em" />
            </div>
            <skit-skeleton [width]="72" />
          </div>
        }
      </div>
    `),
  }),
};
