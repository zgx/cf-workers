/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { Env } from './types';
import todoRoutes from './routes/todoRoutes';
import pomodoroRoutes from './routes/pomodoroRoutes';
import userRoutes from './routes/userRoutes';

const app = new Hono<{ Bindings: Env }>();

// API路由
app.route('/api/todos', todoRoutes);
app.route('/api/pomodoro', pomodoroRoutes);
app.route('/api/users', userRoutes);

// 静态文件
app.get('/*', async (c) => {
	const url = new URL(c.req.url);
	const path = url.pathname === '/' ? '/index.html' : url.pathname;
	
	try {
		return await c.env.ASSETS.fetch(c.req.raw);
	} catch (error) {
		return c.text('Not Found', 404);
	}
});

export default app;
