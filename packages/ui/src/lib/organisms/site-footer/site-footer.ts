import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The legal footer a financial site needs on every page: a link row (`slot="links"`, plain <a> elements),
 * the deposit insurance notice (`slot="notice"`, usually a short skit-insured-notice) and the legal lines
 * (default content: <p> elements). Renders no <footer> landmark itself, so it fits inside a template's footer.
 */
@Component({
  selector: 'skit-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkitSiteFooter {
  /** Accessible name of the link navigation, distinct from the site's main navigation. */
  readonly linksLabel = input('Legal and help');
}
