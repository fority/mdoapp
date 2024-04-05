import { Component, inject } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { PrimeNGConfig } from 'primeng/api';
import { delay } from 'rxjs';
import { DefaultPage, DefaultPageSize } from './core/models/sharedModels';
import { LoadingService } from './core/services/loading.service';
import { RoleService } from './core/services/role.service';
import { GridifyQueryExtend } from './core/utils/GridifyHelpers';
import { UserProfileService } from './services/userProfile.service';

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
    this.authService.checkAuth().subscribe(({ userData }: LoginResponse) => {
      this.roleService.UpdateUserRole(userData?.role || []);

      const query: GridifyQueryExtend = {} as GridifyQueryExtend;

      query.Page = DefaultPage;
      query.PageSize = DefaultPageSize;
      query.Filter = `Id=${userData?.sub}`;
      query.Select = 'Email,Name';

      this.userProfileService.GetOne(query).subscribe(x => {
        this.userProfileService.UpdateUserProfile(x);
      })
    });
    this.primengConfig.ripple = true;
  }
}
