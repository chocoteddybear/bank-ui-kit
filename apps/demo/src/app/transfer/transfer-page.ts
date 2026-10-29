import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  SkitAccountCard,
  SkitAlert,
  SkitAmount,
  SkitAvatar,
  SkitBadge,
  SkitButton,
  SkitCheckbox,
  SkitDetailList,
  SkitDetailRow,
  SkitFormField,
  SkitIcon,
  SkitInput,
  SkitInsuredNotice,
  SkitMoneyFlow,
  SkitRadio,
  SkitSelect,
  SkitSiteFooter,
  SkitSpinner,
  SkitSplitPage,
  SkitStepper,
  SkitSwitch,
  type SkitColorMode,
  type SkitMoneyFlowState,
} from '@vladlev/skit';
import { HowPanel } from '../how-panel/how-panel';
import { formatDate, formatUsd, isoDate, parseCents, toDecimal } from '../data/money';
import { Account, Frequency, TransferReceipt, TransferService } from '../data/transfer.service';

type Step = 'details' | 'review' | 'sending' | 'done';
type Field = 'to' | 'amount' | 'date' | 'memo';

const STEPS: Step[] = ['details', 'review', 'sending', 'done'];
const STEP_LABELS = ['Details', 'Review', 'Sending', 'Done'];
/** Element ids of the fields (set with skit-form-field's `for`), so the error summary can link to them. */
const FIELD_IDS: Record<Field, string> = { to: 'to-account', amount: 'amount', date: 'date', memo: 'memo' };
const FIELD_LABELS: Record<Field, string> = { to: 'To', amount: 'Amount', date: 'Date', memo: 'Memo' };
const MEMO_MAX = 140;

