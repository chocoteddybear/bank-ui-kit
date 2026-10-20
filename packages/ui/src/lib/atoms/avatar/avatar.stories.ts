import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { MODES, inBothModes } from '../../../foundations/foundations';
import { SkitAvatar } from './avatar';

// Inline SVG portrait so the story needs no network access.
const PHOTO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#c7d2fe"/>` +
      `<circle cx="40" cy="31" r="14" fill="#4338ca"/><path d="M14 80c2-17 13-26 26-26s24 9 26 26z" fill="#4338ca"/></svg>`,
  );

const meta: Meta<SkitAvatar> = {
  title: 'Atoms/Avatar',
  component: SkitAvatar,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SkitAvatar] })],
  parameters: {
    docs: {
      description: {
        component:
          '`<skit-avatar>` shows a photo, or the initials of `name` when there is no photo or it fails to load. ' +
          '`name` is required: it is the accessible name in both cases.',
      },
    },
  },
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { name: 'Anna Smith', size: 'md' },
};
export default meta;

type Story = StoryObj<SkitAvatar>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="skit-root skit:bg-background skit:p-8"><skit-avatar [name]="name" [src]="src" [size]="size" /></div>`,
  }),
};

export const Variants: Story = {
  name: 'Photo, initials, broken image',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { modes: MODES, photo: PHOTO },
    template: inBothModes(`
      @for (size of ['sm', 'md', 'lg']; track size) {
        <div class="skit:mb-4 skit:flex skit:items-center skit:gap-3">
          <skit-avatar name="Anna Smith" [src]="photo" [size]="size" />
          <skit-avatar name="Jean-Luc Picard" [size]="size" />
          <skit-avatar name="Mohammed Al-Sayed" src="https://invalid.example/missing.jpg" [size]="size" />
          <small class="skit:text-muted">{{ size }}</small>
        </div>
      }
    `),
  }),
};
