import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitInsuredNotice } from './insured-notice';

const meta: Meta<SkitInsuredNotice> = {
  title: 'Molecules/Insured notice',
  component: SkitInsuredNotice,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitInsuredNotice] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-insured-notice>` renders the US deposit insurance wording: NCUA for credit unions, FDIC for banks. ' +
          '`full` (the official sign text) goes on the main page and on pages where members open accounts or move money ' +
          'into them; `short` ("Federally insured by NCUA", "Member FDIC") suits footers and ads. Text only: the ' +
          'official graphic sign is regulator artwork the app supplies when needed. Have compliance confirm placement.',
      },
    },
  },
  argTypes: {
    insurer: { control: 'inline-radio', options: ['ncua', 'fdic'] },
    variant: { control: 'inline-radio', options: ['full', 'short'] },
  },
  args: { insurer: 'ncua', variant: 'full' },
};
export default meta;

type Story = StoryObj<SkitInsuredNotice>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-xl skit:bg-background skit:p-8">
        <skit-insured-notice [insurer]="insurer" [variant]="variant" />
      </div>
    `,
  }),
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:max-w-xl skit:flex-col skit:gap-4">
        <skit-insured-notice />
        <skit-insured-notice variant="short" />
        <skit-insured-notice insurer="fdic" />
        <skit-insured-notice insurer="fdic" variant="short" />
      </div>
    `),
  }),
};
