/* CopyToClipboard
 * enable users to copy text when they click on an element.
 */
import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: '[FxtCopyToClipboard]',
  standalone: true
})
export class CopyToClipboardDirective {
  private el = inject(ElementRef);
  @Input() appCopyToClipboard: string = '';


  @HostListener('click')
  onClick() {
    if (this.appCopyToClipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = this.appCopyToClipboard;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

}
