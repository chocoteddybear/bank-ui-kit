import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from './foundations';

const VARIANTS = [
  { cls: 'skit:text-display', name: 'display', spec: '4xl · 36/40 · 600' },
  { cls: 'skit:text-heading-lg', name: 'heading-lg', spec: '3xl · 30/36 · 600' },
  { cls: 'skit:text-heading', name: 'heading', spec: '2xl · 24/32 · 600' },
  { cls: 'skit:text-title', name: 'title', spec: 'xl · 20/28 · 500' },
  { cls: 'skit:text-subtitle', name: 'subtitle', spec: 'lg · 18/28 · 500' },
  { cls: 'skit:text-body', name: 'body', spec: 'base · 16/24 · 400' },
  { cls: 'skit:text-body-sm', name: 'body-sm', spec: 'sm · 14/20 · 400' },
  { cls: 'skit:text-label', name: 'label', spec: 'sm · 14/20 · 500' },
  { cls: 'skit:text-caption', name: 'caption', spec: 'xs · 12/16 · 400' },
];

const SCALE = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];

const meta: Meta = {
  title: 'Foundations/Typography',
  render: () => ({ props: { modes: MODES, variants: VARIANTS, scale: SCALE } }),
};
export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      @for (v of variants; track v.name) {
        <div class="skit:mb-6 skit:border-b skit:pb-4">
          <div [class]="v.cls">Available balance</div>
          <small class="skit:text-muted"><code>{{ v.cls }}</code> · {{ v.spec }}</small>
        </div>
      }
    `),
  }),
};

export const Scale: Story = {
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      @for (size of scale; track size) {
        <div class="skit:mb-3 skit:flex skit:items-baseline skit:gap-4">
          <small class="skit:w-12 skit:text-muted">{{ size }}</small>
          <span
            [style.font-size]="'var(--skit-text-' + size + ')'"
            [style.line-height]="'var(--skit-text-' + size + '--line-height)'"
          >Inter 1234567890</span>
        </div>
      }
      <h3 class="skit:mt-8">Tabular numerals</h3>
      <p class="skit:tabular-nums">+$3,200.00<br />-$84.20<br />+$1,111.11</p>
    `),
  }),
};

export const PlainTags: Story = {
  name: 'Plain tags',
  render: (args, context) => ({
    ...meta.render!(args, context),
    template: inBothModes(`
      <h1>Heading 1 · heading-lg</h1>
      <h2>Heading 2 · heading</h2>
      <h3>Heading 3 · title</h3>
      <h4>Heading 4 · subtitle</h4>
      <p>Paragraph · body. Transfers between your own accounts are instant. <a href="#">Learn more</a>.</p>
      <p><small>Small · caption. Exchange rates update every minute.</small></p>
      <p><label>Label · label</label></p>
      <ul><li>Unordered item</li><li>Unordered item</li></ul>
      <ol><li>Ordered item</li><li>Ordered item</li></ol>
      <hr />
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>12 Oct</td><td>Salary</td><td class="skit:tabular-nums">+$3,200.00</td></tr>
          <tr><td>11 Oct</td><td>Groceries</td><td class="skit:tabular-nums">-$84.20</td></tr>
        </tbody>
      </table>
    `),
  }),
};
