import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type SkitAvatarSize = 'sm' | 'md' | 'lg';

/** "Anna Maria Smith" → "AS", "anna" → "A". */
export function skitInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toLocaleUpperCase();
}

@Component({
  selector: 'skit-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class SkitAvatar {
  /** Whose avatar this is. Used as the accessible name and for the initials fallback. */
  readonly name = input.required<string>();
  readonly src = input<string>();
  readonly size = input<SkitAvatarSize>('md');

  private readonly failedSrc = signal<string | null>(null);

  protected readonly initials = computed(() => skitInitials(this.name()));
  /** Falls back to initials when there is no image or it fails to load; a new src gets a fresh try. */
  protected readonly showImage = computed(() => {
    const src = this.src();
    return !!src && this.failedSrc() !== src;
  });

  protected onError(): void {
    this.failedSrc.set(this.src() ?? null);
  }
}
