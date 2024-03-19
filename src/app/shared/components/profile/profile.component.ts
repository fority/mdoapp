import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  AuthenticatedResult,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Observable, map, of } from 'rxjs';
import { DefaultPage, DefaultPageSize } from 'src/app/core/models/sharedModels';
import { GridifyQueryExtend } from 'src/app/core/utils/GridifyHelpers';
import { UserProfileService } from 'src/app/services/userProfile.service';

@Component({
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, AvatarModule, ButtonModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  private authService = inject(OidcSecurityService);
  private breakpointObserver = inject(BreakpointObserver);
  private profileService = inject(UserProfileService);

  isLogin$: Observable<boolean>;
  username$: Observable<string> | undefined;
  email$: Observable<string> | undefined;
  avatarCapsuleHide$: Observable<boolean> = of(false);

  constructor() {
    this.isLogin$ = this.authService.isAuthenticated$.pipe(
      map((res: AuthenticatedResult) => {
        return res.isAuthenticated;
      })
    );
    this.username$ = this.authService.userData$.pipe(
      map((res: UserDataResult) => {
        return res.userData?.name;
      })
    );
    this.email$ = this.authService.userData$.pipe(
      map((res: UserDataResult) => {
        if (res.userData?.email) {
          let query: GridifyQueryExtend = {} as GridifyQueryExtend;

          query.Page = DefaultPage;
          query.PageSize = DefaultPageSize;
          query.OrderBy = null;
          query.Filter = `Email=${res.userData?.email}`;
          query.Includes = null;
          query.Select = 'Email,Name';

          this.profileService.GetOne(query).subscribe((res) => {
            this.username$ = of(res?.Name);
          });
        }

        return res.userData?.email;
      })
    );
  }

  ngOnInit() {
    this.avatarCapsuleHide$ = this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(
        map((state: BreakpointState) => {
          return state.matches;
        })
      );
  }
  LogoutClick() {
    this.authService.logoff().subscribe();
  }

  LoginClick() {
    this.authService.authorize();
  }

  ProfileClick() {
    window.open('https://authserver.dk-schweizer.com', '_blank', 'noreferrer');
  }
}
