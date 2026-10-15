import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitButton } from './button';

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

type ButtonArgs = SkitButton & { label: string };

const meta: Meta<ButtonArgs> = {
  title: 'Atoms/Button',
  component: SkitButton,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitButton] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-button>` renders a native `<button>` and forwards `type` and `disabled` to it. ' +
          '`type` defaults to `"button"`, so it never submits a form by accident; use `type="submit"` in forms. ' +
          'While `loading`, the button stays focusable, announces itself as busy, and ignores clicks.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text', description: 'Projected content (not an input)' },
  },
  args: {
    label: 'Pay $84.20',
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
  } as Partial<ButtonArgs>,
};
export default meta;

type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:bg-background skit:p-8">
        <skit-button [variant]="variant" [size]="size" [type]="type" [loading]="loading" [disabled]="disabled">
          {{ label }}
        </skit-button>
      </div>
    `,
  }),
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, variants: VARIANTS, sizes: SIZES },
    template: inBothModes(`
      @for (size of sizes; track size) {
        <p class="skit:mb-3 skit:text-label skit:text-muted">{{ size }}</p>
        <div class="skit:mb-8 skit:flex skit:flex-wrap skit:items-center skit:gap-3">
          @for (variant of variants; track variant) {
            <skit-button [variant]="variant" [size]="size">{{ variant }}</skit-button>
          }
        </div>
      }
    `),
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, variants: VARIANTS },
    template: inBothModes(`
      <table>
        <thead><tr><th>Variant</th><th>Default</th><th>Disabled</th><th>Loading</th></tr></thead>
        <tbody>
          @for (variant of variants; track variant) {
            <tr>
              <td><code>{{ variant }}</code></td>
              <td><skit-button [variant]="variant">Transfer</skit-button></td>
              <td><skit-button [variant]="variant" disabled>Transfer</skit-button></td>
              <td><skit-button [variant]="variant" loading>Transfer</skit-button></td>
            </tr>
          }
        </tbody>
      </table>
    `),
  }),
};

export const InAForm: Story = {
  name: 'In a form',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <form class="skit-root skit:flex skit:gap-3 skit:bg-background skit:p-8" (submit)="$event.preventDefault()">
        <skit-button type="submit">Send money</skit-button>
        <skit-button variant="ghost">Cancel</skit-button>
      </form>
    `,
  }),
};

export const CustomRadius: Story = {
  name: 'Custom radius (CSS variable)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Rare per-use tweaks go through component CSS variables, never through inputs.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="skit-root skit:flex skit:gap-3 skit:bg-background skit:p-8">
        <skit-button>Default (full)</skit-button>
        <skit-button style="--skit-button-radius: var(--skit-radius-md)">--skit-button-radius: md</skit-button>
      </div>
    `,
  }),
};
