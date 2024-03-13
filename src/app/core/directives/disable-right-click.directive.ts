/* Disable Right Click
 * prevent users from accessing context menus or taking specific actions using the right mouse button
 */

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[FxtDisableRightClick]',
  standalone: true
})
export class DisableRightClickDirective {

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }

}
