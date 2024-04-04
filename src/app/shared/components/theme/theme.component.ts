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

  darkModeEnabled: boolean = false;
  isDarkMode: boolean = false;
  themeIndex: number = -1;

  Themes = [
    {
      color: 'linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.5) 100%)',
      id: 'lara-blue',
      theme: 'lara',
    },
    {
      color: 'linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.5) 100%)',
      id: 'lara-indigo',
      theme: 'lara',
    },
    {
      color: 'linear-gradient(180deg, #585fe0 0%, rgba(88, 95, 224, 0.5) 100%)',
      id: 'lara-purple',
      theme: 'lara',
    },
    {
      color:
        'linear-gradient(180deg, #4dac9c 0%, rgba(77, 172, 156, 0.5) 100%)',
      id: 'lara-teal',
      theme: 'lara',
    },

    {
      color: 'linear-gradient(180deg, #027bff 0%, rgba(2, 123, 255, 0.5) 100%)',
      id: 'bootstrap4-blue',
      theme: 'bootstrap4',
    },
    {
      color:
        'linear-gradient(180deg, #893cae 0%, rgba(137, 60, 174, 0.5) 100%)',
      id: 'bootstrap4-purple',
      theme: 'bootstrap4',
    },
    {
      color: '#0078d4',
      id: 'fluent-light',
      theme: 'fluent',
    },
    {
      color: '#FFE082',
      id: 'luna-amber',
      theme: 'luna',
    },
    {
      color: '#81D4FA',
      id: 'luna-blue',
      theme: 'luna',
    },
    {
      color: '#C5E1A5',
      id: 'luna-green',
      theme: 'luna',
    },
    {
      color: '#F48FB1',
      id: 'luna-pink',
      theme: 'luna',
    },
    {
      color: '#673AB7',
      id: 'md-deeppurple',
      theme: 'md',
    },
    {
      color: '#3F51B5',
      id: 'md-indigo',
      theme: 'md',
    },
    {
      color: '#673AB3',
      id: 'mdc-deeppurple',
      theme: 'mdc',
    },
    {
      color: '#3F51B5',
      id: 'mdc-indigo',
      theme: 'mdc',
    },
    {
      color:
        'linear-gradient(180deg, #664beb 0%, rgba(102, 75, 235, 0.5) 100%)',
      id: 'soho',
      theme: 'soho',
    },
    {
      color:
        'linear-gradient(180deg, #4a67c9 0%, rgba(74, 103, 201, 0.5) 100%)',
      id: 'viva',
      theme: 'viva',
    },
    {
      color:
        'linear-gradient(180deg, #81a1c1 0%, rgba(129, 161, 193, 0.5) 100%)',
      id: 'mira',
      theme: 'mira',
    },
    {
      color: '#1174c0',
      id: 'nano',
      theme: 'nano',
    },
    {
      color: '#007ad9',
      id: 'nova',
      theme: 'nova',
    },
    {
      color: '#007ad9',
      id: 'nova-accent',
      theme: 'nova',
    },
    {
      color: '#007ad9',
      id: 'nova-alt',
      theme: 'nova',
    },
    {
      color: '#7B95A3',
      id: 'rhea',
      theme: 'rhea',
    },
    {
      color: '#2196F3',
      id: 'saga-blue',
      theme: 'saga',
    },
    {
      color: '#4CAF50',
      id: 'saga-green',
      theme: 'saga',
    },
    {
      color: '#FFC107',
      id: 'saga-orange',
      theme: 'saga',
    },
    {
      color: '#9C27B0',
      id: 'saga-purple',
      theme: 'saga',
    },
    {
      color: '#64B5F6',
      id: 'vela-blue',
      theme: 'vela',
    },
    {
      color: '#81C784',
      id: 'vela-green',
      theme: 'vela',
    },
    {
      color: '#FFD54F',
      id: 'vela-orange',
      theme: 'vela',
    },
    {
      color: '#BA68C8',
      id: 'vela-purple',
      theme: 'vela',
    },

    {
      color: '#64B5F6',
      id: 'arya-blue',
      theme: 'arya',
    },
    {
      color: '#81C784',
      id: 'arya-green',
      theme: 'arya',
    },
    {
      color: '#FFD54F',
      id: 'arya-orange',
      theme: 'arya',
    },
    {
      color: '#BA68C8',
      id: 'arya-purple',
      theme: 'arya',
    },
  ];

  DarkTheme = [
    {
      id: 'lara-blue-dark',
      theme: 'lara',
    },
    {
      id: 'lara-indigo-dark',
      theme: 'lara',
    },
    {
      id: 'lara-purple-dark',
      theme: 'lara',
    },
    {
      id: 'lara-teal-dark',
      theme: 'lara',
    },
    {
      id: 'bootstrap4-blue-dark',
      theme: 'bootstrap4',
    },
    {
      id: 'bootstrap4-purple-dark',
      theme: 'bootstrap4',
    },
    {
      id: 'md-deeppurple-dark',
      theme: 'md',
    },
    {
      id: 'md-indigo-dark',
      theme: 'md',
    },
    {
      id: 'mdc-deeppurple-dark',
      theme: 'mdc',
    },
    {
      id: 'mdc-indigo-dark',
      theme: 'mdc',
    },
    {
      id: 'soho-dark',
      theme: 'soho',
    },
    {
      id: 'viva-dark',
      theme: 'viva',
    },
  ];

  ngOnInit(): void {
    let savedTheme = localStorage.getItem('selectedTheme');
    this.checked = this.themeService.isDarkMode();

    if (savedTheme && savedTheme.endsWith('-dark') && this.checked) {
      this.checked = true;
      this.darkModeEnabled = true;
    } else {
      this.checked = false;
      if (savedTheme) {
        this.darkModeEnabled = this.checkIfDarkThemeExists(savedTheme);
      }
    }

    this.selectedTheme = savedTheme || 'lara-blue';
    let theme = this.selectedTheme;

    this.themeService.toggleDarkMode(this.checked);

    if (this.selectedTheme.endsWith('-dark')) {
      theme = this.selectedTheme.replace('-dark', '');
    }
    this.themeIndex = this.getThemeIndex(theme);

    const themeType = this.selectedTheme.split('-')[0];
    this.applyTheme(this.selectedTheme, this.themeIndex, themeType);
    this.isSelectedTheme(this.themeIndex, themeType);
  }

  //enabled or disabled dark Mode
  checkIfDarkThemeExists(themeName: string): boolean {
    if (this.DarkTheme.find((theme) => theme.id === themeName)) {
      return true; // Found the dark theme
    }

    return false; // Dark theme not found
  }
  isSelectedTheme(index: number, themeType: string): boolean {
    localStorage.removeItem('selectedThemeIndexes');
    this.themeService.setSelectedThemeIndex(themeType, index);
    localStorage.setItem('selectedTheme', this.selectedTheme);

    return (
      this.selectedThemeIndexes[themeType] === index &&
      this.selectedTheme === this.getThemesByType(themeType)[index].id
    );
  }

  getAvatarImagePath(themeType: string): string {
    const imagePath = `../../../../assets/`;

    switch (themeType) {
      case 'lara':
        return imagePath + 'lara-light-teal.png';
      case 'bootstrap4':
        return imagePath + 'bootstrap4.svg';
      case 'luna':
        return imagePath + 'luna-blue.png';
      case 'md':
        return imagePath + 'md-light-indigo.svg';
      case 'mdc':
        return imagePath + 'md-light-deeppurple.svg';
      case 'saga':
        return imagePath + 'saga-blue.png';
      case 'vela':
        return imagePath + 'vela-blue.png';
      case 'arya':
        return imagePath + 'arya-blue.png';
      case 'nova':
        return imagePath + 'nova.png';
      case 'soho':
        return imagePath + 'soho-light.png';
      case 'fluent':
        return imagePath + 'fluent-light.png';
      case 'viva':
        return imagePath + 'viva-light.svg';
      case 'mira':
        return imagePath + 'mira.jpg';
      case 'nano':
        return imagePath + 'nano.jpg';
      case 'rhea':
        return imagePath + 'rhea.png';
      default:
        return '';
    }
  }

  toggleSidebar() {
    this.visible = !this.visible;
    this.checked = this.themeService.isDarkMode();
    const themeType = this.selectedTheme.split('-')[0];
    let theme = this.selectedTheme;

    if (theme.endsWith('-dark')) {
      this.checked = true;
    } else {
      this.checked = false;
    }

    if (this.selectedTheme.endsWith('-dark')) {
      theme = this.selectedTheme.replace('-dark', '');
    }

    this.themeIndex = this.getThemeIndex(theme);

    this.isSelectedTheme(this.themeIndex, themeType);
  }

  toggleDarkMode() {
    this.checked != this.checked;

    const theme = this.checked
      ? this.selectedTheme + '-dark'
      : this.selectedTheme.replace('-dark', '');

    let themeSelect = this.selectedTheme;

    if (this.selectedTheme.endsWith('-dark')) {
      themeSelect = this.selectedTheme.replace('-dark', '');
    }
    this.themeIndex = this.getThemeIndex(themeSelect);
    this.applyTheme(theme, this.themeIndex, themeSelect.split('-')[0]);

    localStorage.setItem('selectedTheme', theme);
    if (theme.endsWith('-dark')) {
      this.checked = true;
    } else {
      this.checked = false;
    }
    this.themeService.toggleDarkMode(this.checked);
    this.themeService.setDarkMode(this.checked);
  }
  getThemeIndex(themeId: string): number {
    const themeType = themeId.split('-')[0];

    const filteredThemes = this.Themes.filter(
      (theme) => theme.theme === themeType
    );
    const themeIndex = filteredThemes.findIndex(
      (theme) => theme.id === themeId
    );

    return themeIndex !== -1 ? themeIndex : -1;
  }

  applyTheme(themeId: string, index: number, themeType: string) {
    this.checked = false;
    this.themeService.toggleDarkMode(false);

    if (!themeId.endsWith('-dark')) {
      const darkThemeName = themeId + '-dark';
      this.darkModeEnabled = this.checkIfDarkThemeExists(darkThemeName);
    } else {
      this.darkModeEnabled = this.checkIfDarkThemeExists(themeId);
    }

    this.selectedThemeIndexes[themeType] = index;
    this.selectedTheme = themeId;

    this.themeService.switchTheme(themeId);
    this.themeService.setSelectedTheme(themeId);

    if (themeType === 'luna' || themeType === 'vela' || themeType === 'arya') {
      this.themeService.toggleDarkMode(true);
    } else {
      this.themeService.toggleDarkMode(this.checked);
    }

    // localStorage.clear();
    localStorage.setItem('selectedTheme', themeId);

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
