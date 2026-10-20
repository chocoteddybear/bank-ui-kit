import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { SKIT_ICONS } from '../icon/icons';
import { SkitFormControlBase } from '../shared/form-control-base';

export type SkitSelectSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'skit-select',
  imports: [LucideDynamicIcon],
  templateUrl: './select.html',
  styleUrls: ['../shared/field.css', './select.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.autocomplete]': 'null',
    '[attr.placeholder]': 'null',
  },
})
export class SkitSelect extends SkitFormControlBase<string> {
  readonly size = input<SkitSelectSize>('md');
  /** e.g. "country-name": lets browsers autofill the choice. */
  readonly autocomplete = input<string>();
  /** Shown as a first, unselectable option while nothing is chosen. */
  readonly placeholder = input<string>();

  protected readonly model = signal('');
  protected readonly chevron = SKIT_ICONS['chevron-down'];

  private readonly select = viewChild.required<ElementRef<HTMLSelectElement>>('select');

  constructor() {
    super();
    // Options are the app's projected content and may arrive after the value (e.g. loaded from an API),
    // so the native value is re-applied after every render and whenever the option list changes.
    afterRenderEffect(() => this.syncNativeValue());

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new MutationObserver(() => this.syncNativeValue());
      observer.observe(this.select().nativeElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value'],
      });
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected toValue(raw: unknown): string {
    return raw === null || raw === undefined ? '' : String(raw);
  }

  protected onSelectChange(event: Event): void {
    this.commit((event.target as HTMLSelectElement).value);
  }

  protected onBlur(): void {
    this.touch();
  }

  private syncNativeValue(): void {
    const select = this.select().nativeElement;
    if (select.value !== this.model()) select.value = this.model();
  }
}
