import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FxtRoleGuard } from 'fxt-core';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [CommonModule, FxtRoleGuard, CardModule, RouterModule],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent { }
