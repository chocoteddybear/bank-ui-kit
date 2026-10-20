import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitCheckbox } from './checkbox';

const meta: Meta<SkitCheckbox> = {
  title: 'Atoms/Checkbox',
  component: SkitCheckbox,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitCheckbox, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-checkbox>` is a native checkbox bound to a boolean; the projected text is its label and is clickable. ' +
          'For "must be checked" (accept terms), use `Validators.requiredTrue` on the control.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SkitCheckbox>;

export const States: Story = {
  render: () => {
    const checked = new FormControl(true);
    const invalid = new FormControl(false, Validators.requiredTrue);
    invalid.markAsTouched();
    return {
      props: { modes: MODES, checked, invalid },
      template: inBothModes(`
        <div class="skit:flex skit:flex-col skit:gap-3">
          <skit-checkbox>Remember this device</skit-checkbox>
          <skit-checkbox [formControl]="checked">Email me monthly statements</skit-checkbox>
          <skit-checkbox [formControl]="invalid">I accept the terms and conditions</skit-checkbox>
          <skit-checkbox disabled>Overdraft protection (not available)</skit-checkbox>
        </div>
      `),
    };
  },
};
