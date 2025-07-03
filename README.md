# Cloudflare Workers 项目集合

这个仓库包含了多个基于 Cloudflare Workers 的项目，每个项目都展示了不同的功能和用例。

## 📁 项目列表

### 📱 QR Link - 二维码生成器

**目录：** `qrlink/`

一个简洁优美的二维码生成器，可以将任何文字、链接或内容快速转换为高质量的二维码。

#### ✨ 功能特点

- 🎨 **现代化界面**：简洁优美的渐变设计，支持响应式布局
- 🔧 **多格式支持**：支持 PNG 和 SVG 两种输出格式
- 📏 **多尺寸选择**：200x200 到 500x500 像素可选
- ⚡ **即时生成**：快速生成高质量二维码
- 💾 **一键下载**：生成后可立即下载到本地
- � **中文界面**：用户友好的中文操作界面
- 📱 **移动端优化**：完美适配手机和平板设备

#### 🚀 快速开始

```bash
# 进入项目目录
cd qrlink

# 安装依赖
npm install

# 本地开发
npm run dev

# 部署到 Cloudflare Workers
npm run deploy
```

#### 🛠️ 技术栈

- **前端：** HTML5, CSS3, JavaScript (ES6+)
- **后端：** Cloudflare Workers (TypeScript)
- **样式：** 现代 CSS，渐变背景，毛玻璃效果
- **字体：** Inter 字体系列
- **API：** qr-server.com 二维码生成服务

#### 📋 使用方法

1. 在输入框中输入要生成二维码的内容（网址、文字等）
2. 选择所需的尺寸和格式
3. 点击"生成二维码"按钮
4. 查看生成的二维码并下载

---

### �🍅 番茄时钟 / Pomodoro Timer

