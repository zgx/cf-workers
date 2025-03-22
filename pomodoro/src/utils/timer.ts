import { TimerState } from '../types';
import { StorageManager } from './storage';
import { NotificationManager } from './notifications';

export class Timer {
  private intervalId: number | null = null;
  private isRunning: boolean = false;
  private isWorkTime: boolean = true;
  private timeLeft: number;
  private totalTime: number;
  private lastTimestamp: number = 0;
  private onTick: (timeLeft: number, progress: number) => void;
  private onStateChange: (state: TimerState) => void;
  private onPhaseComplete: () => void;

  constructor(
    onTick: (timeLeft: number, progress: number) => void,
    onStateChange: (state: TimerState) => void,
    onPhaseComplete: () => void,
    initialTime: number = 25 * 60
  ) {
    this.timeLeft = initialTime;
    this.totalTime = initialTime;
    this.onTick = onTick;
    this.onStateChange = onStateChange;
    this.onPhaseComplete = onPhaseComplete;
    this.updateDisplay();
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTimestamp = Date.now();
    this.notifyStateChange();

    this.intervalId = window.setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - this.lastTimestamp) / 1000);
      this.lastTimestamp = now;

      if (delta > 0) {
        this.timeLeft = Math.max(0, this.timeLeft - delta);
        this.updateDisplay();

        if (this.timeLeft === 0) {
          this.handlePhaseComplete();
        }
      }
    }, 100);
  }

  public pause(): void {
    if (!this.isRunning) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.notifyStateChange();
  }

  public reset(newTime?: number): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    this.isWorkTime = true;
    this.timeLeft = newTime || this.totalTime;
    this.totalTime = this.timeLeft;
    this.notifyStateChange();
    this.updateDisplay();
  }

  public switchPhase(newTime: number, isWorkTime: boolean): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    this.isWorkTime = isWorkTime;
    this.timeLeft = newTime;
    this.totalTime = newTime;
    this.notifyStateChange();
    this.updateDisplay();
  }

  public restoreState(state: TimerState): void {
    this.isRunning = state.isRunning;
    this.isWorkTime = state.isWorkTime;
    this.timeLeft = state.timeLeft;
    this.totalTime = state.totalTime;

    if (this.isRunning) {
      const timePassed = Math.floor((Date.now() - state.timestamp) / 1000);
      this.timeLeft = Math.max(0, this.timeLeft - timePassed);
      this.start();
    } else {
      this.notifyStateChange();
      this.updateDisplay();
    }
  }

  public getState(): TimerState {
    return {
      isRunning: this.isRunning,
      isWorkTime: this.isWorkTime,
      timeLeft: this.timeLeft,
      totalTime: this.totalTime,
      timestamp: Date.now()
    };
  }

  private updateDisplay(): void {
    const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
    this.onTick(this.timeLeft, progress);
  }

  private handlePhaseComplete(): void {
    this.pause();
    this.onPhaseComplete();
  }

  private notifyStateChange(): void {
    this.onStateChange(this.getState());
  }
} 