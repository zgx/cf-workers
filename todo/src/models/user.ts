import { Env, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

const USER_PREFIX = 'user:';
const SESSION_PREFIX = 'session:';
const SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7天，单位：秒

export async function createUser(username: string, password: string, env: Env): Promise<User | null> {
  // 检查用户名是否已存在
  const existingUser = await getUserByUsername(username, env);
  if (existingUser) {
    return null;
  }

  // 创建新用户
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user: User = {
    id,
    username,
    passwordHash,
    createdAt: Date.now()
  };

  await env.POMODORO_TODO_KV.put(`${USER_PREFIX}${id}`, JSON.stringify(user));
  await env.POMODORO_TODO_KV.put(`${USER_PREFIX}username:${username}`, id);
  
  return user;
}

export async function getUserById(id: string, env: Env): Promise<User | null> {
  const userJson = await env.POMODORO_TODO_KV.get(`${USER_PREFIX}${id}`);
  return userJson ? JSON.parse(userJson) : null;
}

export async function getUserByUsername(username: string, env: Env): Promise<User | null> {
  const userId = await env.POMODORO_TODO_KV.get(`${USER_PREFIX}username:${username}`);
  if (!userId) {
    return null;
  }
  
  return getUserById(userId, env);
}

export async function validateUser(username: string, password: string, env: Env): Promise<User | null> {
  const user = await getUserByUsername(username, env);
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

export async function createSession(userId: string, env: Env): Promise<string> {
  const sessionId = uuidv4();
  const expiryTime = Math.floor(Date.now() / 1000) + SESSION_EXPIRY;
  
  await env.POMODORO_TODO_KV.put(`${SESSION_PREFIX}${sessionId}`, userId, {
    expirationTtl: SESSION_EXPIRY
  });
  
  return sessionId;
}

export async function getUserBySession(sessionId: string, env: Env): Promise<User | null> {
  const userId = await env.POMODORO_TODO_KV.get(`${SESSION_PREFIX}${sessionId}`);
  if (!userId) {
    return null;
  }
  
  return getUserById(userId, env);
}

export async function deleteSession(sessionId: string, env: Env): Promise<boolean> {
  await env.POMODORO_TODO_KV.delete(`${SESSION_PREFIX}${sessionId}`);
  return true;
} 