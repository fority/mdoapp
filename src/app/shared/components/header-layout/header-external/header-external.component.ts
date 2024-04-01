import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticatedResult,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Observable, map } from 'rxjs';
import { LoginBtnComponent } from '../../login-btn/login-btn.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    PanelMenuModule,
    OverlayPanelModule,
    CardModule,
    ButtonModule,
    LoginBtnComponent,
  ],
  selector: 'app-header-external',
  templateUrl: './header-external.component.html',
  styleUrls: ['./header-external.component.less'],
})
export class HeaderExternalComponent {
  private router = inject(Router);
  private authService = inject(OidcSecurityService);
  isLogin$: Observable<boolean>;

  items: MenuItem[] | undefined;
  menuList: MenuItem[] | undefined;
  products: MenuItem[] | undefined;
  infos: MenuItem[] | undefined;
  promotions: MenuItem[] | undefined;

  isMenuVisible: boolean = false;

  constructor() {
    this.isLogin$ = this.authService.isAuthenticated$.pipe(
      map((res: AuthenticatedResult) => {
        return res.isAuthenticated;
      })
    );
  }

  LogoutClick() {
    // this.authService.logoff().pipe(take(1)).subscribe();
    this.authService.logoff().subscribe();
  }

  LoginClick() {
    this.authService.authorize();
  }

  ngOnInit() {
    this.AccountMenu();
    this.ProductMenu();
    this.InfoMenu();
    this.PromotionMenu();
    this.MenuList();
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  AccountMenu() {
    this.items = [
      {
        label: 'Dashboard',
        routerLink: '/external',
      },
      {
        label: 'My Account',
        routerLink: '/external/profile/my-account',
      },
      { separator: true, styleClass: 'custom-divider' },
      {
        label: 'Log Out',
        command: () => this.LogoutClick(),
      },
    ];
  }

  ProductMenu() {
    this.products = [
      {
        label: 'Gaming Chair',
      },
      {
        label: 'Merchandise',
        routerLink: '/external/product/merchandise',
      },
    ];
  }

  InfoMenu() {
    this.infos = [
      {
        label: 'News & Blogs',
      },
      {
        label: 'Courses',
      },
    ];
  }

  PromotionMenu() {
    this.promotions = [
      {
        label: 'Consumer Promo',
      },
      {
        label: 'Trade promo',
      },
    ];
  }

  MenuList() {
    this.menuList = [
      {
        label: 'SEAT COVER',
        routerLink: '/external/seatcover/prime-selection',
        command: () => this.toggleMenu(),
      },
      {
        label: 'PROMOTION',
        escape: false,
        items: [
          {
            label: 'Consumer Promo',
          },
          {
            label: 'Trade Promo',
          },
        ],
      },
      {
        label: 'INFO',
        items: [
          {
            label: 'News & Blogs',
          },
          {
            label: 'Courses',
          },
        ],
      },
      {
        label: 'PRODUCT',
        items: [
          {
            label: 'Gaming Chair',
          },
          {
            label: 'Merchandise',
            routerLink: '/external/product/merchandise',
            command: () => this.toggleMenu(),
          },
        ],
      },
      {
        label: 'GALLERY',
        items: [],
      },
      {
        label: 'ABOUT US',
      },
    ];
  }

  RequestHistory() {
    this.router.navigate(['/external/request/history']);
  }
}