@Component({
  selector: 'app-transfer-page',
  imports: [
    ReactiveFormsModule,
    HowPanel,
    SkitAccountCard,
    SkitAlert,
    SkitAmount,
    SkitAvatar,
    SkitBadge,
    SkitButton,
    SkitCheckbox,
    SkitDetailList,
    SkitDetailRow,
    SkitFormField,
    SkitIcon,
    SkitInput,
    SkitInsuredNotice,
    SkitMoneyFlow,
    SkitRadio,
    SkitSelect,
    SkitSiteFooter,
    SkitSpinner,
    SkitSplitPage,
    SkitStepper,
    SkitSwitch,
  ],
  templateUrl: './transfer-page.html',
  styleUrl: './transfer-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferPage {
  private readonly service = inject(TransferService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  protected readonly accounts = this.service.accounts;
  protected readonly loading = this.service.loading;
  protected readonly stepLabels = STEP_LABELS;
  protected readonly memoMax = MEMO_MAX;
  protected readonly today = isoDate();

  protected readonly form = new FormGroup({
    from: new FormControl('checking', { nonNullable: true, validators: Validators.required }),
    to: new FormControl('savings', { nonNullable: true, validators: [Validators.required, (c) => this.notSameAccount(c)] }),
    amount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, (c) => this.validAmount(c)],
    }),
    date: new FormControl(this.today, {
      nonNullable: true,
      validators: [Validators.required, (c) => this.notInPast(c)],
    }),
    frequency: new FormControl<Frequency>('once', { nonNullable: true }),
    memo: new FormControl('', { nonNullable: true, validators: Validators.maxLength(MEMO_MAX) }),
    emailReceipt: new FormControl(true, { nonNullable: true }),
  });
  protected readonly authorize = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });

  /** Demo controls: brand on/off shows the token bridge working; mode is the kit's light/dark switch. */
  protected readonly brand = new FormControl(true, { nonNullable: true });
  protected readonly mode = new FormControl<SkitColorMode>('system', { nonNullable: true });

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  private readonly brandOn = toSignal(this.brand.valueChanges, { initialValue: this.brand.value });
  private readonly modeValue = toSignal(this.mode.valueChanges, { initialValue: this.mode.value });

  protected readonly step = signal<Step>('details');
  protected readonly stepIndex = computed(() => STEPS.indexOf(this.step()));
  /** Past the last step once the transfer is done, so the stepper checks every step, Done included. */
  protected readonly stepperCurrent = computed(() => (this.step() === 'done' ? STEPS.length : this.stepIndex()));
  protected readonly receipt = signal<TransferReceipt | null>(null);
  /** Problems listed above the form after a failed Review; kept in sync until all are fixed. */
  protected readonly summary = signal<{ id: string; message: string }[]>([]);

  protected readonly fromAccount = computed(() => this.find(this.value().from));
  protected readonly toAccount = computed(() => this.find(this.value().to));
  /** The amount once it parses, even before other checks pass, so the preview follows the typing. */
  protected readonly amountCents = computed(() => parseCents(this.value().amount ?? ''));
  protected readonly amountDecimal = computed(() => {
    const cents = this.amountCents();
    return cents ? toDecimal(cents) : null;
  });
  protected readonly memoLength = computed(() => (this.value().memo ?? '').length);
  protected readonly isScheduled = computed(() => (this.value().date ?? this.today) > this.today);

  protected readonly flowState = computed<SkitMoneyFlowState>(() =>
    this.step() === 'sending' ? 'sending' : this.step() === 'done' ? 'done' : 'idle',
  );

  /** Balances after the transfer, shown live while the form is filled in. Scheduled transfers don't move money yet. */
  protected readonly projection = computed(() => {
    const cents = this.amountCents();
    const from = this.fromAccount();
    const to = this.toAccount();
    if (!cents || !from || !to || from.id === to.id || this.step() === 'done' || this.isScheduled()) return null;
    return { from: toDecimal(from.balance - cents), to: toDecimal(to.balance + cents) };
  });

  protected readonly toDecimal = toDecimal;
  protected readonly formatUsd = formatUsd;
  protected readonly formatDate = formatDate;

  constructor() {
    this.form.controls.from.valueChanges.subscribe(() => {
      this.form.controls.to.updateValueAndValidity({ emitEvent: false });
      this.form.controls.amount.updateValueAndValidity({ emitEvent: false });
    });

    this.form.statusChanges.subscribe(() => {
      if (this.summary().length) this.summary.set(this.problems());
    });

    // Each step gets its own page title, so screen reader users and browser history know where they are.
    const title = inject(Title);
    effect(() => title.setTitle(`${STEP_LABELS[this.stepIndex()]} · Transfer money · Navy Federal (concept)`));

    effect(() => {
      const root = this.document.documentElement;
      if (this.brandOn()) root.setAttribute('data-brand', 'navy-federal');
      else root.removeAttribute('data-brand');
    });

    effect(() => {
      const root = this.document.documentElement;
      const mode = this.modeValue();
      if (mode === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', mode);
    });
  }

  protected error(name: Field): string | undefined {
    const errors = this.form.controls[name].errors;
    if (!errors) return undefined;
    switch (name) {
      case 'amount':
        if (errors['required']) return 'Enter an amount.';
        if (errors['format']) return 'Enter an amount like 250 or 250.75.';
        if (errors['zero']) return 'The amount must be more than $0.00.';
        if (errors['balance']) return `This is more than the available ${formatUsd(errors['balance'].available)}.`;
        return undefined;
      case 'to':
        return errors['same'] ? 'Choose a different account than the one you send from.' : 'Choose an account.';
      case 'date':
        return errors['past'] ? 'Choose today or a later date.' : 'Choose a date.';
      case 'memo':
        return `Keep the memo under ${MEMO_MAX} characters.`;
    }
  }

  protected review(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.summary.set(this.problems());
      this.focusAfterRender('error-summary');
      return;
    }
    this.summary.set([]);
    this.authorize.reset(false);
    this.goTo('review');
  }

  protected back(): void {
    this.goTo('details');
  }

  protected focusField(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.focus();
  }

  protected async confirm(): Promise<void> {
    this.authorize.markAsTouched();
    if (this.authorize.invalid) return;
    const value = this.form.getRawValue();
    this.step.set('sending');
    this.form.disable({ emitEvent: false });
    const receipt = await this.service.send({
      fromId: value.from,
      toId: value.to,
      amount: parseCents(value.amount) ?? 0,
      date: value.date,
      frequency: value.frequency,
      memo: value.memo.trim(),
      emailReceipt: value.emailReceipt,
    });
    this.receipt.set(receipt);
    this.goTo('done');
  }

  protected startOver(): void {
    this.form.enable({ emitEvent: false });
    this.form.reset();
    this.receipt.set(null);
    this.goTo('details');
  }

  /** Moves focus to the new step's heading, so keyboard and screen reader users start reading there. */
  private goTo(step: Step): void {
    this.step.set(step);
    this.focusAfterRender('step-title');
  }

  private focusAfterRender(id: string): void {
    afterNextRender(() => this.document.getElementById(id)?.focus(), { injector: this.injector });
  }

  private problems(): { id: string; message: string }[] {
    return (Object.keys(FIELD_IDS) as Field[])
      .map((field) => ({ field, message: this.error(field) }))
      .filter((problem) => problem.message)
      .map(({ field, message }) => ({ id: FIELD_IDS[field], message: `${FIELD_LABELS[field]}: ${message}` }));
  }

  protected accountName(id: string): string {
    const account = this.find(id);
    return account ? `${account.name} ·· ${account.number.slice(-4)}` : '';
  }

  private find(id: string | undefined): Account | undefined {
    return id ? this.accounts().find((account) => account.id === id) : undefined;
  }

  private notSameAccount(control: AbstractControl): ValidationErrors | null {
    return control.value && control.value === this.form?.controls.from.value ? { same: true } : null;
  }

  private validAmount(control: AbstractControl<string>): ValidationErrors | null {
    if (!control.value) return null;
    const cents = parseCents(control.value);
    if (cents === null) return { format: true };
    if (cents === 0) return { zero: true };
    const available = this.service.find(this.form?.controls.from.value ?? '')?.balance;
    return available !== undefined && cents > available ? { balance: { available } } : null;
  }

  private notInPast(control: AbstractControl<string>): ValidationErrors | null {
    return control.value && control.value < isoDate() ? { past: true } : null;
  }
}
