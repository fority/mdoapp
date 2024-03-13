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
import { Observable, map, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule],
  selector: 'app-login-btn',
  templateUrl: './login-btn.component.html',
  styleUrls: ['./login-btn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoginBtnComponent implements OnInit {
  private authService = inject(OidcSecurityService);
  private breakpointObserver = inject(BreakpointObserver);
  isLogin$: Observable<boolean>;
  username$: Observable<string> | undefined;
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
