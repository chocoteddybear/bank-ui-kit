import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkitIcon } from '../../atoms/icon/icon';

export type SkitInsurer = 'ncua' | 'fdic';
export type SkitInsuredNoticeVariant = 'full' | 'short';

/**
 * Wording of the US deposit insurance notices: NCUA official sign (12 CFR 740.4) and short advertising
 * statement (740.5); FDIC digital sign (12 CFR 328 subpart A) and "Member FDIC". Text only: the official graphic
 * signs are regulator artwork, which the app supplies when a page needs the graphic.
 */
export const SKIT_INSURED_TEXT: Record<SkitInsurer, { full: [string, string]; short: string }> = {
  ncua: {
    full: [
      'Your savings federally insured to at least $250,000 and backed by the full faith and credit of the United States Government.',
      'National Credit Union Administration, a U.S. Government Agency',
    ],
    short: 'Federally insured by NCUA',
  },
  fdic: {
    full: [
      'FDIC-Insured - Backed by the full faith and credit of the U.S. Government',
      'Federal Deposit Insurance Corporation',
    ],
    short: 'Member FDIC',
  },
};

/**
 * The deposit insurance notice for a credit union (NCUA) or bank (FDIC). `full` for the main page and pages
 * where members open accounts or move money into them; `short` for footers and ads. Never smaller than
 * the kit's smallest text, so it is never the least legible text on the page.
 */
@Component({
  selector: 'skit-insured-notice',
  imports: [SkitIcon],
  templateUrl: './insured-notice.html',
  styleUrl: './insured-notice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class SkitInsuredNotice {
  readonly insurer = input<SkitInsurer>('ncua');
  readonly variant = input<SkitInsuredNoticeVariant>('full');

  protected readonly text = computed(() => SKIT_INSURED_TEXT[this.insurer()]);
}
