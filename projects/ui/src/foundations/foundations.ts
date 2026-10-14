export const MODES = ['light', 'dark'] as const;

/** Renders the same content in a forced-light and a forced-dark panel, side by side. */
export const inBothModes = (body: string): string => `
  <div class="skit:grid skit:min-h-screen skit:lg:grid-cols-2">
    @for (mode of modes; track mode) {
      <section [attr.data-theme]="mode" class="skit-root skit:bg-background skit:p-8">
        <p class="skit:mb-6 skit:text-caption skit:uppercase skit:text-text-muted">{{ mode }}</p>
        ${body}
      </section>
    }
  </div>
`;
