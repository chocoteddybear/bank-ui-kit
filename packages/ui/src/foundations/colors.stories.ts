import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from './foundations';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SCALES = [
  { name: 'primary', label: 'Primary (active preset)' },
  { name: 'indigo', label: 'Indigo (default preset)' },
  { name: 'teal', label: 'Teal preset' },
  { name: 'violet', label: 'Violet preset' },
  { name: 'neutral', label: 'Neutral (cool slate)' },
];

const TONES = ['success', 'warning', 'danger', 'info'];
const TONE_SLOTS = ['bg', 'border', 'solid', 'text'];

const ROLES = [
  { name: 'background', usage: 'Page' },
  { name: 'surface', usage: 'Cards, dropdowns, popovers' },
  { name: 'border', usage: 'Cards, inputs, dropdowns' },
  { name: 'border-strong', usage: 'Outline buttons' },
  { name: 'text-primary', usage: 'Body text, amounts' },
  { name: 'text-muted', usage: 'Secondary text' },
  { name: 'link', usage: 'Links' },
  { name: 'focus-ring-color', usage: 'Keyboard focus ring' },
  { name: 'tint-bg', usage: 'Tinted badge / alert background' },
  { name: 'tint-text', usage: 'Tinted badge / alert text' },
];

const meta: Meta = {
  title: 'Foundations/Colors',
  render: () => ({
    props: { modes: MODES, steps: STEPS, scales: SCALES, tones: TONES, toneSlots: TONE_SLOTS, roles: ROLES },
  }),
};
export default meta;

type Story = StoryObj;

export const Scales: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      @for (scale of scales; track scale.name) {
        <h3>{{ scale.label }}</h3>
        <div class="skit:mb-8 skit:grid skit:grid-cols-11 skit:gap-2">
          @for (step of steps; track step) {
            <div>
              <div
                class="skit:h-12 skit:rounded-sm skit:border skit:border-border"
                [style.background]="'var(--skit-' + scale.name + '-' + step + ')'"
              ></div>
              <small class="skit:text-text-muted">{{ step }}</small>
            </div>
          }
        </div>
      }
    `),
  }),
};

export const Semantic: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      @for (tone of tones; track tone) {
        <h3>{{ tone }}</h3>
        <div class="skit:mb-3 skit:grid skit:grid-cols-4 skit:gap-2">
          @for (slot of toneSlots; track slot) {
            <div>
              <div
                class="skit:h-12 skit:rounded-sm skit:border skit:border-border"
                [style.background]="'var(--skit-' + tone + '-' + slot + ')'"
              ></div>
              <small class="skit:text-text-muted">{{ slot }}</small>
            </div>
          }
        </div>
        <div
          class="skit:mb-8 skit:rounded-md skit:border skit:p-4 skit:text-body-sm"
          [style.background]="'var(--skit-' + tone + '-bg)'"
          [style.border-color]="'var(--skit-' + tone + '-border)'"
          [style.color]="'var(--skit-' + tone + '-text)'"
        >
          Sample {{ tone }} message on its tinted background.
        </div>
      }
    `),
  }),
};

export const Roles: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      <table>
        <thead>
          <tr><th>Swatch</th><th>Role</th><th>Usage</th></tr>
        </thead>
        <tbody>
          @for (role of roles; track role.name) {
            <tr>
              <td>
                <div
                  class="skit:size-10 skit:rounded-sm skit:border skit:border-border"
                  [style.background]="'var(--skit-' + role.name + ')'"
                ></div>
              </td>
              <td><code>--skit-{{ role.name }}</code></td>
              <td>{{ role.usage }}</td>
            </tr>
          }
        </tbody>
      </table>

      <h3 class="skit:mt-8">In use</h3>
      <div class="skit:rounded-lg skit:border skit:border-border skit:bg-surface skit:p-6">
        <p class="skit:text-title">Surface card</p>
        <p class="skit:text-text-muted">Muted text on surface, with a <a href="#">link</a>.</p>
        <span class="skit:rounded-full skit:bg-tint-bg skit:px-3 skit:py-1 skit:text-label skit:text-tint-text">Tinted badge</span>
        <span class="skit:ml-2 skit:rounded-full skit:bg-primary-600 skit:px-4 skit:py-2 skit:text-label skit:text-white">Primary button</span>
      </div>
    `),
  }),
};
