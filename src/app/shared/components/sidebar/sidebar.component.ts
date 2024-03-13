import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';

interface CustomMenuItem extends MenuItem {
  roles?: string[];
}
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    MenuModule,
    ButtonModule,
    PanelMenuModule,
  ],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() sidebarVisible = false;
  @Output() HideSideBarEmitter = new EventEmitter();

  userRoles: string[] = [];
  items: MenuItem[] = [];

  private router = inject(Router);

  ngOnInit(): void {
    this.items = [
      {
        label: '<img src="assets/mdo.svg" width="7%"/>&nbsp; MDO',
        escape: false,
        visible: true,
        command: () => {
          this.router.navigateByUrl('/mdo/view');
          this.HideSideBar();
        },
      },
      {
        label: '<img src="" width="7%"/>&nbsp; Settings',
        escape: false,
        visible: true,
        items: [
          {
            label: '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Shipper',
            command: () => {
              this.router.navigateByUrl('/setting/shipper');
              this.HideSideBar();
            },
          },
          {
            label: '\xa0\xa0\xa0\xa0\xa0\xa0' + 'UOM',
            command: () => {
              this.router.navigateByUrl('/setting/uom');
              this.HideSideBar();
            },
          },
          {
            label: '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Reason',
            command: () => {
              this.router.navigateByUrl('/setting/reason-code');
              this.HideSideBar();
            },
          },
          {
            label: '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Ship To',
            command: () => {
              this.router.navigateByUrl('/setting/ship-to');
              this.HideSideBar();
            },
          },
          {
            label: '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Requester',
            command: () => {
              this.router.navigateByUrl('/setting/request-by');
              this.HideSideBar();
            },
          },
          {
            label: '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Manager User',
            command: () => {
              this.router.navigateByUrl('/user-manager/view');
              this.HideSideBar();
            },
          },
        ],
      },
    ];
  }

  constructor() {
    // this.roleService.userRoleSubject.pipe(take(1)).subscribe((_roles) => {
    //   this.userRoles = _roles;
    //   this.SideMenuItems.forEach((menuItem) => {
    //     if (menuItem.roles) menuItem.visible = this.IsVisible(menuItem.roles);
    //   });
    // });
  }

  IsVisible = (roles: string[]) =>
    roles?.some((role) => this.userRoles.includes(role));

  HideSideBar = () => this.HideSideBarEmitter.emit();
}
