import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Page layout with no data: header, main content, a side panel, the page's actions and a footer, filled
 * through `slot="header|main|aside|actions|footer"`. Wide screens: aside on the right (sticky while main
 * scrolls), actions under main. Narrow: main, aside, then the actions as a bar pinned to the screen bottom.
 */
@Component({
  selector: 'skit-split-page',
  templateUrl: './split-page.html',
  styleUrl: './split-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // A page built from this template is a migrated page, so it opts into the kit's tag styles.
    class: 'skit-root',
  },
})
export class SkitSplitPage {}
