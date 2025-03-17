import { Env, PomodoroSession, PomodoroSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

const POMODORO_SESSION_PREFIX = 'pomodoro:session:';
const USER_POMODORO_SESSION_PREFIX = 'user:pomodoro:session:';
const POMODORO_SETTINGS_KEY = 'pomodoro:settings';
const USER_POMODORO_SETTINGS_KEY = 'user:pomodoro:settings:';

// 默认番茄钟设置
const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4
};

export async function getSettings(env: Env, userId?: string): Promise<PomodoroSettings> {
  if (userId) {
    const settingsJson = await env.POMODORO_TODO_KV.get(`${USER_POMODORO_SETTINGS_KEY}${userId}`);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
  }
  
  const settingsJson = await env.POMODORO_TODO_KV.get(POMODORO_SETTINGS_KEY);
  return settingsJson ? JSON.parse(settingsJson) : DEFAULT_SETTINGS;
}

export async function updateSettings(settings: Partial<PomodoroSettings>, env: Env, userId?: string): Promise<PomodoroSettings> {
  const currentSettings = await getSettings(env, userId);
  const updatedSettings = { ...currentSettings, ...settings };
  
  if (userId) {
    updatedSettings.userId = userId;
    await env.POMODORO_TODO_KV.put(`${USER_POMODORO_SETTINGS_KEY}${userId}`, JSON.stringify(updatedSettings));
  } else {
    await env.POMODORO_TODO_KV.put(POMODORO_SETTINGS_KEY, JSON.stringify(updatedSettings));
  }
  
  return updatedSettings;
}

export async function startPomodoroSession(todoId: string, env: Env, userId?: string, customDuration?: number): Promise<PomodoroSession> {
  const settings = await getSettings(env, userId);
  const id = uuidv4();
  const now = Date.now();
  
  // 使用自定义持续时间或默认工作时长
  const duration = customDuration !== undefined ? customDuration : settings.workDuration;
  
  const session: PomodoroSession = {
    id,
    userId,
    todoId,
    startTime: now,
    endTime: null,
    duration: duration,
    completed: false
  };

  await env.POMODORO_TODO_KV.put(`${POMODORO_SESSION_PREFIX}${id}`, JSON.stringify(session));
  
  if (userId) {
    await env.POMODORO_TODO_KV.put(`${USER_POMODORO_SESSION_PREFIX}${userId}:${id}`, JSON.stringify(session));
  }
  
  return session;
}

export async function completePomodoroSession(id: string, env: Env): Promise<PomodoroSession | null> {
  const sessionJson = await env.POMODORO_TODO_KV.get(`${POMODORO_SESSION_PREFIX}${id}`);
  
  if (!sessionJson) {
    return null;
  }
  
  const session: PomodoroSession = JSON.parse(sessionJson);
  const updatedSession: PomodoroSession = {
    ...session,
    endTime: Date.now(),
    completed: true
  };
  
  await env.POMODORO_TODO_KV.put(`${POMODORO_SESSION_PREFIX}${id}`, JSON.stringify(updatedSession));
  
  if (session.userId) {
    await env.POMODORO_TODO_KV.put(`${USER_POMODORO_SESSION_PREFIX}${session.userId}:${id}`, JSON.stringify(updatedSession));
  }
  
  return updatedSession;
}

export async function cancelPomodoroSession(id: string, env: Env): Promise<PomodoroSession | null> {
  const sessionJson = await env.POMODORO_TODO_KV.get(`${POMODORO_SESSION_PREFIX}${id}`);
  
  if (!sessionJson) {
    return null;
  }
  
  const session: PomodoroSession = JSON.parse(sessionJson);
  const updatedSession: PomodoroSession = {
    ...session,
    endTime: Date.now(),
    completed: false // 标记为未完成
  };
  
  await env.POMODORO_TODO_KV.put(`${POMODORO_SESSION_PREFIX}${id}`, JSON.stringify(updatedSession));
  
  if (session.userId) {
    await env.POMODORO_TODO_KV.put(`${USER_POMODORO_SESSION_PREFIX}${session.userId}:${id}`, JSON.stringify(updatedSession));
  }
  
  return updatedSession;
}

export async function getSessionsByTodoId(todoId: string, env: Env, userId?: string): Promise<PomodoroSession[]> {
  if (userId) {
    const list = await env.POMODORO_TODO_KV.list({ prefix: `${USER_POMODORO_SESSION_PREFIX}${userId}:` });
    const sessions: PomodoroSession[] = [];

    for (const key of list.keys) {
      const sessionJson = await env.POMODORO_TODO_KV.get(key.name);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        if (session.todoId === todoId) {
          sessions.push(session);
        }
      }
    }

    return sessions.sort((a, b) => b.startTime - a.startTime);
  } else {
    const list = await env.POMODORO_TODO_KV.list({ prefix: POMODORO_SESSION_PREFIX });
    const sessions: PomodoroSession[] = [];

    for (const key of list.keys) {
      const sessionJson = await env.POMODORO_TODO_KV.get(key.name);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        if (session.todoId === todoId && !session.userId) {
          sessions.push(session);
        }
      }
    }

    return sessions.sort((a, b) => b.startTime - a.startTime);
  }
}

export async function getCurrentSession(env: Env, userId?: string): Promise<PomodoroSession | null> {
  if (userId) {
    const list = await env.POMODORO_TODO_KV.list({ prefix: `${USER_POMODORO_SESSION_PREFIX}${userId}:` });
    
    for (const key of list.keys) {
      const sessionJson = await env.POMODORO_TODO_KV.get(key.name);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        if (!session.completed && session.endTime === null) {
          return session;
        }
      }
    }
    
    return null;
  } else {
    const list = await env.POMODORO_TODO_KV.list({ prefix: POMODORO_SESSION_PREFIX });
    
    for (const key of list.keys) {
      const sessionJson = await env.POMODORO_TODO_KV.get(key.name);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        if (!session.completed && session.endTime === null && !session.userId) {
          return session;
        }
      }
    }
    
    return null;
  }
} 