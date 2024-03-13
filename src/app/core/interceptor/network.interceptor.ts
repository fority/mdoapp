import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, finalize } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor, OnDestroy {
  subs = new Subscription();
  activeRequests: number = 0;

  constructor(private loader: LoadingService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.activeRequests === 0) {
      this.loader.start();
    }
    this.activeRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loader.stop();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
