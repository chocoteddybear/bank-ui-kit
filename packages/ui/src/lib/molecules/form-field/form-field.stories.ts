import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitInput } from '../../atoms/input/input';
import { SkitSelect } from '../../atoms/select/select';
import { SkitFormField } from './form-field';

const meta: Meta<SkitFormField> = {
  title: 'Molecules/Form field',
  component: SkitFormField,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitFormField, SkitInput, SkitSelect, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-form-field>` combines a label, one form atom, a hint and an error. The projected atom gets its `id` ' +
          'and `aria-describedby` from the field, so screen readers read the label, the hint and the error with no manual ' +
          'wiring. The error appears once the control is touched and invalid, inside a polite live region. ' +
          'Need a known id? Set `for` on the field, not `id` on the control.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
  },
  args: { label: 'Amount', hint: 'Up to $5,000.00 per day', error: 'Enter an amount like 84.20.' },
};
export default meta;

type Story = StoryObj<SkitFormField>;

export const Playground: Story = {
  render: (args) => ({
    props: { ...args, control: new FormControl('', Validators.required) },
    template: `
      <div class="skit-root skit:max-w-sm skit:bg-background skit:p-8">
        <skit-form-field [label]="label" [hint]="hint" [error]="error">
          <skit-input [formControl]="control" inputmode="decimal" placeholder="0.00" />
        </skit-form-field>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const invalid = new FormControl('', Validators.required);
    invalid.markAsTouched();
    return {
      props: { modes: MODES, invalid, account: new FormControl('checking') },
      template: inBothModes(`
        <div class="skit:flex skit:max-w-sm skit:flex-col skit:gap-5">
          <skit-form-field label="Recipient">
            <skit-input placeholder="Full name" />
          </skit-form-field>
          <skit-form-field label="Memo" hint="Optional, shown on both statements">
            <skit-input maxlength="140" />
          </skit-form-field>
          <skit-form-field label="Amount" hint="Available: $4,210.55" error="Enter an amount.">
            <skit-input [formControl]="invalid" inputmode="decimal" placeholder="0.00" />
          </skit-form-field>
          <skit-form-field label="From account">
            <skit-select [formControl]="account">
              <option value="checking">Checking ·· 4821</option>
              <option value="savings">Savings ·· 1190</option>
            </skit-select>
          </skit-form-field>
        </div>
      `),
    };
  },
};
