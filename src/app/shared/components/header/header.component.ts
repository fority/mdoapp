import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ThemeService } from 'src/app/services/theme-service.service';
import { LoginBtnComponent } from '../login-btn/login-btn.component';
import { ProfileComponent } from '../profile/profile.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  standalone: true,
  imports: [
    MenubarModule,
    RouterModule,
    SidebarComponent,
    LoginBtnComponent,
    ProfileComponent,
    ThemeComponent,
  ],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private themeService = inject(ThemeService);

  isDarkMode: boolean = false;
  sidebarVisible1: boolean = false;

  constructor() {
    this.themeService.isDarkMode$.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
  }
}
