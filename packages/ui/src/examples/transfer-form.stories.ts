import { signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { SkitAmount } from '../lib/atoms/amount/amount';
import { SkitBadge } from '../lib/atoms/badge/badge';
import { SkitButton } from '../lib/atoms/button/button';
import { SkitCheckbox } from '../lib/atoms/checkbox/checkbox';
import { SkitIcon } from '../lib/atoms/icon/icon';
import { SkitInput } from '../lib/atoms/input/input';
import { SkitRadio } from '../lib/atoms/radio/radio';
import { SkitSelect } from '../lib/atoms/select/select';
import { SkitSwitch } from '../lib/atoms/switch/switch';

const meta: Meta = {
  title: 'Examples/Transfer form',
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        SkitAmount,
        SkitBadge,
        SkitButton,
        SkitCheckbox,
        SkitIcon,
        SkitInput,
        SkitRadio,
        SkitSelect,
        SkitSwitch,
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'All atoms together in one reactive form. Submit it empty to see validation appear on every field at once ' +
          '(markAllAsTouched), then fill it in.',
      },
    },
  },
};
export default meta;

export const TransferForm: StoryObj = {
  name: 'Transfer form',
  render: () => {
    const form = new FormGroup({
      from: new FormControl('checking', { nonNullable: true }),
      recipient: new FormControl('', { nonNullable: true, validators: Validators.required }),
      iban: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^[A-Z]{2}\d{2}[A-Z0-9 ]{10,30}$/)],
      }),
      amount: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      }),
      currency: new FormControl('eur', { nonNullable: true }),
      speed: new FormControl('standard', { nonNullable: true }),
      saveRecipient: new FormControl(true, { nonNullable: true }),
      notify: new FormControl(false, { nonNullable: true }),
      confirm: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
    });
    const sending = signal(false);
    const sent = signal(false);
    const showError = (name: keyof typeof form.controls) => form.controls[name].invalid && form.controls[name].touched;

    return {
      props: {
        form,
        sending,
        sent,
        showError,
        submit: () => {
          form.markAllAsTouched();
          if (form.invalid) return;
          sending.set(true);
          setTimeout(() => {
            sending.set(false);
            sent.set(true);
          }, 1500);
        },
      },
      template: `
        <div class="skit-root skit:min-h-screen skit:bg-background skit:p-8">
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate
            class="skit:mx-auto skit:flex skit:max-w-lg skit:flex-col skit:gap-5 skit:rounded-lg skit:border skit:bg-surface skit:p-6">
            <h2 class="skit:mb-0">Send money</h2>

            <div>
              <label for="tf-from">From</label>
              <skit-select id="tf-from" formControlName="from">
                <option value="checking">Checking ·· 4821</option>
                <option value="savings">Savings ·· 1190</option>
              </skit-select>
            </div>

            <div>
              <label for="tf-recipient">Recipient</label>
              <skit-input id="tf-recipient" formControlName="recipient" autocomplete="name"
                aria-describedby="tf-recipient-error" />
              @if (showError('recipient')) {
                <small id="tf-recipient-error" class="skit:text-danger">Enter the recipient's name.</small>
              }
            </div>

            <div>
              <label for="tf-iban">IBAN</label>
              <skit-input id="tf-iban" formControlName="iban" placeholder="DE89 3704 0044 0532 0130 00"
                autocomplete="off" aria-describedby="tf-iban-error" />
              @if (showError('iban')) {
                <small id="tf-iban-error" class="skit:text-danger">Enter a valid IBAN, e.g. DE89 3704 0044 0532 0130 00.</small>
              }
            </div>

            <div class="skit:flex skit:gap-3">
              <div class="skit:flex-1">
                <label for="tf-amount">Amount</label>
                <skit-input id="tf-amount" formControlName="amount" inputmode="decimal" placeholder="0.00"
                  aria-describedby="tf-amount-error" />
                @if (showError('amount')) {
                  <small id="tf-amount-error" class="skit:text-danger">Enter an amount like 84.20.</small>
                }
              </div>
              <div class="skit:w-32">
                <label for="tf-currency">Currency</label>
                <skit-select id="tf-currency" formControlName="currency">
                  <option value="eur">EUR</option>
                  <option value="usd">USD</option>
                  <option value="gbp">GBP</option>
                </skit-select>
              </div>
            </div>

            <fieldset class="skit:m-0 skit:flex skit:flex-col skit:gap-2 skit:border-0 skit:p-0">
              <legend class="skit:mb-2 skit:text-label">Speed</legend>
              <skit-radio formControlName="speed" name="tf-speed" value="standard">Standard · 1–2 business days · free</skit-radio>
              <skit-radio formControlName="speed" name="tf-speed" value="instant">Instant · seconds · €1.00</skit-radio>
            </fieldset>

            <div class="skit:flex skit:flex-col skit:gap-3">
              <skit-checkbox formControlName="saveRecipient">Save recipient for next time</skit-checkbox>
              <skit-switch formControlName="notify">Notify me when the money arrives</skit-switch>
              <skit-checkbox formControlName="confirm">I confirm the recipient and the amount are correct</skit-checkbox>
              @if (showError('confirm')) {
                <small class="skit:text-danger">Please confirm before sending.</small>
              }
            </div>

            <div class="skit:flex skit:items-center skit:justify-between skit:border-t skit:pt-5">
              <span class="skit:text-body-sm skit:text-muted">
                You send
                @if (form.controls.amount.valid) {
                  <skit-amount [value]="'-' + form.controls.amount.value" [currency]="form.controls.currency.value" />
                } @else { — }
              </span>
              <div class="skit:flex skit:gap-2">
                <skit-button variant="ghost" type="reset" (click)="sent.set(false)">Clear</skit-button>
                <skit-button type="submit" [loading]="sending()"><skit-icon name="send" size="sm" /> Send</skit-button>
              </div>
            </div>

            @if (sent()) {
              <skit-badge tone="success" class="skit:self-start"><skit-icon name="check" size="sm" /> Transfer sent</skit-badge>
            }
          </form>
        </div>
      `,
    };
  },
};
