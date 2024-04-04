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
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { UserProfileService } from 'src/app/services/userProfile.service';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    AvatarModule,
    ButtonModule,
    ThemeComponent,
  ],
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
  private dataSharingService = inject(DataSharingService); // Inject DataSharingService

  isLogin$: Observable<boolean>;
  username$: Observable<string> | undefined;
  email$: Observable<string> | undefined;
  avatarCapsuleHide$: Observable<boolean> = of(false);
  userInitial: string = '';

  constructor() {
    this.isLogin$ = this.authService.isAuthenticated$.pipe(
      map((res: AuthenticatedResult) => res.isAuthenticated)
    );

    this.dataSharingService.currentUsername.subscribe(
      (username: string | undefined) => {
        if (username) {
          this.username$ = of(username);
          this.userInitial = username ? username.charAt(0).toUpperCase() : '';
          this.email$ = this.authService.userData$.pipe(
            switchMap((res: UserDataResult) => {
              return of(res.userData?.email || '');
            })
          );
          return;
        } else {
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
                    this.dataSharingService.setProfile(
                      profile?.Name,
                      res.userData?.email
                    );
                    this.username$ = of(profile?.Name || '');
                    this.userInitial = profile?.Name
                      ? profile.Name.charAt(0).toUpperCase()
                      : '';

                    return res.userData?.email;
                  })
                );
              } else {
                return of(null);
              }
            })
          );
        }
      }
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
    localStorage.removeItem('firstVisit');
  }

  LoginClick() {
    this.authService.authorize();
    localStorage.removeItem('firstVisit');
  }

  // AccountClick() {
  //   this.username$?.subscribe((username) => {
  //     this.router.navigate([`/user-manager/update/${username}`]);
  //   });
  // }
  AccountClick() {
    window.open(
      'https://authapp.dk-schweizer.com/profile',
      '_blank',
      'noreferrer'
    );
  }
}
