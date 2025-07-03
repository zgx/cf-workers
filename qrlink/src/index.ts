interface Env {
	ASSETS: any;
}

interface QRRequest {
	content: string;
	size?: number;
	format?: 'png' | 'svg';
}

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		const url = new URL(request.url);
		
		// 处理CORS预检请求
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				}
			});
		}
		
		// 处理二维码生成API
		if (request.method === 'POST' && url.pathname === '/api/qr') {
			return handleQRGeneration(request);
		}

		// 处理静态资源
		return env.ASSETS.fetch(request);
	},
};

interface QRRequest {
	content: string;
	size?: number;
	format?: 'png' | 'svg';
}

async function handleQRGeneration(request: Request): Promise<Response> {
	try {
		const body: QRRequest = await request.json();
		
		if (!body.content || typeof body.content !== 'string') {
			return new Response(JSON.stringify({ error: '内容不能为空' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const size = body.size || 300;
		const format = body.format || 'png';

		// 使用 qr-server.com API 生成二维码
		const qrUrl = new URL('https://api.qrserver.com/v1/create-qr-code/');
		qrUrl.searchParams.set('data', body.content);
		qrUrl.searchParams.set('size', `${size}x${size}`);
		qrUrl.searchParams.set('format', format);
		qrUrl.searchParams.set('color', '000000');
		qrUrl.searchParams.set('bgcolor', 'FFFFFF');
		qrUrl.searchParams.set('qzone', '1');

		const response = await fetch(qrUrl.toString());
		
		if (!response.ok) {
			throw new Error('二维码生成服务不可用');
		}

		const contentType = format === 'svg' ? 'image/svg+xml' : 'image/png';
		
		return new Response(response.body, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});

	} catch (error) {
		console.error('QR generation error:', error);
		return new Response(JSON.stringify({ 
			error: '生成二维码失败，请稍后重试' 
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
