import { TimerState } from '../types';
import { StorageManager } from './storage';
import { NotificationManager } from './notifications';

export class Timer {
  private isRunning: boolean = false;
  private isWorkTime: boolean = true;
  private timeLeft: number;
  private totalTime: number;
  private timer: number | null = null;
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
  }

  start(): void {
    if (this.timer) {
      return;
    }

    this.isRunning = true;
    this.saveState();

    this.timer = window.setInterval(() => {
      this.timeLeft--;
      const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
      this.onTick(this.timeLeft, progress);

      if (this.timeLeft <= 0) {
        this.stop();
        this.onPhaseComplete();
      }
    }, 1000);
  }

  pause(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.saveState();
  }

  stop(): void {
    this.pause();
    this.isRunning = false;
    this.saveState();
  }

  reset(newTime: number): void {
    this.stop();
    this.timeLeft = newTime;
    this.totalTime = newTime;
    this.isWorkTime = true;
    this.onTick(this.timeLeft, 0);
    this.saveState();
  }

  switchPhase(newTime: number, isWork: boolean): void {
    this.stop();
    this.timeLeft = newTime;
    this.totalTime = newTime;
    this.isWorkTime = isWork;
    this.onTick(this.timeLeft, 0);
    this.saveState();
  }

  private saveState(): void {
    const state: TimerState = {
      isRunning: this.isRunning,
      isWorkTime: this.isWorkTime,
      timeLeft: this.timeLeft,
      totalTime: this.totalTime,
      timestamp: Date.now()
    };
    this.onStateChange(state);
    StorageManager.saveTimerState(state);
  }

  getState(): TimerState {
    return {
      isRunning: this.isRunning,
      isWorkTime: this.isWorkTime,
      timeLeft: this.timeLeft,
      totalTime: this.totalTime,
      timestamp: Date.now()
    };
  }

  restoreState(state: TimerState): void {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.timestamp) / 1000);

    this.isWorkTime = state.isWorkTime;
    this.totalTime = state.totalTime;
    this.timeLeft = Math.max(0, state.timeLeft - elapsedSeconds);

    if (state.isRunning && this.timeLeft > 0) {
      this.start();
    } else {
      this.onTick(this.timeLeft, ((this.totalTime - this.timeLeft) / this.totalTime) * 100);
    }
  }
} 