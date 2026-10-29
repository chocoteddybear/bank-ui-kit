import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the transfer page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Transfer money');
  });
});
