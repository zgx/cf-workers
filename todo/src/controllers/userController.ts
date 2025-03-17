import { Context } from 'hono';
import { Env } from '../types';
import * as UserModel from '../models/user';

// 注册新用户
export async function register(c: Context<{ Bindings: Env }>) {
  try {
    const { username, password } = await c.req.json<{ username: string; password: string }>();
    
    if (!username || !password) {
      return c.json({ success: false, message: '用户名和密码不能为空' }, 400);
    }
    
    const user = await UserModel.createUser(username, password, c.env);
    
    if (!user) {
      return c.json({ success: false, message: '用户名已存在' }, 409);
    }
    
    // 创建会话
    const sessionId = await UserModel.createSession(user.id, c.env);
    
    // 设置cookie
    c.header('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
    
    // 返回用户信息（不包含密码）
    const { passwordHash, ...userInfo } = user;
    return c.json({ success: true, data: userInfo }, 201);
  } catch (error) {
    console.error('注册失败:', error);
    return c.json({ success: false, message: '注册失败' }, 500);
  }
}

// 用户登录
export async function login(c: Context<{ Bindings: Env }>) {
  try {
    const { username, password } = await c.req.json<{ username: string; password: string }>();
    
    if (!username || !password) {
      return c.json({ success: false, message: '用户名和密码不能为空' }, 400);
    }
    
    const user = await UserModel.validateUser(username, password, c.env);
    
    if (!user) {
      return c.json({ success: false, message: '用户名或密码错误' }, 401);
    }
    
    // 创建会话
    const sessionId = await UserModel.createSession(user.id, c.env);
    
    // 设置cookie
    c.header('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
    
    // 返回用户信息（不包含密码）
    const { passwordHash, ...userInfo } = user;
    return c.json({ success: true, data: userInfo });
  } catch (error) {
    console.error('登录失败:', error);
    return c.json({ success: false, message: '登录失败' }, 500);
  }
}

// 用户登出
export async function logout(c: Context<{ Bindings: Env }>) {
  try {
    const cookies = c.req.raw.headers.get('cookie');
    if (!cookies) {
      return c.json({ success: true, message: '已登出' });
    }
    
    const sessionIdMatch = cookies.match(/sessionId=([^;]+)/);
    if (sessionIdMatch) {
      const sessionId = sessionIdMatch[1];
      await UserModel.deleteSession(sessionId, c.env);
    }
    
    // 清除cookie
    c.header('Set-Cookie', 'sessionId=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
    
    return c.json({ success: true, message: '已登出' });
  } catch (error) {
    console.error('登出失败:', error);
    return c.json({ success: false, message: '登出失败' }, 500);
  }
}

// 获取当前用户信息
export async function getCurrentUser(c: Context<{ Bindings: Env }>) {
  try {
    const cookies = c.req.raw.headers.get('cookie');
    if (!cookies) {
      return c.json({ success: true, data: null });
    }
    
    const sessionIdMatch = cookies.match(/sessionId=([^;]+)/);
    if (!sessionIdMatch) {
      return c.json({ success: true, data: null });
    }
    
    const sessionId = sessionIdMatch[1];
    const user = await UserModel.getUserBySession(sessionId, c.env);
    
    if (!user) {
      return c.json({ success: true, data: null });
    }
    
    // 返回用户信息（不包含密码）
    const { passwordHash, ...userInfo } = user;
    return c.json({ success: true, data: userInfo });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return c.json({ success: false, message: '获取用户信息失败' }, 500);
  }
} 