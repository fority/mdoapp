import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'isDarkMode';
  private readonly SELECTED_THEME_KEY = 'selectedTheme';

  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.darkModeSubject.asObservable();

  private selectedThemeSubject = new BehaviorSubject<string>('lara-blue');
  public selectedTheme$ = this.selectedThemeSubject.asObservable();

  private selectedThemeIndexes: { [key: string]: number } = {};

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    let savedTheme = localStorage.getItem(this.SELECTED_THEME_KEY) || 'lara-blue';
    this.selectedThemeSubject.next(savedTheme);

    const savedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);
    const isDarkMode = savedDarkMode === 'true';
    this.darkModeSubject.next(isDarkMode);

    const themeToLoad = isDarkMode ? savedTheme + '-dark' : savedTheme;
    this.switchTheme(themeToLoad);
  }

  public setDarkMode(isDarkMode: boolean): void {
    this.darkModeSubject.next(isDarkMode);
    localStorage.setItem(this.DARK_MODE_KEY, isDarkMode ? 'true' : 'false');
  }

  setSelectedTheme(theme: string): void {
    this.selectedThemeSubject.next(theme);
    localStorage.setItem(this.SELECTED_THEME_KEY, theme);
  }

  switchTheme(theme: string): void {
    let themeLink = this.document.getElementById('app-theme1') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }

  setSelectedThemeIndex(themeType: string, index: number): void {
    this.selectedThemeIndexes[themeType] = index;
    localStorage.setItem('selectedThemeIndexes', JSON.stringify(this.selectedThemeIndexes));
  }

  getSelectedThemeIndex(): { themeType: string; index: number } | undefined {
    const storedIndexes = localStorage.getItem('selectedThemeIndexes');
    if (storedIndexes) {
      this.selectedThemeIndexes = JSON.parse(storedIndexes);
      for (const themeType in this.selectedThemeIndexes) {
        const index = this.selectedThemeIndexes[themeType];
        if (index !== undefined) {
          return { themeType, index };
        }
      }
    }
    return undefined;
  }

  toggleDarkMode(isDarkMode: boolean): void {
    this.darkModeSubject.next(isDarkMode);
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
