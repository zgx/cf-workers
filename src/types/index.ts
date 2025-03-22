// 定义语言类型
export type Language = 'zh' | 'en';

// 定义翻译文本的接口
export interface Translations {
  title: string;
  heading: string;
  workMode: string;
  breakMode: string;
  ready: string;
  working: string;
  resting: string;
  paused: string;
  readyToWork: string;
  readyToRest: string;
  start: string;
  pause: string;
  resume: string;
  skip: string;
  reset: string;
  settings: string;
  workTime: string;
  breakTime: string;
  notificationTitle: string;
  workEndMessage: string;
  breakEndMessage: string;
  notSupported: string;
  notificationReady: string;
  notificationReadyBody: string;
  notificationPermission: string;
  enableNotification: string;
}

// 定义计时器状态接口
export interface TimerState {
  isRunning: boolean;
  isWorkTime: boolean;
  timeLeft: number;
  totalTime: number;
  timestamp: number;
}

// 定义番茄数据接口
export interface TomatoData {
  count: number;
  resetDate: string;
}

// 环境变量接口
export interface Env {
  // 可以添加环境变量定义
} 