import { Component, inject } from '@angular/core';
import { AuthenticatedResult, LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { PrimeNGConfig } from 'primeng/api';
import { delay, filter, switchMap } from 'rxjs';
import { UserProfileService } from './services/userProfile.service';
import { RoleService, LoadingService, GridifyQueryExtend, DefaultPage, DefaultPageSize } from 'fxt-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  private readonly authService = inject(OidcSecurityService);
  private readonly roleService = inject(RoleService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly primengConfig = inject(PrimeNGConfig);

  isSpinning$ = inject(LoadingService).isLoading$.pipe(delay(0));

  ngOnInit() {
    this.authService
      .checkAuth()
      .pipe(
        switchMap(({ userData }: LoginResponse) => {
          this.roleService.UpdateUserRole(userData?.role || []);

          return this.authService.isAuthenticated$.pipe(
            filter((res: AuthenticatedResult) => res.isAuthenticated),
            switchMap(() => {
              const query: GridifyQueryExtend = {} as GridifyQueryExtend;

              query.Page = DefaultPage;
              query.PageSize = DefaultPageSize;
              query.Filter = `Id=${userData?.sub}`;
              query.Select = 'Email,Name';

              return this.userProfileService.GetOne(query);
            })
          );
        })
      )
      .subscribe((x) => {
        this.userProfileService.UpdateUserProfile(x);
      });

    this.primengConfig.ripple = true;
  }
}
