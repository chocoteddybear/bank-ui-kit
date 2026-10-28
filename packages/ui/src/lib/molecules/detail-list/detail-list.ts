import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Key/value lines for review and receipt screens. A list of list items, not a <dl>: a <dl> may only
 * contain dt, dd and div, so custom-element rows inside one break its semantics for screen readers.
 */
@Component({
  selector: 'skit-detail-list',
  template: '<ng-content select="skit-detail-row" />',
  styleUrl: './detail-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'list' },
})
export class SkitDetailList {}

@Component({
  selector: 'skit-detail-row',
  template: '<span class="label">{{ label() }}</span><span class="value"><ng-content /></span>',
  styleUrl: './detail-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'listitem' },
})
export class SkitDetailRow {
  readonly label = input.required<string>();
}
