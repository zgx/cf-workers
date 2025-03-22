export interface Env {
  // 如果需要，可以在这里添加环境变量
}

export interface TimerState {
  isRunning: boolean;
  isWorkTime: boolean;
  timeLeft: number;
  totalTime: number;
  timestamp: number;
}

export interface TomatoData {
  count: number;
  resetDate: string;
} 