import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';

export type SkitButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type SkitButtonSize = 'sm' | 'md' | 'lg';
export type SkitButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'skit-button',
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkitButton {
  readonly variant = input<SkitButtonVariant>('primary');
  readonly size = input<SkitButtonSize>('md');
  readonly loading = input(false, { transform: booleanAttribute });
  /** Defaults to "button" so a kit button inside a form never submits it by accident. */
  readonly type = input<SkitButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => `button--${this.variant()} button--${this.size()}`);

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
    inject(DestroyRef).onDestroy(() => host.removeEventListener('click', block, { capture: true }));
  }
}
