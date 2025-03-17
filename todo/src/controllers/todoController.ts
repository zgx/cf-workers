import { Context } from 'hono';
import { Env } from '../types';
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

export async function getAllTodos(c: Context<{ Bindings: Env }>) {
  try {
    const userId = await getCurrentUserId(c);
    const todos = await TodoModel.getAllTodos(c.env, userId);
    return c.json({ success: true, data: todos });
  } catch (error) {
    console.error('获取所有待办事项失败:', error);
    return c.json({ success: false, message: '获取待办事项失败' }, 500);
  }
}

export async function getTodoById(c: Context<{ Bindings: Env }>) {
  try {
    const id = c.req.param('id');
    const todo = await TodoModel.getTodoById(id, c.env);
    
    if (!todo) {
      return c.json({ success: false, message: '待办事项不存在' }, 404);
    }
    
    // 检查权限：如果待办事项属于特定用户，只有该用户可以访问
    if (todo.userId) {
      const userId = await getCurrentUserId(c);
      if (todo.userId !== userId) {
        return c.json({ success: false, message: '无权访问此待办事项' }, 403);
      }
    }
    
    return c.json({ success: true, data: todo });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    return c.json({ success: false, message: '获取待办事项失败' }, 500);
  }
}

export async function createTodo(c: Context<{ Bindings: Env }>) {
  try {
    const { title } = await c.req.json<{ title: string }>();
    
    if (!title || title.trim() === '') {
      return c.json({ success: false, message: '标题不能为空' }, 400);
    }
    
    const userId = await getCurrentUserId(c);
    const todo = await TodoModel.createTodo(title, c.env, userId);
    return c.json({ success: true, data: todo }, 201);
  } catch (error) {
    console.error('创建待办事项失败:', error);
    return c.json({ success: false, message: '创建待办事项失败' }, 500);
  }
}

export async function updateTodo(c: Context<{ Bindings: Env }>) {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json<{ title?: string; completed?: boolean }>();
    
    // 检查待办事项是否存在
    const todo = await TodoModel.getTodoById(id, c.env);
    if (!todo) {
      return c.json({ success: false, message: '待办事项不存在' }, 404);
    }
    
    // 检查权限：如果待办事项属于特定用户，只有该用户可以更新
    if (todo.userId) {
      const userId = await getCurrentUserId(c);
      if (todo.userId !== userId) {
        return c.json({ success: false, message: '无权更新此待办事项' }, 403);
      }
    }
    
    const updatedTodo = await TodoModel.updateTodo(id, updates, c.env);
    return c.json({ success: true, data: updatedTodo });
  } catch (error) {
    console.error('更新待办事项失败:', error);
    return c.json({ success: false, message: '更新待办事项失败' }, 500);
  }
}

export async function deleteTodo(c: Context<{ Bindings: Env }>) {
  try {
    const id = c.req.param('id');
    
    // 检查待办事项是否存在
    const todo = await TodoModel.getTodoById(id, c.env);
    if (!todo) {
      return c.json({ success: false, message: '待办事项不存在' }, 404);
    }
    
    // 检查权限：如果待办事项属于特定用户，只有该用户可以删除
    if (todo.userId) {
      const userId = await getCurrentUserId(c);
      if (todo.userId !== userId) {
        return c.json({ success: false, message: '无权删除此待办事项' }, 403);
      }
    }
    
    const success = await TodoModel.deleteTodo(id, c.env);
    return c.json({ success: true, message: '待办事项已删除' });
  } catch (error) {
    console.error('删除待办事项失败:', error);
    return c.json({ success: false, message: '删除待办事项失败' }, 500);
  }
} 