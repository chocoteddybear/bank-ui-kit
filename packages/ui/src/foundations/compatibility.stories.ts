import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect } from 'storybook/test';
import { HOSTS, runCompatibility } from './compatibility';

const meta: Meta = {
  title: 'Foundations/Compatibility',
  render: () => ({
    template: `
      <div class="skit-root skit:min-h-screen skit:bg-background skit:p-8">
        <p class="skit:text-muted">
          The same legacy page rendered twice: alone, and with the kit's compiled CSS added.
          Outside <code>.skit-root</code> nothing may change. Inside it, the kit applies, except where the host
          styles a tag globally: then the host wins by design.
        </p>
        <div id="compat"></div>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj;

const story = (key: keyof typeof HOSTS): Story => ({
  name: HOSTS[key].name,
  play: async ({ canvasElement }) => {
    const checks = await runCompatibility(canvasElement.querySelector<HTMLElement>('#compat')!, HOSTS[key]);
    await expect(checks.filter((c) => !c.pass).map((c) => c.label)).toEqual([]);
  },
});

export const PlainApp = story('plain');
export const TailwindApp = story('tailwind');
export const BootstrapApp = story('bootstrap');
