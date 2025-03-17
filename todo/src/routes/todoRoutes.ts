import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env } from '../types';
import * as TodoController from '../controllers/todoController';

const todoRoutes = new Hono<{ Bindings: Env }>();

// 验证器
const createTodoValidator = zValidator('json', z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符')
}));

const updateTodoValidator = zValidator('json', z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符').optional(),
  completed: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: '至少需要提供一个更新字段'
}));

// 路由
todoRoutes.get('/', TodoController.getAllTodos);
todoRoutes.get('/:id', TodoController.getTodoById);
todoRoutes.post('/', createTodoValidator, TodoController.createTodo);
todoRoutes.put('/:id', updateTodoValidator, TodoController.updateTodo);
todoRoutes.delete('/:id', TodoController.deleteTodo);

export default todoRoutes; 