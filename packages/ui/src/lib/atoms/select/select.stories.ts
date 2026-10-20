import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitSelect } from './select';

const CURRENCIES = `
  <option value="usd">US dollar (USD)</option>
  <option value="eur">Euro (EUR)</option>
  <option value="gbp">Pound sterling (GBP)</option>
  <option value="chf">Swiss franc (CHF)</option>
`;

const meta: Meta<SkitSelect> = {
  title: 'Atoms/Select',
  component: SkitSelect,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitSelect, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-select>` wraps a native `<select>`: keyboard, screen readers and positioning come from the browser, ' +
          'and phones keep their native picker. Put `<option>` elements inside it. In Chromium 135+ with a mouse, ' +
          'the open list is styled too (`appearance: base-select`); other browsers show the OS list. ' +
          'Options may arrive after the value (e.g. from an API); the selection is kept.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { size: 'md', placeholder: 'Choose a currency', disabled: false },
};
export default meta;

type Story = StoryObj<SkitSelect>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-sm skit:bg-background skit:p-8">
        <label for="currency">Currency</label>
        <skit-select id="currency" [size]="size" [placeholder]="placeholder" [disabled]="disabled">${CURRENCIES}</skit-select>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const chosen = new FormControl('eur');
    const invalid = new FormControl('', Validators.required);
    invalid.markAsTouched();
    return {
      props: { modes: MODES, chosen, invalid },
      template: inBothModes(`
        <div class="skit:flex skit:max-w-sm skit:flex-col skit:gap-4">
          <div><label>Chosen</label><skit-select [formControl]="chosen" aria-label="Currency">${CURRENCIES}</skit-select></div>
          <div><label>Placeholder</label><skit-select placeholder="Choose a currency" aria-label="Currency">${CURRENCIES}</skit-select></div>
          <div>
            <label>Invalid (touched, required)</label>
            <skit-select [formControl]="invalid" placeholder="Choose a currency" aria-label="Currency">${CURRENCIES}</skit-select>
            <small class="skit:text-danger">Choose a currency.</small>
          </div>
          <div><label>Disabled</label><skit-select disabled aria-label="Currency">${CURRENCIES}</skit-select></div>
          <div><label>Small</label><skit-select size="sm" aria-label="Currency">${CURRENCIES}</skit-select></div>
        </div>
      `),
    };
  },
};
