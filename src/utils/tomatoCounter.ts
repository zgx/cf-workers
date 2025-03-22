import { TomatoData } from '../types';
import { StorageManager } from './storage';

export class TomatoCounter {
  private count: number = 0;
  private lastResetDate: string = '';
  private onUpdate: (count: number) => void;

  constructor(onUpdate: (count: number) => void) {
    this.onUpdate = onUpdate;
    this.loadData();
  }

  private loadData(): void {
    const data = StorageManager.getTomatoData();
    if (data) {
      this.count = data.count;
      this.lastResetDate = data.resetDate;
    }
    this.checkDailyReset();
    this.onUpdate(this.count);
  }

  private checkDailyReset(): void {
    const now = new Date();
    const today = now.toDateString();
    const resetTime = new Date(now);
    resetTime.setHours(6, 0, 0, 0);

    if (now >= resetTime && this.lastResetDate !== today) {
      this.count = 0;
      this.lastResetDate = today;
      this.saveData();
    } else if (now < resetTime) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.lastResetDate !== today && this.lastResetDate !== yesterday.toDateString()) {
        this.count = 0;
        this.lastResetDate = yesterday.toDateString();
        this.saveData();
      }
    }
  }

  private saveData(): void {
    const data: TomatoData = {
      count: this.count,
      resetDate: this.lastResetDate
    };
    StorageManager.saveTomatoData(data);
    this.onUpdate(this.count);
  }

  increment(): void {
    this.checkDailyReset();
    this.count++;
    this.saveData();
  }

  getCount(): number {
    return this.count;
  }
} 