**目录：** `pomodoro/`  
**在线体验：** [https://fanqie.kiki.one/](https://fanqie.kiki.one/)

一个基于Cloudflare Workers的轻量级番茄工作法计时器应用，支持中英文界面，专为提高工作效率和时间管理而设计。本应用位于仓库的 `pomodoro` 目录中。

### 📸 应用截图

<div align="center">
  <img src="assets/pomodoro_working_cn.png" alt="工作模式" width="400" />
</div>

### ✨ 功能特点

- 🔄 **工作与休息模式自动切换**：完成工作时段后自动切换至休息时段
- 🌐 **中英文双语支持**：自动检测浏览器语言并支持手动切换
- 🔔 **桌面通知**：时段结束时发送通知提醒（需要授权）
- 💾 **状态持久化**：即使浏览器刷新或关闭后重启，也能保持计时状态
- 📱 **响应式设计**：完美适配桌面和移动设备
- 🎨 **主题变化**：工作和休息模式拥有不同的视觉主题
- ⚙️ **自定义设置**：可调整工作和休息的时长
- 📊 **进度显示**：直观的进度条展示当前阶段完成情况
- 📑 **标题更新**：浏览器标签页标题会显示当前计时状态

### 🚀 如何使用

#### 在线使用

直接访问已部署的版本：[番茄时钟应用](https://fanqie.kiki.one/)

#### 本地开发

1. **克隆仓库**

```bash
git clone https://github.com/zgx/cf-workers.git
cd cf-workers/pomodoro
```

2. **安装依赖**

```bash
npm install
```

3. **本地运行**

```bash
npm run dev
```

4. **部署到Cloudflare Workers**

```bash
npm run deploy
```

### 📖 使用指南

1. **开始工作**：点击"开始"按钮，开始专注工作时段
2. **暂停/继续**：需要临时暂停时，点击"暂停"按钮；准备继续时，点击"继续"
3. **跳过**：想直接进入下一个阶段时，点击"跳过"按钮
4. **重置**：需要重新开始时，点击"重置"按钮
5. **设置**：点击齿轮图标，可以调整工作和休息时间
6. **语言切换**：点击右上角的语言按钮切换中英文界面
7. **通知权限**：首次使用时，建议授权通知权限，以便在计时结束时收到提醒

### 🔧 番茄工作法简介

番茄工作法（Pomodoro Technique）是一种时间管理方法，使用一个计时器来分割工作为25分钟一节，中间用短暂的休息时间隔开。步骤如下：

1. 确定待完成的任务
2. 设置番茄钟为25分钟（可调整）
3. 专注工作直到时间结束
4. 休息5分钟（可调整）
5. 每完成四个番茄钟周期，休息一个较长时间（15-30分钟）

### 💻 技术栈

- Cloudflare Workers：无服务器运行环境
- 纯原生JavaScript：无需额外框架
- HTML5 & CSS3：构建响应式界面
- Web Notifications API：提供桌面通知
- localStorage API：实现状态持久化

---

## 🍅 Pomodoro Timer

A lightweight Pomodoro Technique timer application based on Cloudflare Workers, with English and Chinese interface support, designed to improve work efficiency and time management. This application is located in the `pomodoro` directory of the repository.

### 📸 Screenshots

<div align="center">
  <img src="assets/pomodoro_working_en.png" alt="Work Mode" width="400" />
</div>

### ✨ Features

- 🔄 **Automatic Mode Switching**: Automatically switches between work and break modes
- 🌐 **Bilingual Support**: Automatically detects browser language and supports manual switching
- 🔔 **Desktop Notifications**: Sends notifications when a session ends (requires permission)
- 💾 **State Persistence**: Maintains timer state even after browser refresh or restart
- 📱 **Responsive Design**: Perfectly adapts to desktop and mobile devices
- 🎨 **Theme Variation**: Different visual themes for work and break modes
- ⚙️ **Custom Settings**: Adjustable work and break durations
- 📊 **Progress Display**: Intuitive progress bar showing current phase completion
- 📑 **Title Updates**: Browser tab title displays current timer status

### 🚀 How to Use

#### Online Usage

Access our deployed version directly: [Pomodoro Timer App](https://fanqie.kiki.one/)

#### Local Development

1. **Clone the Repository**

```bash
git clone https://github.com/zgx/cf-workers.git
cd cf-workers/pomodoro
```

2. **Install Dependencies**

```bash
npm install
```

3. **Run Locally**

```bash
npm run dev
```

4. **Deploy to Cloudflare Workers**

```bash
npm run deploy
```

### 📖 User Guide

1. **Start Working**: Click the "Start" button to begin a focused work session
2. **Pause/Resume**: Need a temporary break? Click "Pause"; Ready to continue? Click "Resume"
3. **Skip**: Want to move to the next phase? Click the "Skip" button
4. **Reset**: Need to start over? Click the "Reset" button
5. **Settings**: Click the gear icon to adjust work and break durations
6. **Language Switch**: Click the language button in the top right to switch between English and Chinese
7. **Notification Permission**: For first-time use, we recommend granting notification permissions to receive alerts when sessions end

### 🔧 The Pomodoro Technique

The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Here's how it works:

1. Decide on the task to be done
2. Set the Pomodoro timer for 25 minutes (adjustable)
3. Work on the task until the timer rings
4. Take a 5-minute break (adjustable)
5. After four Pomodoro cycles, take a longer break (15-30 minutes)

### 💻 Tech Stack

- Cloudflare Workers: Serverless runtime environment
- Pure Vanilla JavaScript: No additional frameworks needed
- HTML5 & CSS3: Responsive interface design
- Web Notifications API: Desktop notifications
- localStorage API: State persistence implementation

## 📝 License

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 Contributing

欢迎贡献代码！请查看各个项目的具体贡献指南。

## 📞 Contact

- **GitHub Issues**: [提交问题](https://github.com/zgx/cf-workers/issues)
- **讨论**: [GitHub Discussions](https://github.com/zgx/cf-workers/discussions)

---

⭐ **如果这些项目对你有帮助，请给仓库一个 Star！**

💡 **提示**: 所有项目都可以免费部署到 Cloudflare Workers，每天有充足的免费额度供个人使用。

## 🤝 Contributing

We welcome issue reports and feature suggestions! If you want to contribute code, please open an issue first to discuss what you would like to change.

## 🚀 通用部署指南

### 前置要求

1. **Cloudflare 账户**：注册并登录 [Cloudflare](https://dash.cloudflare.com/)
2. **Node.js**：安装 Node.js 16.0 或更高版本
3. **Wrangler CLI**：Cloudflare Workers 的命令行工具

### 安装 Wrangler

```bash
npm install -g wrangler
```

### 登录 Cloudflare

```bash
wrangler login
```

### 部署项目

选择任一项目目录，运行：

```bash
npm install
npm run deploy
```

## 🛠️ 开发环境设置

### 推荐的开发工具

- **IDE**: Visual Studio Code
- **扩展**: 
  - Cloudflare Workers
  - TypeScript and JavaScript Language Features
  - Auto Rename Tag
  - Live Server

### 本地开发

每个项目都支持本地开发模式：

```bash
cd [project-directory]
npm run dev
```

这将启动 Wrangler 开发服务器，通常在 `http://localhost:8787`。

## 📊 项目特性对比

| 功能 | QR Link | Pomodoro Timer |
|------|---------|----------------|
| 用户界面 | 单页应用 | 单页应用 |
| 语言支持 | 中文 | 中英双语 |
| 数据持久化 | 无 | localStorage |
| 通知功能 | 无 | 桌面通知 |
| 响应式设计 | ✅ | ✅ |
| PWA 支持 | ❌ | ❌ |
| 离线功能 | ❌ | ❌ |

## 🔧 技术架构

所有项目都基于以下技术栈：

- **运行环境**: Cloudflare Workers
- **开发语言**: TypeScript/JavaScript  
- **构建工具**: Wrangler
- **前端技术**: HTML5, CSS3, Vanilla JavaScript
- **部署方式**: 边缘计算，全球 CDN

### Cloudflare Workers 优势

- ⚡ **极速启动**: 冷启动时间 < 5ms
- 🌍 **全球分布**: 在 200+ 个城市的边缘节点运行
- 💰 **成本效益**: 免费层每天 100,000 次请求
- 🔒 **安全可靠**: 企业级安全保障
- 📈 **自动扩容**: 根据流量自动调整资源

## 📈 性能优化

### 通用优化策略

1. **资源压缩**: 所有静态资源都经过压缩
2. **缓存策略**: 合理设置 Cache-Control 头
3. **字体优化**: 使用 font-display: swap
4. **图片优化**: 使用现代图片格式
5. **代码分割**: 按需加载非关键资源

### 监控和分析

- **Cloudflare Analytics**: 内置流量分析
- **Real User Monitoring**: 真实用户体验监控
- **Error Tracking**: 错误日志收集

## 🚨 故障排除

### 常见问题

1. **部署失败**
   ```bash
   # 检查 wrangler 配置
   wrangler whoami
   
   # 重新登录
   wrangler logout && wrangler login
   ```

2. **本地开发无法访问**
   ```bash
   # 检查端口占用
   lsof -i :8787
   
   # 使用其他端口
   wrangler dev --port 8788
   ```

3. **TypeScript 编译错误**
   ```bash
   # 清理并重新安装依赖
   rm -rf node_modules package-lock.json
   npm install
   ```

### 调试技巧

- 使用 `console.log()` 在 Wrangler 控制台查看输出
- 利用 Chrome DevTools 调试前端代码
- 查看 Cloudflare Dashboard 的实时日志

---

## 📝 License