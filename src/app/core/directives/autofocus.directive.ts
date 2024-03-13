/* autofocus directive
 *  allows you to automatically focus an input field when a page loads
 */
import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[FxtAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  private el = inject(ElementRef)

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
