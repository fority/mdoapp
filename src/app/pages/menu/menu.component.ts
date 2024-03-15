import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RoleGuardDirective } from 'src/app/core/directives/role-guard.directive';

@Component({
  standalone: true,
  imports: [CommonModule, RoleGuardDirective, CardModule, RouterModule],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent {}
