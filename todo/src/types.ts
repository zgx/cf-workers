export interface Env {
  POMODORO_TODO_KV: KVNamespace;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  userId?: string; // 可选，匿名用户没有userId
  title: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PomodoroSession {
  id: string;
  userId?: string; // 可选，匿名用户没有userId
  todoId: string;
  startTime: number;
  endTime: number | null;
  duration: number; // 持续时间（分钟）
  completed: boolean;
}

export interface PomodoroSettings {
  userId?: string; // 可选，匿名用户没有userId
  workDuration: number; // 工作时长（分钟）
  shortBreakDuration: number; // 短休息时长（分钟）
  longBreakDuration: number; // 长休息时长（分钟）
  longBreakInterval: number; // 长休息间隔（次数）
} 