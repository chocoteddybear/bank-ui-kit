import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitAmount } from '../../atoms/amount/amount';
import { SkitBadge } from '../../atoms/badge/badge';
import { SkitDetailList, SkitDetailRow } from './detail-list';

const meta: Meta<SkitDetailList> = {
  title: 'Molecules/Detail list',
  component: SkitDetailList,
  subcomponents: { SkitDetailRow },
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitDetailList, SkitDetailRow, SkitAmount, SkitBadge] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-detail-list>` with `<skit-detail-row label="…">` rows: label on the left, any content on the right ' +
          '(text, an amount, a badge). For review and receipt screens. Screen readers hear a list, one row per item.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SkitDetailList>;

export const Review: Story = {
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:max-w-md skit:rounded-lg skit:border skit:bg-surface skit:px-5">
        <skit-detail-list>
          <skit-detail-row label="From">Checking ·· 4821</skit-detail-row>
          <skit-detail-row label="To">Savings ·· 1190</skit-detail-row>
          <skit-detail-row label="Amount"><skit-amount value="500.00" currency="USD" size="sm" sign="negative" /></skit-detail-row>
          <skit-detail-row label="Date">Today, Oct 27</skit-detail-row>
          <skit-detail-row label="Status"><skit-badge tone="info">Scheduled</skit-badge></skit-detail-row>
          <skit-detail-row label="Memo">Emergency fund, monthly top-up</skit-detail-row>
        </skit-detail-list>
      </div>
    `),
  }),
};
