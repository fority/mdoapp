import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      this.selectedThemeSubject.next(savedTheme);
      this.switchTheme(savedTheme);
    }
  }

  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.darkModeSubject.asObservable();
  private selectedThemeSubject = new BehaviorSubject<string>('default');
  public selectedTheme$ = this.selectedThemeSubject.asObservable();

  setDefaultTheme() {
    this.selectedThemeSubject.next('lara-light-blue');
    localStorage.removeItem('selectedTheme');
  }

  setSelectedTheme(theme: string) {
    if (theme !== 'lara-light-blue') {
      this.selectedThemeSubject.next(theme);
      localStorage.setItem('selectedTheme', theme);
    }
  }

  getSelectedTheme(): string {
    return this.selectedThemeSubject.value;
  }

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }

  toggleDarkMode(isDarkMode: boolean): void {
    this.darkModeSubject.next(isDarkMode);
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
