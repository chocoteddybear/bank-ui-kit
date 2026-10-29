import { Component } from '@angular/core';
import { TransferPage } from './transfer/transfer-page';

@Component({
  imports: [TransferPage],
  selector: 'app-root',
  template: '<app-transfer-page />',
})
export class App {}
