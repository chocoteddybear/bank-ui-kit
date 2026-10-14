import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from './foundations';

const SPACING = [1, 2, 3, 4, 6, 8, 12, 16];

const RADII = [
  { name: 'none', px: '0', usage: '' },
  { name: 'sm', px: '8', usage: 'Tags' },
  { name: 'md', px: '12', usage: 'Inputs' },
  { name: 'lg', px: '20', usage: 'Cards' },
  { name: 'full', px: '9999', usage: 'Buttons, pills' },
];

const meta: Meta = {
  title: 'Foundations/Layout',
  render: () => ({ props: { modes: MODES, spacing: SPACING, radii: RADII } }),
};
export default meta;

type Story = StoryObj;

export const Spacing: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      <p class="skit:text-text-muted">4px base. Utility step n = n × 4px (<code>skit:p-4</code> = 16px).</p>
      @for (step of spacing; track step) {
        <div class="skit:mb-3 skit:flex skit:items-center skit:gap-4">
          <small class="skit:w-24 skit:text-text-muted">{{ step }} · {{ step * 4 }}px</small>
          <div class="skit:h-4 skit:bg-primary-500" [style.width]="'calc(var(--skit-spacing) * ' + step + ')'"></div>
        </div>
      }
    `),
  }),
};

export const Radius: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      <div class="skit:flex skit:flex-wrap skit:gap-6">
        @for (r of radii; track r.name) {
          <div>
            <div
              class="skit:size-24 skit:border skit:border-primary-500 skit:bg-tint-bg"
              [style.border-radius]="'var(--skit-radius-' + r.name + ')'"
            ></div>
            <p class="skit:mt-2 skit:mb-0 skit:text-label">{{ r.name }} · {{ r.px }}</p>
            <small class="skit:text-text-muted">{{ r.usage }}</small>
          </div>
        }
      </div>
    `),
  }),
};
