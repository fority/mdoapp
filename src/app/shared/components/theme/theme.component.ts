import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';
import { ThemeService } from 'src/app/services/theme-service.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    InputSwitchModule,
    ButtonModule,
    SidebarModule,
    DividerModule,
    AvatarModule,
    FormsModule,
  ],
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeComponent implements OnInit {
  private themeService = inject(ThemeService);
  visible: boolean = false;
  checked: boolean = false;
  selectedThemeIndexes: { [key: string]: number } = {};
  selectedTheme: string = '';

  Themes = [
    {
      color:
        'linear-gradient(180deg, #4dac9c 0%, rgba(77, 172, 156, 0.5) 100%)',
      id: 'lara-light-teal',
      theme: 'lara',
    },
    {
      color: 'linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.5) 100%)',
      id: 'lara-light-blue',
      theme: 'lara',
    },
    {
      color: 'linear-gradient(180deg, #585fe0 0%, rgba(88, 95, 224, 0.5) 100%)',
      id: 'lara-light-purple',
      theme: 'lara',
    },
    {
      color: 'linear-gradient(180deg, #027bff 0%, rgba(2, 123, 255, 0.5) 100%)',
      id: 'bootstrap4-dark-blue',
      theme: 'bootstrap',
    },
    {
      color:
        'linear-gradient(180deg, #893cae 0%, rgba(137, 60, 174, 0.5) 100%)',
      id: 'bootstrap4-dark-purple',
      theme: 'bootstrap',
    },
    {
      color:
        'linear-gradient(180deg, #664beb 0%, rgba(102, 75, 235, 0.5) 100%)',
      id: 'soho-light',
      theme: 'soho',
    },
    {
      color:
        'linear-gradient(180deg, #4a67c9 0%, rgba(74, 103, 201, 0.5) 100%)',
      id: 'viva-light',
      theme: 'viva',
    },
    {
      color:
        'linear-gradient(180deg, #81a1c1 0%, rgba(129, 161, 193, 0.5) 100%)',
      id: 'mira',
      theme: 'mira',
    },
  ];

  ngOnInit(): void {
    this.checked = this.themeService.isDarkMode();
    this.selectedTheme = this.themeService.getSelectedTheme();
    const themeType = this.selectedTheme.split('-')[0];
    const themeIndex = this.getThemeIndex(this.selectedTheme);
    this.applyTheme(this.selectedTheme, themeIndex, themeType);
  }

  isSelectedTheme(index: number, themeType: string): boolean {
    return this.selectedThemeIndexes[themeType] === index;
  }

  toggleSidebar() {
    this.visible = !this.visible;
  }

  toggleDarkMode() {
    this.checked != this.checked;
    document.documentElement.setAttribute(
      'data-theme',
      this.checked ? 'dark' : 'light'
    );
    this.themeService.toggleDarkMode(this.checked);
  }

  getThemeIndex(themeId: string): number {
    const theme = this.Themes.find((theme) => theme.id === themeId);
    return theme ? this.Themes.indexOf(theme) : -1;
  }

  applyTheme(themeId: string, index: number, themeType: string) {
    this.selectedThemeIndexes[themeType] = index;

    this.themeService.switchTheme(themeId);
    this.themeService.setSelectedTheme(themeId);

    for (const key in this.selectedThemeIndexes) {
      if (key !== themeType) {
        this.selectedThemeIndexes[key] = -1;
      }
    }
  }
  getThemesByType(themeType: string): any[] {
    return this.Themes.filter((theme) => theme.theme === themeType);
  }

  showThemesByType(themeType: string): boolean {
    return this.getThemesByType(themeType).length > 0;
  }
}
