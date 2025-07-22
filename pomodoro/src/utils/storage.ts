import { TimerState, TomatoData } from '../types/index';

export class StorageManager {
  static saveTimerState(state: TimerState): void {
    localStorage.setItem('timerState', JSON.stringify(state));
  }

  static getTimerState(): TimerState | null {
    const savedState = localStorage.getItem('timerState');
    return savedState ? JSON.parse(savedState) : null;
  }

  static saveTomatoData(data: TomatoData): void {
    localStorage.setItem('tomatoData', JSON.stringify(data));
  }

  static getTomatoData(): TomatoData | null {
    const savedData = localStorage.getItem('tomatoData');
    return savedData ? JSON.parse(savedData) : null;
  }

  static saveSettings(workTime: number, breakTime: number): void {
    localStorage.setItem('workTime', workTime.toString());
    localStorage.setItem('breakTime', breakTime.toString());
  }

  static getSettings(): { workTime: number; breakTime: number } {
    return {
      workTime: Number(localStorage.getItem('workTime')) || 25,
      breakTime: Number(localStorage.getItem('breakTime')) || 5
    };
  }

  static saveLanguagePreference(lang: string): void {
    localStorage.setItem('preferredLanguage', lang);
  }

  static getLanguagePreference(): string | null {
    return localStorage.getItem('preferredLanguage');
  }
} 