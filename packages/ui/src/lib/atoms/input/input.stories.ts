import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitInput } from './input';

const meta: Meta<SkitInput> = {
  title: 'Atoms/Input',
  component: SkitInput,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitInput, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-input>` wraps a native `<input>` and works with `formControlName`, `[formControl]` and `ngModel`. ' +
          'Native attributes (`type`, `name`, `id`, `autocomplete`, `inputmode`, `placeholder`, `required`, `disabled`, ' +
          '`readonly`, `maxlength`, `minlength`, `pattern`, `aria-label`, `aria-describedby`) go to the inner input, ' +
          'so `<label for>`, autofill and phone keyboards work. The value is always a string. ' +
          'The invalid style appears once the field was touched.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'url', 'search', 'number'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    inputmode: { control: 'select', options: [undefined, 'decimal', 'numeric', 'tel', 'email'] },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  args: { type: 'text', size: 'md', placeholder: 'Recipient name', disabled: false, readonly: false },
};
export default meta;

type Story = StoryObj<SkitInput>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="skit-root skit:max-w-sm skit:bg-background skit:p-8">
        <label for="playground">Label</label>
        <skit-input id="playground" [type]="type" [size]="size" [inputmode]="inputmode"
          [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:max-w-sm skit:flex-col skit:gap-3">
        <skit-input size="sm" placeholder="sm · 32px" aria-label="Small" />
        <skit-input size="md" placeholder="md · 40px" aria-label="Medium" />
        <skit-input size="lg" placeholder="lg · 48px" aria-label="Large" />
      </div>
    `),
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const invalid = new FormControl('', Validators.required);
    invalid.markAsTouched();
    const readonlyIban = new FormControl('DE89 3704 0044 0532 0130 00');
    return {
      props: { modes: MODES, invalid, readonlyIban },
      template: inBothModes(`
        <div class="skit:flex skit:max-w-sm skit:flex-col skit:gap-4">
          <div><label>Default</label><skit-input placeholder="Recipient name" aria-label="Default" /></div>
          <div>
            <label>Invalid (touched, required)</label>
            <skit-input [formControl]="invalid" aria-label="Recipient" />
            <small class="skit:text-danger">Enter a recipient.</small>
          </div>
          <div><label>Read-only</label><skit-input readonly [formControl]="readonlyIban" aria-label="IBAN" /></div>
          <div><label>Disabled</label><skit-input disabled placeholder="Not available" aria-label="Disabled" /></div>
        </div>
      `),
    };
  },
};

export const Banking: Story = {
  name: 'Banking attributes',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Forwarded attributes are what make banking forms usable: `autocomplete="cc-number"` lets the browser fill a saved card, ' +
          '`inputmode="decimal"` opens the number pad for amounts, `autocomplete="one-time-code"` picks up SMS codes.',
      },
    },
  },
  render: () => ({
    props: { modes: MODES },
    template: inBothModes(`
      <div class="skit:flex skit:max-w-sm skit:flex-col skit:gap-4">
        <div><label for="amount">Amount</label><skit-input id="amount" inputmode="decimal" placeholder="0.00" /></div>
        <div><label for="card">Card number</label><skit-input id="card" autocomplete="cc-number" inputmode="numeric" placeholder="1234 5678 9012 3456" /></div>
        <div><label for="otp">Code from SMS</label><skit-input id="otp" autocomplete="one-time-code" inputmode="numeric" maxlength="6" placeholder="123456" /></div>
      </div>
    `),
  }),
};
