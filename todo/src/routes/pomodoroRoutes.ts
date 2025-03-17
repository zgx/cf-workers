import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env } from '../types';
import * as PomodoroController from '../controllers/pomodoroController';

const pomodoroRoutes = new Hono<{ Bindings: Env }>();

// 验证器
const updateSettingsValidator = zValidator('json', z.object({
  workDuration: z.number().min(1).max(60).optional(),
  shortBreakDuration: z.number().min(1).max(30).optional(),
  longBreakDuration: z.number().min(1).max(60).optional(),
  longBreakInterval: z.number().min(1).max(10).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: '至少需要提供一个设置字段'
}));

const startSessionValidator = zValidator('json', z.object({
  todoId: z.string().optional(),
  mode: z.enum(['focus', 'break']).optional(),
  duration: z.number().min(1).max(60).optional()
}));

// 路由
pomodoroRoutes.get('/settings', PomodoroController.getSettings);
pomodoroRoutes.put('/settings', updateSettingsValidator, PomodoroController.updateSettings);
pomodoroRoutes.post('/sessions', startSessionValidator, PomodoroController.startSession);
pomodoroRoutes.put('/sessions/:id/complete', PomodoroController.completeSession);
pomodoroRoutes.put('/sessions/:id/cancel', PomodoroController.cancelSession);
pomodoroRoutes.get('/sessions/current', PomodoroController.getCurrentSession);
pomodoroRoutes.get('/sessions/todo/:todoId', PomodoroController.getSessionsByTodoId);

export default pomodoroRoutes; 