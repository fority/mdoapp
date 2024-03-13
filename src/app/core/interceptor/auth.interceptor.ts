import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(OidcSecurityService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.getAccessToken().subscribe((_token) => {
      if (_token) {
        request = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + _token),
        });
      }
    });
    return next.handle(request);
  }
}
