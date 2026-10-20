import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

export type SkitButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type SkitButtonSize = 'sm' | 'md' | 'lg';
export type SkitButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'skit-button',
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // The label belongs on the inner <button>; on the role-less host element it would be invalid ARIA.
    '[attr.aria-label]': 'null',
  },
})
export class SkitButton {
  readonly variant = input<SkitButtonVariant>('primary');
  readonly size = input<SkitButtonSize>('md');
  readonly loading = input(false, { transform: booleanAttribute });
  /** Defaults to "button" so a kit button inside a form never submits it by accident. */
  readonly type = input<SkitButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Required for icon-only buttons, which have no visible text to name them. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  private readonly label = viewChild.required<ElementRef<HTMLElement>>('label');
  /** True when the content is only an icon (no text): the button then becomes a circle. */
  protected readonly iconOnly = signal(false);

  protected readonly classes = computed(
    () => `button--${this.variant()} button--${this.size()}${this.iconOnly() ? ' button--icon-only' : ''}`,
  );

  constructor() {
    // Apps listen with (click) on <skit-button>. While loading, the inner button stays focusable
    // (unlike disabled), so its clicks are stopped here: a capture listener on the host runs before
    // the event reaches the inner button or any of the app's listeners on the host.
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const block = (event: Event): void => {
      if (this.loading() || this.disabled()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    host.addEventListener('click', block, { capture: true });
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => host.removeEventListener('click', block, { capture: true }));

    afterNextRender(() => {
      const label = this.label().nativeElement;
      const update = (): void =>
        this.iconOnly.set(label.children.length > 0 && (label.textContent ?? '').trim() === '');
      update();
      const observer = new MutationObserver(update);
      observer.observe(label, { childList: true, characterData: true, subtree: true });
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
