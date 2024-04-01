import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ThemeService } from 'src/app/services/theme-service.service';
import { LoginBtnComponent } from '../login-btn/login-btn.component';
import { ProfileComponent } from '../profile/profile.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [
    MenubarModule,
    RouterModule,
    SidebarComponent,
    LoginBtnComponent,
    ProfileComponent,
  ],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private themeService = inject(ThemeService);

  isDarkMode: boolean = false;
  sidebarVisible1: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.themeService.selectedTheme$.subscribe((theme) => {
      if (
        theme?.endsWith('-dark') ||
        theme.startsWith('arya') ||
        theme.startsWith('vela') ||
        theme.startsWith('luna')
      ) {
        this.isDarkMode = true;
      } else {
        this.isDarkMode = false;
      }
      this.cdr.detectChanges();
    });
  }

  getLogoSrc(): string {
    return this.isDarkMode
      ? '../../../../assets/logo-dark.png'
      : '../../../../assets/new-logo.png';
  }
}
