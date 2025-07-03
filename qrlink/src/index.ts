import * as QRCode from 'qrcode-generator';

interface Env {
	ASSETS: any;
}

interface QRRequest {
	content: string;
	size?: number;
	format?: 'png' | 'svg';
	errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
	margin?: number;
	color?: {
		dark?: string;
		light?: string;
	};
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
		const errorCorrectionLevel = body.errorCorrectionLevel || 'M';
		const margin = body.margin || 4;
		const darkColor = body.color?.dark || '#000000';
		const lightColor = body.color?.light || '#FFFFFF';

		// 映射错误纠正级别
		const typeNumber = 0; // 自动选择类型
		const errorCorrectLevel = {
			'L': 'L',
			'M': 'M', 
			'Q': 'Q',
			'H': 'H'
		}[errorCorrectionLevel] || 'M';

		// 创建二维码
		const qr = QRCode.default(typeNumber, errorCorrectLevel as any);
		qr.addData(body.content);
		qr.make();

		if (format === 'svg') {
			// 生成SVG格式
			const moduleCount = qr.getModuleCount();
			const cellSize = Math.floor(size / (moduleCount + 2 * margin));
			const qrSize = cellSize * (moduleCount + 2 * margin);
			
			let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">`;
			svg += `<rect width="100%" height="100%" fill="${lightColor}"/>`;
			
			for (let row = 0; row < moduleCount; row++) {
				for (let col = 0; col < moduleCount; col++) {
					if (qr.isDark(row, col)) {
						const x = (col + margin) * cellSize;
						const y = (row + margin) * cellSize;
						svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${darkColor}"/>`;
					}
				}
			}
			svg += '</svg>';

			return new Response(svg, {
				headers: {
					'Content-Type': 'image/svg+xml',
					'Cache-Control': 'public, max-age=3600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				}
			});
		} else {
			// PNG格式：生成SVG然后让前端转换
			const moduleCount = qr.getModuleCount();
			const cellSize = Math.floor(size / (moduleCount + 2 * margin));
			const qrSize = cellSize * (moduleCount + 2 * margin);
			
			let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">`;
			svg += `<rect width="100%" height="100%" fill="${lightColor}"/>`;
			
			for (let row = 0; row < moduleCount; row++) {
				for (let col = 0; col < moduleCount; col++) {
					if (qr.isDark(row, col)) {
						const x = (col + margin) * cellSize;
						const y = (row + margin) * cellSize;
						svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${darkColor}"/>`;
					}
				}
			}
			svg += '</svg>';

			return new Response(svg, {
				headers: {
					'Content-Type': 'image/svg+xml',
					'Cache-Control': 'public, max-age=3600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
					'X-QR-Format': 'png', // 标记前端需要转换为PNG
				}
			});
		}

	} catch (error) {
		console.error('QR generation error:', error);
		return new Response(JSON.stringify({ 
			error: '生成二维码失败，请稍后重试',
			details: error instanceof Error ? error.message : '未知错误'
		}), {
			status: 500,
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			}
		});
	}
}

// 辅助函数：十六进制颜色转RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : { r: 0, g: 0, b: 0 };
}
