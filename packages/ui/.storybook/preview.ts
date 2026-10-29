import type { Decorator, Preview } from '@storybook/angular-vite';
import type { SkitColorMode, SkitPrimaryPreset } from '../src/public-api';
// Not in storybook.css: Tailwind inlines @fontsource without rebasing url(./files/...), so the built Storybook 404s on fonts.
import '../src/lib/tokens/fonts.css';

const withSkitTheme: Decorator = (story, context) => {
  const root = document.documentElement;
  const primary = context.globals['primary'] as SkitPrimaryPreset;
  const mode = context.globals['mode'] as SkitColorMode;

  root.classList.add('skit-root');
  root.setAttribute('data-primary', primary);
  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }
  return story();
};

const preview: Preview = {
  globalTypes: {
    primary: {
      description: 'Primary color preset',
      toolbar: {
        title: 'Color',
        icon: 'paintbrush',
        items: [
          { value: 'indigo', title: 'Indigo' },
          { value: 'teal', title: 'Teal' },
          { value: 'violet', title: 'Violet' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System', icon: 'browser' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    primary: 'indigo',
    mode: 'system',
  },
  decorators: [withSkitTheme],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
