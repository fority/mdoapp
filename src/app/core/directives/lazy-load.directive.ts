/* lazy load directive
 * improve the performance and user experience of website by loading images only when they are visible on the screen
 */
import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[FxtLazyLoad]',
  standalone: true
})
export class LazyLoadDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isElementInViewport()) {
      this.loadImage();
    }
  }

  private isElementInViewport(): boolean {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private loadImage() {
    const dataSrc = this.el.nativeElement.getAttribute('data-src');
    if (dataSrc) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', dataSrc);
      this.el.nativeElement.removeAttribute('data-src');
    }
  }

}
