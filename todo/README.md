# 番茄时钟 + 待办事项应用

这是一个基于Cloudflare Workers的番茄时钟和待办事项应用，帮助用户提高工作效率和时间管理能力。

## 功能特点

- **待办事项管理**：添加、编辑、删除和标记完成待办事项
- **番茄工作法**：使用番茄工作法进行时间管理
- **自定义设置**：可自定义工作时长、休息时长和长休息间隔
- **数据持久化**：使用Cloudflare KV存储数据
- **响应式设计**：适配各种设备屏幕

## 技术栈

- **Cloudflare Workers**：无服务器计算平台
- **Hono**：轻量级Web框架
- **TypeScript**：类型安全的JavaScript超集
- **Cloudflare KV**：键值存储服务

## 开发指南

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 部署

```bash
npm run deploy
```

## 项目结构

```
src/
├── controllers/       # 控制器
├── models/           # 数据模型
├── public/           # 静态资源
├── routes/           # 路由
├── types.ts          # 类型定义
└── index.ts          # 入口文件
```

## 使用说明

1. 添加待办事项
2. 选择一个待办事项开始番茄钟
3. 专注工作直到番茄钟结束
4. 休息一下，然后继续下一个番茄钟

## 许可证

MIT 