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
import { Observable, map, of, switchMap } from 'rxjs';
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
  userInitial: string = '';
  constructor() {
    this.isLogin$ = this.authService.isAuthenticated$.pipe(
      map((res: AuthenticatedResult) => res.isAuthenticated)
    );

    this.email$ = this.authService.userData$.pipe(
      switchMap((res: UserDataResult) => {
        if (res.userData?.email) {
          let query: GridifyQueryExtend = {} as GridifyQueryExtend;

          query.Page = DefaultPage;
          query.PageSize = DefaultPageSize;
          query.OrderBy = null;
          query.Filter = `Email=${res.userData?.email}`;
          query.Includes = null;
          query.Select = 'Email,Name';

          return this.profileService.GetOne(query).pipe(
            map((profile) => {
              this.username$ = of(profile?.Name);
              this.userInitial = profile?.Name
                ? profile.Name.charAt(0).toUpperCase()
                : ''; // Update userInitial
              return res.userData?.email;
            })
          );
        } else {
          return of(null);
        }
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