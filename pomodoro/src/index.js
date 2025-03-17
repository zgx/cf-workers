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
<html id="htmlRoot">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="pageTitle">Pomodoro Timer</title>
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
    
    /* 语言切换按钮样式 */
    .language-switch {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(255,255,255,0.9);
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 14px;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.2s ease;
    }
    
    .language-switch:hover {
      background: rgba(255,255,255,1);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <button id="languageSwitch" class="language-switch">🌐 English / 中文</button>
  
  <div class="container work-theme" id="container">
    <h1 id="heading">Pomodoro Timer</h1>
    
    <div class="mode-indicator work-mode" id="modeIndicator">Focus Work Mode</div>
    
    <div class="status" id="statusDisplay">Ready to Start</div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress" id="progress"></div>
      </div>
    </div>
    
    <div class="timer-container">
      <div class="timer" id="timer">25:00</div>
    </div>
    
    <div class="controls">
      <button class="start-btn" id="startBtn">Start</button>
      <button class="skip-btn" id="skipBtn">Skip</button>
      <button class="reset-btn" id="resetBtn">Reset</button>
    </div>
    
    <button class="settings-toggle" id="settingsToggle" aria-label="Settings"></button>
    
    <div class="settings" id="settings">
      <h2 id="settingsHeading">Settings</h2>
      <div class="settings-group">
        <label for="workTime" id="workTimeLabel">Work Time (minutes)</label>
        <input type="number" id="workTime" min="1" max="60" value="25">
      </div>
      <div class="settings-group">
        <label for="breakTime" id="breakTimeLabel">Break Time (minutes)</label>
        <input type="number" id="breakTime" min="1" max="30" value="5">
      </div>
    </div>
  </div>

  <script>
    // 翻译数据
    const translations = {
      zh: {
        title: '番茄时钟',
        heading: '番茄时钟',
        workMode: '专注工作模式',
        breakMode: '休息放松模式',
        ready: '准备开始',
        working: '专注工作中...',
        resting: '休息时间...',
        paused: '已暂停',
        readyToWork: '准备工作',
        readyToRest: '准备休息',
        start: '开始',
        pause: '暂停',
        resume: '继续',
        skip: '跳过',
        reset: '重置',
        settings: '设置',
        workTime: '工作时间（分钟）',
        breakTime: '休息时间（分钟）',
        notificationTitle: '番茄时钟',
        workEndMessage: '工作时间结束！休息一下吧。',
        breakEndMessage: '休息时间结束！开始工作吧。',
        notSupported: '此浏览器不支持通知功能',
        notificationReady: '番茄时钟已准备就绪',
        notificationReadyBody: '您将在每个工作和休息阶段结束时收到通知',
        notificationPermission: '通知权限未开启，您将无法收到时钟结束通知。',
        enableNotification: '开启通知'
      },
      en: {
        title: 'Pomodoro Timer',
        heading: 'Pomodoro Timer',
        workMode: 'Focus Work Mode',
        breakMode: 'Break Mode',
        ready: 'Ready to Start',
        working: 'Working...',
        resting: 'Taking a break...',
        paused: 'Paused',
        readyToWork: 'Ready to work',
        readyToRest: 'Ready to rest',
        start: 'Start',
        pause: 'Pause',
        resume: 'Resume',
        skip: 'Skip',
        reset: 'Reset',
        settings: 'Settings',
        workTime: 'Work Time (minutes)',
        breakTime: 'Break Time (minutes)',
        notificationTitle: 'Pomodoro Timer',
        workEndMessage: 'Work time is over! Take a break.',
        breakEndMessage: 'Break time is over! Back to work.',
        notSupported: 'This browser does not support notifications',
        notificationReady: 'Pomodoro Timer is ready',
        notificationReadyBody: 'You will receive notifications at the end of each work and break session',
        notificationPermission: 'Notification permission is not granted. You will not receive timer notifications.',
        enableNotification: 'Enable Notifications'
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      // 检测浏览器语言
      const userLang = navigator.language || navigator.userLanguage || 'en';
      
      // 从本地存储中获取用户选择的语言
      let savedLang = localStorage.getItem('preferredLanguage');
      
      // 更精确的语言检测
      let lang = 'en';
      if (savedLang) {
        // 如果有保存的语言偏好，使用它
        lang = savedLang;
      } else if (userLang.toLowerCase().indexOf('zh') !== -1) {
        // 否则根据浏览器语言判断
        lang = 'zh';
      }
      
      // 设置HTML lang属性
      document.getElementById('htmlRoot').setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
      
      // 获取翻译对象
      let t = translations[lang];
      
      // 更新所有UI文本的函数
      function updateUILanguage() {
        document.getElementById('pageTitle').textContent = t.title;
        document.getElementById('heading').textContent = t.heading;
        document.getElementById('modeIndicator').textContent = isWorkTime ? t.workMode : t.breakMode;
        document.getElementById('statusDisplay').textContent = isRunning ? 
          (isWorkTime ? t.working : t.resting) : 
          (timeLeft < totalTime ? t.paused : t.ready);
        document.getElementById('startBtn').textContent = isRunning ? t.pause : (timeLeft < totalTime ? t.resume : t.start);
        document.getElementById('skipBtn').textContent = t.skip;
        document.getElementById('resetBtn').textContent = t.reset;
        document.getElementById('settingsHeading').textContent = t.settings;
        document.getElementById('workTimeLabel').textContent = t.workTime;
        document.getElementById('breakTimeLabel').textContent = t.breakTime;
        document.getElementById('settingsToggle').setAttribute('aria-label', t.settings);
        
        // 更新语言切换按钮文本
        languageSwitch.textContent = lang === 'zh' ? '🌐 English' : '🌐 中文';
      }
      
      // 切换语言的函数
      function switchLanguage() {
        lang = lang === 'zh' ? 'en' : 'zh';
        t = translations[lang];
        document.getElementById('htmlRoot').setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
        
        // 保存语言偏好到本地存储
        localStorage.setItem('preferredLanguage', lang);
        
        updateUILanguage();
      }
      
      // 添加语言切换按钮事件
      languageSwitch.addEventListener('click', switchLanguage);
      
      // 状态变量
      let isRunning = false;
      let isWorkTime = true;
      let timer = null;
      let timeLeft = 0;
      let totalTime = 0;
      
      // 从本地存储加载设置
      function loadSettings() {
        const savedWorkTime = localStorage.getItem('workTime');
        const savedBreakTime = localStorage.getItem('breakTime');
        
        if (savedWorkTime) {
          document.getElementById('workTime').value = savedWorkTime;
        }
        
        if (savedBreakTime) {
          document.getElementById('breakTime').value = savedBreakTime;
        }
        
        timeLeft = document.getElementById('workTime').value * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        updateModeIndicator();
        
        // 初始化后更新UI语言
        updateUILanguage();
      }
      
      // 保存设置到本地存储
      function saveSettings() {
        localStorage.setItem('workTime', document.getElementById('workTime').value);
        localStorage.setItem('breakTime', document.getElementById('breakTime').value);
      }
      
      // 更新计时器显示
      function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        
        // 更新进度条
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        document.getElementById('progress').style.width = \`\${progress}%\`;
      }
      
      // 更新模式指示器
      function updateModeIndicator() {
        const container = document.getElementById('container');
        
        if (isWorkTime) {
          document.getElementById('modeIndicator').textContent = t.workMode;
          document.getElementById('modeIndicator').className = 'mode-indicator work-mode';
          container.className = 'container work-theme';
          document.body.style.backgroundColor = '#fff9f8';
        } else {
          document.getElementById('modeIndicator').textContent = t.breakMode;
          document.getElementById('modeIndicator').className = 'mode-indicator break-mode';
          container.className = 'container break-theme';
          document.body.style.backgroundColor = '#f5f8ff';
        }
      }
      
      // 开始计时器
      function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        document.getElementById('startBtn').textContent = t.pause;
        
        document.getElementById('statusDisplay').textContent = isWorkTime ? t.working : t.resting;
        
        timer = setInterval(() => {
          timeLeft--;
          updateTimerDisplay();
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            document.getElementById('startBtn').textContent = t.start;
            
            // 切换工作/休息状态
            isWorkTime = !isWorkTime;
            updateModeIndicator();
            
            // 发送通知
            const notificationTitle = t.notificationTitle;
            const notificationMessage = isWorkTime ? t.breakEndMessage : t.workEndMessage;
            
            // 尝试发送通知
            sendNotification(notificationTitle, notificationMessage);
            
            // 设置新的时间
            timeLeft = isWorkTime ? document.getElementById('workTime').value * 60 : document.getElementById('breakTime').value * 60;
            totalTime = timeLeft;
            updateTimerDisplay();
            document.getElementById('statusDisplay').textContent = isWorkTime ? t.readyToWork : t.readyToRest;
          }
        }, 1000);
      }
      
      // 暂停计时器
      function pauseTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isRunning = false;
        document.getElementById('startBtn').textContent = t.resume;
        document.getElementById('statusDisplay').textContent = t.paused;
      }
      
      // 跳过当前阶段
      function skipPhase() {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('startBtn').textContent = t.start;
        
        // 切换工作/休息状态
        isWorkTime = !isWorkTime;
        updateModeIndicator();
        
        // 设置新的时间
        timeLeft = isWorkTime ? document.getElementById('workTime').value * 60 : document.getElementById('breakTime').value * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        document.getElementById('statusDisplay').textContent = isWorkTime ? t.readyToWork : t.readyToRest;
      }
      
      // 重置计时器
      function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isWorkTime = true;
        document.getElementById('startBtn').textContent = t.start;
        
        timeLeft = document.getElementById('workTime').value * 60;
        totalTime = timeLeft;
        updateTimerDisplay();
        updateModeIndicator();
        document.getElementById('statusDisplay').textContent = t.ready;
      }
      
      // 事件监听器
      document.getElementById('startBtn').addEventListener('click', () => {
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      });
      
      document.getElementById('skipBtn').addEventListener('click', skipPhase);
      document.getElementById('resetBtn').addEventListener('click', resetTimer);
      
      document.getElementById('workTime').addEventListener('change', () => {
        if (!isRunning && isWorkTime) {
          timeLeft = document.getElementById('workTime').value * 60;
          totalTime = timeLeft;
          updateTimerDisplay();
        }
        saveSettings();
      });
      
      document.getElementById('breakTime').addEventListener('change', () => {
        if (!isRunning && !isWorkTime) {
          timeLeft = document.getElementById('breakTime').value * 60;
          totalTime = timeLeft;
          updateTimerDisplay();
        }
        saveSettings();
      });
      
      // 初始化
      loadSettings();
      
      // 设置区域切换
      document.getElementById('settingsToggle').addEventListener('click', () => {
        const settings = document.getElementById('settings');
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
            paragraph.textContent = t.notificationPermission;
            
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
            enableButton.textContent = t.enableNotification;
            
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
      
      // 通知功能
      let notificationPermissionGranted = false;
      
      // 检查通知权限
      function checkNotificationPermission() {
        if (!('Notification' in window)) {
          console.log(t.notSupported);
          return false;
        }
        
        return Notification.permission === 'granted';
      }
      
      // 请求通知权限
      function requestNotificationPermission() {
        if (!('Notification' in window)) {
          console.log(t.notSupported);
          return;
        }
        
        Notification.requestPermission()
          .then(permission => {
            notificationPermissionGranted = permission === 'granted';
            
            if (notificationPermissionGranted) {
              // 发送测试通知
              try {
                const testNotification = new Notification(t.notificationReady, {
                  body: t.notificationReadyBody,
                  icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f345.png'
                });
                
                // 3秒后自动关闭测试通知
                setTimeout(() => testNotification.close(), 3000);
              } catch (error) {
                console.error('Error sending notification:', error);
              }
            }
          });
      }
      
      // 发送通知
      function sendNotification(title, message) {
        if (!checkNotificationPermission()) {
          console.log('Notification permission not granted');
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
          audio.play().catch(e => console.log('Cannot play sound:', e));
          
          // 10秒后自动关闭通知
          setTimeout(() => notification.close(), 10000);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
      
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
