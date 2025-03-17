/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>番茄钟</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-5 0 110 100%22><text y=%2280%22 font-size=%2280%22>🍅</text></svg>" type="image/svg+xml">
  <style>
    :root {
      --primary-color: #ff6347;
      --secondary-color: #4a6fa5;
      --background-color: #f8f9fa;
      --card-bg: #ffffff;
      --text-color: #2c3e50;
      --button-hover: #e74c3c;
      --button-secondary-hover: #3a5683;
      --border-radius: 12px;
      --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      --transition: all 0.3s ease;
      
      /* 工作模式颜色 */
      --work-primary: #ff6347;
      --work-light: #fff1f0;
      --work-accent: #e74c3c;
      
      /* 休息模式颜色 */
      --break-primary: #4a6fa5;
      --break-light: #eef4ff;
      --break-accent: #3a5683;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: var(--background-color);
      color: var(--text-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      line-height: 1.6;
    }
    
    .container {
      background-color: var(--card-bg);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: 35px;
      width: 100%;
      max-width: 450px;
      text-align: center;
      transition: var(--transition);
      border-top: 5px solid var(--primary-color);
    }
    
    h1 {
      color: var(--primary-color);
      margin-bottom: 20px;
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .timer-container {
      position: relative;
      margin: 30px 0;
    }
    
    .timer {
      font-size: 5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 10px 0;
      text-shadow: 0 2px 5px rgba(0,0,0,0.05);
      transition: var(--transition);
    }
    
    .status {
      font-size: 1.2rem;
      margin-bottom: 15px;
      color: var(--text-color);
      font-weight: 500;
      opacity: 0.9;
    }
    
    .progress-container {
      margin: 25px 0;
    }
    
    .progress-bar {
      width: 100%;
      height: 12px;
      background-color: rgba(0,0,0,0.05);
      border-radius: 20px;
      overflow: hidden;
      margin: 15px 0;
    }
    
    .progress {
      height: 100%;
      background: linear-gradient(to right, var(--primary-color), #ff8c7a);
      width: 0%;
      transition: width 1s linear;
      border-radius: 20px;
    }
    
    .controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 25px;
    }
    
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }
    
    .start-btn {
      background-color: var(--primary-color);
      box-shadow: 0 4px 10px rgba(231, 76, 60, 0.2);
    }
    
    .start-btn:hover {
      background-color: var(--button-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(231, 76, 60, 0.3);
    }
    
    .skip-btn, .reset-btn {
      background-color: var(--secondary-color);
      box-shadow: 0 4px 10px rgba(74, 111, 165, 0.2);
    }
    
    .skip-btn:hover, .reset-btn:hover {
      background-color: var(--button-secondary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(74, 111, 165, 0.3);
    }
    
    .settings {
      margin-top: 40px;
      text-align: left;
      background-color: rgba(0,0,0,0.02);
      padding: 20px;
      border-radius: var(--border-radius);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease, padding 0.5s ease, margin 0.5s ease;
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
    }
    
    .settings.expanded {
      max-height: 400px;
      padding: 20px;
      margin-top: 40px;
    }
    
    .settings-toggle {
      margin-top: 20px;
      background: none;
      border: none;
      color: var(--text-color);
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: rgba(0,0,0,0.05);
      transition: var(--transition);
      margin-left: auto;
      margin-right: auto;
    }
    
    .settings-toggle:hover {
      background-color: rgba(0,0,0,0.08);
      transform: rotate(30deg);
    }
    
    .settings-toggle:before {
      content: "⚙️";
      font-size: 1.5rem;
    }
    
    .work-theme .settings-toggle:hover {
      color: var(--work-primary);
    }
    
    .break-theme .settings-toggle:hover {
      color: var(--break-primary);
    }
    
    .settings h2 {
      font-size: 1.3rem;
      margin-bottom: 15px;
      color: var(--text-color);
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    
    .settings h2:before {
      content: "⚙️";
      margin-right: 8px;
      font-size: 1.2rem;
    }
    
    .settings-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-color);
    }
    
    input[type="number"] {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 8px;
      font-size: 1rem;
      transition: var(--transition);
    }
    
    input[type="number"]:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .mode-indicator {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
      transition: var(--transition);
    }
    
    .work-mode {
      background-color: var(--work-primary);
      color: white;
    }
    
    .break-mode {
      background-color: var(--break-primary);
      color: white;
    }
    
    /* 工作模式和休息模式的容器样式 */
    .container.work-theme {
      border-top: 5px solid var(--work-primary);
      background-color: var(--work-light);
    }
    
    .container.break-theme {
      border-top: 5px solid var(--break-primary);
      background-color: var(--break-light);
    }
    
    /* 工作模式和休息模式的计时器样式 */
    .work-theme .timer {
      color: var(--work-primary);
    }
    
    .break-theme .timer {
      color: var(--break-primary);
    }
    
    /* 工作模式和休息模式的进度条样式 */
    .work-theme .progress {
      background: linear-gradient(to right, var(--work-primary), #ff8c7a);
    }
    
    .break-theme .progress {
      background: linear-gradient(to right, var(--break-primary), #7a9dcb);
    }
    
    /* 工作模式和休息模式的标题样式 */
    .work-theme h1 {
      color: var(--work-primary);
    }
    
    .break-theme h1 {
      color: var(--break-primary);
    }
    
    /* 工作模式和休息模式的按钮样式 */
    .work-theme .start-btn {
      background-color: var(--work-primary);
      box-shadow: 0 4px 10px rgba(231, 76, 60, 0.2);
    }
    
    .break-theme .start-btn {
      background-color: var(--break-primary);
      box-shadow: 0 4px 10px rgba(74, 111, 165, 0.2);
    }
    
    .work-theme .start-btn:hover {
      background-color: var(--work-accent);
    }
    
    .break-theme .start-btn:hover {
      background-color: var(--break-accent);
    }
    
    @media (max-width: 480px) {
      .container {
        padding: 25px 20px;
      }
      
      .timer {
        font-size: 4rem;
      }
      
      .controls {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      button {
        flex: 1;
        min-width: 100px;
        padding: 10px 15px;
      }
      
      .settings {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container work-theme" id="container">
    <h1>番茄钟</h1>
    
    <div class="mode-indicator work-mode" id="modeIndicator">专注工作模式</div>
    
    <div class="status" id="statusDisplay">准备开始</div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress" id="progress"></div>
      </div>
    </div>
    
    <div class="timer-container">
      <div class="timer" id="timer">25:00</div>
    </div>
    
    <div class="controls">
      <button class="start-btn" id="startBtn">开始</button>
      <button class="skip-btn" id="skipBtn">跳过</button>
      <button class="reset-btn" id="resetBtn">重置</button>
    </div>
    
    <button class="settings-toggle" id="settingsToggle" aria-label="设置"></button>
    
    <div class="settings" id="settings">
      <h2>设置</h2>
      <div class="settings-group">
        <label for="workTime">工作时间（分钟）</label>
        <input type="number" id="workTime" min="1" max="60" value="25">
      </div>
      <div class="settings-group">
        <label for="breakTime">休息时间（分钟）</label>
        <input type="number" id="breakTime" min="1" max="30" value="5">
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // DOM 元素
      const timerDisplay = document.getElementById('timer');
      const startBtn = document.getElementById('startBtn');
      const skipBtn = document.getElementById('skipBtn');
      const resetBtn = document.getElementById('resetBtn');
      const statusDisplay = document.getElementById('statusDisplay');
      const progressBar = document.getElementById('progress');
      const workTimeInput = document.getElementById('workTime');
      const breakTimeInput = document.getElementById('breakTime');
      const modeIndicator = document.getElementById('modeIndicator');
      const settingsToggle = document.getElementById('settingsToggle');
      const settings = document.getElementById('settings');
      
      // 通知功能
      let notificationPermissionGranted = false;
      
      // 检查通知权限
      function checkNotificationPermission() {
        if (!('Notification' in window)) {
          console.log('此浏览器不支持通知功能');
          return false;
        }
        
        return Notification.permission === 'granted';
      }
      
      // 请求通知权限
      function requestNotificationPermission() {
        if (!('Notification' in window)) {
          console.log('此浏览器不支持通知功能');
          return;
        }
        
        Notification.requestPermission()
          .then(permission => {
            notificationPermissionGranted = permission === 'granted';
            
            if (notificationPermissionGranted) {
              // 发送测试通知
              try {
                const testNotification = new Notification('番茄钟已准备就绪', {
                  body: '您将在每个工作和休息阶段结束时收到通知',
                  icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f345.png'
                });
                
                // 3秒后自动关闭测试通知
                setTimeout(() => testNotification.close(), 3000);
              } catch (error) {
                console.error('发送通知时出错:', error);
              }
            }
          });
      }
      
      // 发送通知
      function sendNotification(title, message) {
        if (!checkNotificationPermission()) {
          console.log('通知权限未授予，无法发送通知');
          return;
        }
        
        try {
          const notification = new Notification(title, {
            body: message,
            icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f345.png',
            requireInteraction: true  // 通知会一直显示，直到用户交互
          });
          
          // 点击通知时聚焦到应用
          notification.onclick = function() {
            window.focus();
            this.close();
          };
          
          // 播放提示音
          const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-notification-306.mp3');
          audio.play().catch(e => console.log('无法播放提示音:', e));
          
          // 10秒后自动关闭通知
          setTimeout(() => notification.close(), 10000);
        } catch (error) {
          console.error('发送通知时出错:', error);
        }
      }
      
      // 设置区域切换
      settingsToggle.addEventListener('click', () => {
        settings.classList.toggle('expanded');
        
        // 每次打开设置时检查通知权限
        if (settings.classList.contains('expanded')) {
          notificationPermissionGranted = checkNotificationPermission();
          
          if (!notificationPermissionGranted) {
            // 如果已经有通知状态元素，则移除它
            const existingStatus = document.querySelector('.notification-status');
            if (existingStatus) {
              existingStatus.remove();
            }
            
            // 创建新的通知状态元素
            const notificationStatus = document.createElement('div');
            notificationStatus.className = 'notification-status';
            notificationStatus.style.marginBottom = '20px';
            
            // 使用DOM API创建元素而不是innerHTML
            const paragraph = document.createElement('p');
            paragraph.style.color = '#e74c3c';
            paragraph.style.marginTop = '15px';
            paragraph.style.fontSize = '0.9rem';
            paragraph.style.marginBottom = '15px';
            paragraph.textContent = '通知权限未开启，您将无法收到时钟结束通知。';
            
            const enableButton = document.createElement('button');
            enableButton.id = 'enableNotifications';
            enableButton.style.background = 'var(--primary-color)';
            enableButton.style.color = 'white';
            enableButton.style.border = 'none';
            enableButton.style.padding = '8px 15px';
            enableButton.style.borderRadius = '4px';
            enableButton.style.cursor = 'pointer';
            enableButton.style.marginTop = '10px';
            enableButton.style.display = 'block';
            enableButton.style.width = '100%';
            enableButton.textContent = '开启通知';
            
            paragraph.appendChild(enableButton);
            notificationStatus.appendChild(paragraph);
            
            settings.appendChild(notificationStatus);
            
            enableButton.addEventListener('click', () => {
              requestNotificationPermission();
              notificationStatus.remove();
            });
          }
        }
      });
      
      // 状态变量
      let isRunning = false;
      let isWorkTime = true;
      let timer = null;
      let timeLeft = workTimeInput.value * 60;
      let totalTime = workTimeInput.value * 60;
      
      // 从本地存储加载设置
      function loadSettings() {
        const savedWorkTime = localStorage.getItem('workTime');
        const savedBreakTime = localStorage.getItem('breakTime');
        
        if (savedWorkTime) {
          workTimeInput.value = savedWorkTime;
        }
        
        if (savedBreakTime) {
          breakTimeInput.value = savedBreakTime;
        }
        
        timeLeft = workTimeInput.value * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        updateModeIndicator();
      }
      
      // 保存设置到本地存储
      function saveSettings() {
        localStorage.setItem('workTime', workTimeInput.value);
        localStorage.setItem('breakTime', breakTimeInput.value);
      }
      
      // 更新计时器显示
      function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        
        // 更新进度条
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = \`\${progress}%\`;
      }
      
      // 更新模式指示器
      function updateModeIndicator() {
        const container = document.getElementById('container');
        
        if (isWorkTime) {
          modeIndicator.textContent = '专注工作模式';
          modeIndicator.className = 'mode-indicator work-mode';
          container.className = 'container work-theme';
          document.body.style.backgroundColor = '#fff9f8';
        } else {
          modeIndicator.textContent = '休息放松模式';
          modeIndicator.className = 'mode-indicator break-mode';
          container.className = 'container break-theme';
          document.body.style.backgroundColor = '#f5f8ff';
        }
      }
      
      // 开始计时器
      function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.textContent = '暂停';
        
        statusDisplay.textContent = isWorkTime ? '专注工作中...' : '休息时间...';
        
        timer = setInterval(() => {
          timeLeft--;
          updateTimerDisplay();
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = '开始';
            
            // 切换工作/休息状态
            isWorkTime = !isWorkTime;
            updateModeIndicator();
            
            // 发送通知
            const notificationTitle = '番茄钟';
            const notificationMessage = isWorkTime ? '休息时间结束！开始工作吧。' : '工作时间结束！休息一下吧。';
            
            // 尝试发送通知
            sendNotification(notificationTitle, notificationMessage);
            
            // 设置新的时间
            timeLeft = isWorkTime ? workTimeInput.value * 60 : breakTimeInput.value * 60;
            totalTime = timeLeft;
            updateTimerDisplay();
            statusDisplay.textContent = isWorkTime ? '准备工作' : '准备休息';
          }
        }, 1000);
      }
      
      // 暂停计时器
      function pauseTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = '继续';
        statusDisplay.textContent = '已暂停';
      }
      
      // 跳过当前阶段
      function skipPhase() {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = '开始';
        
        // 切换工作/休息状态
        isWorkTime = !isWorkTime;
        updateModeIndicator();
        
        // 设置新的时间
        timeLeft = isWorkTime ? workTimeInput.value * 60 : breakTimeInput.value * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        statusDisplay.textContent = isWorkTime ? '准备工作' : '准备休息';
      }
      
      // 重置计时器
      function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isWorkTime = true;
        startBtn.textContent = '开始';
        
        timeLeft = workTimeInput.value * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        updateModeIndicator();
        statusDisplay.textContent = '准备开始';
      }
      
      // 事件监听器
      startBtn.addEventListener('click', () => {
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      });
      
      skipBtn.addEventListener('click', skipPhase);
      resetBtn.addEventListener('click', resetTimer);
      
      workTimeInput.addEventListener('change', () => {
        if (!isRunning && isWorkTime) {
          timeLeft = workTimeInput.value * 60;
          totalTime = timeLeft;
          updateTimerDisplay();
        }
        saveSettings();
      });
      
      breakTimeInput.addEventListener('change', () => {
        if (!isRunning && !isWorkTime) {
          timeLeft = breakTimeInput.value * 60;
          totalTime = timeLeft;
          updateTimerDisplay();
        }
        saveSettings();
      });
      
      // 初始化
      loadSettings();
      
      // 初始化时检查通知权限
      notificationPermissionGranted = checkNotificationPermission();
      if (!notificationPermissionGranted) {
        // 在页面加载后3秒请求通知权限
        setTimeout(() => {
          requestNotificationPermission();
        }, 3000);
      }
    });
  </script>
</body>
</html>`;

export default {
	async fetch(request, env, ctx) {
		return new Response(html, {
			headers: {
				'Content-Type': 'text/html;charset=UTF-8',
			},
		});
	},
};
