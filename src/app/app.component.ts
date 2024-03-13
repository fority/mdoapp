import { Component, inject } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { delay } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
import { RoleService } from './core/services/role.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  readonly authService = inject(OidcSecurityService);
  readonly roleService = inject(RoleService);
  private messageService = inject(MessageService);

  isSpinning$ = inject(LoadingService).isLoading$.pipe(delay(0));
  constructor(private primengConfig: PrimeNGConfig) {
    this.messageService.add({
      severity: 'error',
      summary: 'Apps',
      detail: 'respond.Message',
    });
  }

  ngOnInit() {
    this.authService.checkAuth().subscribe(({ userData }: LoginResponse) => {
      this.roleService.UpdateUserRole(userData?.role || []);
    });
    this.primengConfig.ripple = true;
  }
}
