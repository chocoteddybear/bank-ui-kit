import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitButton } from '../button/button';
import { SkitIcon } from './icon';
import { SKIT_ICONS, SkitIconName } from './icons';

const NAMES = Object.keys(SKIT_ICONS) as SkitIconName[];

const meta: Meta<SkitIcon> = {
  title: 'Atoms/Icon',
  component: SkitIcon,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitIcon, SkitButton] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-icon>` draws one icon from the kit\'s curated set (Lucide). `name` only accepts names from that set, ' +
          'so a typo fails the build. Icons follow the surrounding text color. ' +
          'Without `label` an icon is decorative and hidden from screen readers; give it a `label` when it carries meaning on its own.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: NAMES },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: { name: 'wallet', size: 'md' },
};
export default meta;

type Story = StoryObj<SkitIcon>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:bg-background skit:p-8">
        <skit-icon [name]="name" [size]="size" [label]="label" />
      </div>
    `,
  }),
};

export const Gallery: Story = {
  name: 'All icons',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, names: NAMES },
    template: inBothModes(`
      <div class="skit:grid skit:grid-cols-3 skit:gap-2 skit:sm:grid-cols-4 skit:xl:grid-cols-6">
        @for (name of names; track name) {
          <div class="skit:flex skit:flex-col skit:items-center skit:gap-2 skit:rounded-md skit:border skit:bg-surface skit:p-3">
            <skit-icon [name]="name" size="lg" />
            <small class="skit:text-muted"><code>{{ name }}</code></small>
          </div>
        }
      </div>
    `),
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:items-end skit:gap-6">
        <div class="skit:flex skit:flex-col skit:items-center skit:gap-2"><skit-icon name="card" size="sm" /><small class="skit:text-muted">sm · 16</small></div>
        <div class="skit:flex skit:flex-col skit:items-center skit:gap-2"><skit-icon name="card" size="md" /><small class="skit:text-muted">md · 20</small></div>
        <div class="skit:flex skit:flex-col skit:items-center skit:gap-2"><skit-icon name="card" size="lg" /><small class="skit:text-muted">lg · 24</small></div>
      </div>
    `),
  }),
};

export const Color: Story = {
  name: 'Follows text color',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <p class="skit:flex skit:items-center skit:gap-2"><skit-icon name="info" /> Default text</p>
      <p class="skit:flex skit:items-center skit:gap-2 skit:text-muted"><skit-icon name="clock" /> Muted: pending since 09:41</p>
      <p class="skit:flex skit:items-center skit:gap-2 skit:text-danger"><skit-icon name="error" label="Error" /> Payment declined</p>
      <p class="skit:flex skit:items-center skit:gap-2 skit:text-link"><skit-icon name="download" /> Download statement</p>
    `),
  }),
};

export const InButtons: Story = {
  name: 'In buttons',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'An icon-only button has no visible text, so it must get `aria-label`; skit-button forwards it to the native button.',
      },
    },
  },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:flex-wrap skit:items-center skit:gap-3">
        <skit-button><skit-icon name="send" size="sm" /> Send money</skit-button>
        <skit-button variant="secondary"><skit-icon name="plus" size="sm" /> Add card</skit-button>
        <skit-button variant="outline">Statement <skit-icon name="download" size="sm" /></skit-button>
        <skit-button variant="ghost" aria-label="More actions"><skit-icon name="more" /></skit-button>
        <skit-button variant="ghost" aria-label="Close"><skit-icon name="close" /></skit-button>
      </div>
    `),
  }),
};
