import { InjectionToken, Signal } from '@angular/core';

/**
 * Provided by a wrapping field (e.g. skit-form-field) so a form atom gets its id and description
 * without the app wiring them by hand. Lives with the atoms so dependencies keep pointing downward.
 */
export interface SkitFormFieldContext {
  readonly controlId: Signal<string>;
  readonly describedBy: Signal<string | undefined>;
}

export const SKIT_FORM_FIELD = new InjectionToken<SkitFormFieldContext>('SKIT_FORM_FIELD');
