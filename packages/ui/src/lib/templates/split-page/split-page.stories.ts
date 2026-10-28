import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { SkitButton } from '../../atoms/button/button';
import { SkitSkeleton } from '../../atoms/skeleton/skeleton';
import { SkitSplitPage } from './split-page';

const meta: Meta<SkitSplitPage> = {
  title: 'Templates/Split page',
  component: SkitSplitPage,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitSplitPage, SkitSkeleton, SkitButton] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-split-page>` is a layout without data. Fill it with `slot="header"`, `slot="main"`, `slot="aside"`, ' +
          '`slot="actions"` and `slot="footer"`. Wide screens: the aside sits to the right of main and stays in view ' +
          'while main scrolls; the actions sit under main. Narrow screens: main, then aside, then the actions as a bar ' +
          'pinned to the bottom of the screen. It adds `skit-root`, so plain tags inside get kit styles. ' +
          'Customize with `--skit-page-max-width` and `--skit-split-page-aside-width`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SkitSplitPage>;

export const Wireframe: Story = {
  render: () => ({
    template: `
      <skit-split-page>
        <div slot="header" class="skit:flex skit:h-16 skit:items-center skit:gap-3">
          <skit-skeleton shape="circle" [width]="32" /><skit-skeleton [width]="120" />
        </div>
        <div slot="main" class="skit:flex skit:flex-col skit:gap-4 skit:rounded-lg skit:border skit:bg-surface skit:p-6">
          <h2>Main</h2>
          @for (row of [1, 2, 3, 4, 5, 6]; track row) {
            <skit-skeleton shape="rect" />
          }
        </div>
        <div slot="aside" class="skit:flex skit:flex-col skit:gap-4 skit:rounded-lg skit:border skit:bg-surface skit:p-6">
          <h3>Aside</h3>
          <skit-skeleton shape="rect" [height]="120" />
          <skit-skeleton shape="rect" [height]="120" />
        </div>
        <div slot="actions" class="skit:flex skit:justify-end skit:gap-3">
          <skit-button variant="ghost">Back</skit-button>
          <skit-button size="lg">Continue</skit-button>
        </div>
        <p slot="footer" class="skit:py-6 skit:text-caption skit:text-muted">Footer</p>
      </skit-split-page>
    `,
  }),
};
