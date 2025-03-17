import { Env, Todo } from '../types';
import { v4 as uuidv4 } from 'uuid';

const TODO_PREFIX = 'todo:';
const USER_TODO_PREFIX = 'user:todo:';

export async function getAllTodos(env: Env, userId?: string): Promise<Todo[]> {
  if (userId) {
    const list = await env.POMODORO_TODO_KV.list({ prefix: `${USER_TODO_PREFIX}${userId}:` });
    const todos: Todo[] = [];

    for (const key of list.keys) {
      const todoJson = await env.POMODORO_TODO_KV.get(key.name);
      if (todoJson) {
        todos.push(JSON.parse(todoJson));
      }
    }

    return todos.sort((a, b) => b.createdAt - a.createdAt);
  } else {
    const list = await env.POMODORO_TODO_KV.list({ prefix: TODO_PREFIX });
    const todos: Todo[] = [];

    for (const key of list.keys) {
      const todoJson = await env.POMODORO_TODO_KV.get(key.name);
      if (todoJson) {
        const todo = JSON.parse(todoJson);
        if (!todo.userId) {
          todos.push(todo);
        }
      }
    }

    return todos.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export async function getTodoById(id: string, env: Env): Promise<Todo | null> {
  const todoJson = await env.POMODORO_TODO_KV.get(`${TODO_PREFIX}${id}`);
  return todoJson ? JSON.parse(todoJson) : null;
}

export async function createTodo(title: string, env: Env, userId?: string): Promise<Todo> {
  const id = uuidv4();
  const now = Date.now();
  
  const todo: Todo = {
    id,
    userId,
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  await env.POMODORO_TODO_KV.put(`${TODO_PREFIX}${id}`, JSON.stringify(todo));
  
  if (userId) {
    await env.POMODORO_TODO_KV.put(`${USER_TODO_PREFIX}${userId}:${id}`, JSON.stringify(todo));
  }
  
  return todo;
}

export async function updateTodo(id: string, updates: Partial<Todo>, env: Env): Promise<Todo | null> {
  const todo = await getTodoById(id, env);
  
  if (!todo) {
    return null;
  }

  const updatedTodo: Todo = {
    ...todo,
    ...updates,
    updatedAt: Date.now(),
  };

  await env.POMODORO_TODO_KV.put(`${TODO_PREFIX}${id}`, JSON.stringify(updatedTodo));
  
  if (todo.userId) {
    await env.POMODORO_TODO_KV.put(`${USER_TODO_PREFIX}${todo.userId}:${id}`, JSON.stringify(updatedTodo));
  }
  
  return updatedTodo;
}

export async function deleteTodo(id: string, env: Env): Promise<boolean> {
  const todo = await getTodoById(id, env);
  
  if (!todo) {
    return false;
  }

  await env.POMODORO_TODO_KV.delete(`${TODO_PREFIX}${id}`);
  
  if (todo.userId) {
    await env.POMODORO_TODO_KV.delete(`${USER_TODO_PREFIX}${todo.userId}:${id}`);
  }
  
  return true;
} 