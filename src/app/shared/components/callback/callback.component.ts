import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-callback',
  template: `<p>Setting everything up...you are getting redirected...</p>`,
})
export class CallbackComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    const filter = this.route.snapshot.queryParamMap.get('error');
    if (filter == 'access_denied') {
      this.router.navigateByUrl('unauthorized');
    } else {
      this.router.navigateByUrl('menu');
    }
  }
}
