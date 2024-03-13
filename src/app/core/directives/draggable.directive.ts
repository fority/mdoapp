/* Draggable
 * enable drag-and-drop functionality for elements
 */
import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[FxtDraggable]',
  standalone: true
})
export class DraggableDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private isDragging = false;

  constructor() {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    this.renderer.setStyle(this.el.nativeElement, 'user-drag', 'none');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    event.preventDefault();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const offsetX = event.clientX - this.el.nativeElement.getBoundingClientRect().left;
      const offsetY = event.clientY - this.el.nativeElement.getBoundingClientRect().top;
      this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
      this.renderer.setStyle(this.el.nativeElement, 'left', `${offsetX}px`);
      this.renderer.setStyle(this.el.nativeElement, 'top', `${offsetY}px`);
    }
  }

}
