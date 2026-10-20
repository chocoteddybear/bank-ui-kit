import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitRadio } from './radio';

const meta: Meta<SkitRadio> = {
  title: 'Atoms/Radio',
  component: SkitRadio,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitRadio, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-radio>` is one native radio with its own `value`. Give every radio of a group the same `name` ' +
          'and the same form control; the control holds the chosen `value`. Arrow keys move inside the group. ' +
          'Wrap the group in `<fieldset>` with a `<legend>` so screen readers announce the question.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SkitRadio>;

export const Group: Story = {
  render: () => ({
    props: { modes: MODES, form: new FormGroup({ speed: new FormControl('standard') }) },
    template: inBothModes(`
      <form [formGroup]="form">
        <fieldset class="skit:m-0 skit:flex skit:flex-col skit:gap-3 skit:border-0 skit:p-0">
          <legend class="skit:mb-3 skit:text-label">Transfer speed</legend>
          <skit-radio formControlName="speed" name="speed-{{ mode }}" value="standard">Standard · 1–2 business days · free</skit-radio>
          <skit-radio formControlName="speed" name="speed-{{ mode }}" value="instant">Instant · seconds · $1.00</skit-radio>
          <skit-radio formControlName="speed" name="speed-{{ mode }}" value="scheduled" disabled>Scheduled (not available)</skit-radio>
        </fieldset>
        <p class="skit:mt-4 skit:text-caption skit:text-muted">Value: {{ form.value.speed }}</p>
      </form>
    `),
  }),
};
