import { Context } from 'hono';
import { Env } from '../types';
import * as PomodoroModel from '../models/pomodoro';
import * as TodoModel from '../models/todo';
import * as UserModel from '../models/user';

// 获取当前用户ID
async function getCurrentUserId(c: Context<{ Bindings: Env }>): Promise<string | undefined> {
  const cookies = c.req.raw.headers.get('cookie');
  if (!cookies) {
    return undefined;
  }
  
  const sessionIdMatch = cookies.match(/sessionId=([^;]+)/);
  if (!sessionIdMatch) {
    return undefined;
  }
  
  const sessionId = sessionIdMatch[1];
  const user = await UserModel.getUserBySession(sessionId, c.env);
  
  return user?.id;
}

export async function getSettings(c: Context<{ Bindings: Env }>) {
  try {
    const userId = await getCurrentUserId(c);
    const settings = await PomodoroModel.getSettings(c.env, userId);
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error('获取番茄钟设置失败:', error);
    return c.json({ success: false, message: '获取番茄钟设置失败' }, 500);
  }
}

export async function updateSettings(c: Context<{ Bindings: Env }>) {
  try {
    const updates = await c.req.json();
    const userId = await getCurrentUserId(c);
    const settings = await PomodoroModel.updateSettings(updates, c.env, userId);
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error('更新番茄钟设置失败:', error);
    return c.json({ success: false, message: '更新番茄钟设置失败' }, 500);
  }
}

export async function startSession(c: Context<{ Bindings: Env }>) {
  try {
    const body = await c.req.json<{ todoId?: string, mode?: string, duration?: number }>();
    const todoId = body.todoId; // 可能是undefined
    const mode = body.mode || 'focus'; // 默认为专注模式
    const customDuration = body.duration; // 可能是undefined
    const userId = await getCurrentUserId(c);
    
    // 检查是否有正在进行的番茄钟
    const currentSession = await PomodoroModel.getCurrentSession(c.env, userId);
    if (currentSession) {
      return c.json({ 
        success: false, 
        message: '已有正在进行的番茄钟', 
        data: currentSession 
      }, 400);
    }
    
    // 如果提供了有效的todoId，检查待办事项是否存在
    if (todoId && todoId.trim() !== '') {
      const todo = await TodoModel.getTodoById(todoId, c.env);
      if (!todo) {
        return c.json({ success: false, message: '待办事项不存在' }, 404);
      }
      
      // 检查权限：如果待办事项属于特定用户，只有该用户可以为其创建番茄钟
      if (todo.userId && todo.userId !== userId) {
        return c.json({ success: false, message: '无权为此待办事项创建番茄钟' }, 403);
      }
    }
    
    // 使用空字符串表示没有选择任务的番茄钟
    const actualTodoId = (todoId && todoId.trim() !== '') ? todoId : '';
    
    // 创建番茄钟会话，传入自定义持续时间
    const session = await PomodoroModel.startPomodoroSession(actualTodoId, c.env, userId, customDuration);
    return c.json({ success: true, data: session }, 201);
  } catch (error) {
    console.error('开始番茄钟失败:', error);
    return c.json({ success: false, message: '开始番茄钟失败' }, 500);
  }
}

export async function completeSession(c: Context<{ Bindings: Env }>) {
  try {
    const id = c.req.param('id');
    const userId = await getCurrentUserId(c);
    
    // 获取会话
    const session = await PomodoroModel.completePomodoroSession(id, c.env);
    
    if (!session) {
      return c.json({ success: false, message: '番茄钟会话不存在' }, 404);
    }
    
    // 检查权限：如果会话属于特定用户，只有该用户可以完成它
    if (session.userId && session.userId !== userId) {
      return c.json({ success: false, message: '无权完成此番茄钟会话' }, 403);
    }
    
    return c.json({ success: true, data: session });
  } catch (error) {
    console.error('完成番茄钟失败:', error);
    return c.json({ success: false, message: '完成番茄钟失败' }, 500);
  }
}

export async function getCurrentSession(c: Context<{ Bindings: Env }>) {
  try {
    const userId = await getCurrentUserId(c);
    const session = await PomodoroModel.getCurrentSession(c.env, userId);
    
    if (!session) {
      return c.json({ success: true, data: null });
    }
    
    return c.json({ success: true, data: session });
  } catch (error) {
    console.error('获取当前番茄钟失败:', error);
    return c.json({ success: false, message: '获取当前番茄钟失败' }, 500);
  }
}

export async function getSessionsByTodoId(c: Context<{ Bindings: Env }>) {
  try {
    const todoId = c.req.param('todoId');
    const userId = await getCurrentUserId(c);
    
    // 检查待办事项是否存在
    const todo = await TodoModel.getTodoById(todoId, c.env);
    if (!todo) {
      return c.json({ success: false, message: '待办事项不存在' }, 404);
    }
    
    // 检查权限：如果待办事项属于特定用户，只有该用户可以查看其番茄钟会话
    if (todo.userId && todo.userId !== userId) {
      return c.json({ success: false, message: '无权查看此待办事项的番茄钟会话' }, 403);
    }
    
    const sessions = await PomodoroModel.getSessionsByTodoId(todoId, c.env, userId);
    return c.json({ success: true, data: sessions });
  } catch (error) {
    console.error('获取番茄钟会话失败:', error);
    return c.json({ success: false, message: '获取番茄钟会话失败' }, 500);
  }
}

export async function cancelSession(c: Context<{ Bindings: Env }>) {
  try {
    const id = c.req.param('id');
    const userId = await getCurrentUserId(c);
    
    // 获取会话
    const session = await PomodoroModel.cancelPomodoroSession(id, c.env);
    
    if (!session) {
      return c.json({ success: false, message: '番茄钟会话不存在' }, 404);
    }
    
    // 检查权限：如果会话属于特定用户，只有该用户可以取消它
    if (session.userId && session.userId !== userId) {
      return c.json({ success: false, message: '无权取消此番茄钟会话' }, 403);
    }
    
    return c.json({ success: true, data: session });
  } catch (error) {
    console.error('取消番茄钟失败:', error);
    return c.json({ success: false, message: '取消番茄钟失败' }, 500);
  }
} 