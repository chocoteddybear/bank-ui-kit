import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitInsuredNotice } from '../../molecules/insured-notice/insured-notice';
import { SkitSiteFooter } from './site-footer';

const meta: Meta<SkitSiteFooter> = {
  title: 'Organisms/Site footer',
  component: SkitSiteFooter,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitSiteFooter, SkitInsuredNotice] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-site-footer>` holds what a financial site shows on every page: `slot="links"` (Privacy, Security, ' +
          'Accessibility, Contact), `slot="notice"` (a short `<skit-insured-notice>`) and the legal lines as `<p>` ' +
          'content (Equal Housing Lender, NMLS ID, routing number). It renders no `<footer>` landmark itself, so it fits ' +
          'inside the footer of `<skit-split-page>`. The exact lines come from the compliance team of the institution.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SkitSiteFooter>;

export const CreditUnion: Story = {
  name: 'Credit union',
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <skit-site-footer>
        <a slot="links" href="#">Privacy</a>
        <a slot="links" href="#">Security</a>
        <a slot="links" href="#">Accessibility</a>
        <a slot="links" href="#">Contact us</a>
        <a slot="links" href="#">Help center</a>
        <skit-insured-notice slot="notice" variant="short" />
        <p>Routing number 000000000 · Equal Housing Lender · Equal Opportunity Employer · NMLS ID 000000</p>
        <p>Example Credit Union conducts all member business in English.</p>
      </skit-site-footer>
    `),
  }),
};
