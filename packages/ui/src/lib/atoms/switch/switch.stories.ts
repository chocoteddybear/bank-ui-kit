import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitSwitch } from './switch';

const meta: Meta<SkitSwitch> = {
  title: 'Atoms/Switch',
  component: SkitSwitch,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitSwitch, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-switch>` is a native checkbox with `role="switch"`, so screen readers say "on" or "off". ' +
          'Use it for settings that apply immediately; use a checkbox for choices submitted with a form.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SkitSwitch>;

export const States: Story = {
  render: () => ({
    props: { modes: MODES, on: new FormControl(true) },
    template: inBothModes(`
      <div class="skit:flex skit:flex-col skit:gap-3">
        <skit-switch>Freeze card</skit-switch>
        <skit-switch [formControl]="on">Push notifications</skit-switch>
        <skit-switch disabled>Contactless payments (managed by your bank)</skit-switch>
        <skit-switch aria-label="Round up purchases" />
      </div>
    `),
  }),
};
