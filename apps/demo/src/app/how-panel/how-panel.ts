import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkitBadge } from '@vladlev/skit';

const INSTALL = `pnpm add @vladlev/skit

/* styles.css */
@import '@vladlev/skit/fonts.css';
@import '@vladlev/skit/tailwind.css';   /* or styles.css without Tailwind */
@import './themes/navy-federal.css';`;

const BRIDGE = `[data-brand='navy-federal'] {
  --skit-primary-600: #0667ba;  /* links, focus, primary button */
  --skit-primary-900: #0f3d70;  /* brand navy */
  /* … the full 50–950 scale */
}

<html class="skit-root" data-brand="navy-federal">`;

const SWAP = `<!-- before: the page's own markup and CSS -->
<button class="nf-btn nf-btn--primary">Continue</button>

<!-- after: kit component; old classes deleted in the same change -->
<skit-button>Continue</skit-button>`;

/** The "how is this applied" story for the pitch: three steps with the real code. */
@Component({
  selector: 'app-how-panel',
  imports: [SkitBadge],
  templateUrl: './how-panel.html',
  styleUrl: './how-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowPanel {
  protected readonly steps = [
    {
      title: 'Install the package',
      text: 'One npm dependency. Compiled CSS that only styles inside .skit-root, so existing pages stay exactly as they are.',
      code: INSTALL,
    },
    {
      title: 'Bridge the brand',
      text: 'Navy Federal colors are mapped onto kit tokens in one CSS file. No kit code changes. Turn the theme switch off to see the kit default.',
      code: BRIDGE,
    },
    {
      title: 'Swap page by page',
      text: 'Each migrated page gets skit-root and loses its old classes in the same change. Unmigrated pages keep working.',
      code: SWAP,
    },
  ];
}
