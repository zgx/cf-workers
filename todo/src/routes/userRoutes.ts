import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env } from '../types';
import * as UserController from '../controllers/userController';

const userRoutes = new Hono<{ Bindings: Env }>();

// 验证器
const registerValidator = zValidator('json', z.object({
  username: z.string().min(3, '用户名至少需要3个字符').max(20, '用户名不能超过20个字符'),
  password: z.string().min(6, '密码至少需要6个字符').max(50, '密码不能超过50个字符')
}));

const loginValidator = zValidator('json', z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
}));

// 路由
userRoutes.post('/register', registerValidator, UserController.register);
userRoutes.post('/login', loginValidator, UserController.login);
userRoutes.post('/logout', UserController.logout);
userRoutes.get('/current', UserController.getCurrentUser);

export default userRoutes; 