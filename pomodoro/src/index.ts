import { Env } from './types/index';
import { styles } from './styles/styles';

const html = `<!DOCTYPE html>
<html id="htmlRoot" lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="pageTitle">番茄时钟</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-5 0 110 100%22><text y=%2280%22 font-size=%2280%22>🍅</text></svg>" type="image/svg+xml">
  <style>${styles}</style>
</head>
<body>
  <button id="languageSwitch" class="language-switch">🌐 English</button>
  <div id="container" class="container work-theme">
    <h1 id="heading">番茄时钟</h1>
    <div id="modeIndicator" class="mode-indicator work-mode">专注工作模式</div>
    
    <div class="timer-container">
      <div id="statusDisplay" class="status">准备开始</div>
      <div id="timer" class="timer">25:00</div>
    </div>

    <div class="progress-container">
      <div class="progress-bar">
        <div id="progress" class="progress" style="width: 0%"></div>
      </div>
    </div>

    <div id="tomatoCounter" class="tomato-counter"></div>

    <div class="controls">
      <button id="startBtn" class="start-btn">开始</button>
      <button id="skipBtn" class="skip-btn">跳过</button>
      <button id="resetBtn" class="reset-btn">重置</button>
    </div>

    <button id="settingsToggle" class="settings-toggle" aria-label="设置"></button>

    <div id="settings" class="settings">
      <h2 id="settingsHeading">设置</h2>
      <div class="settings-group">
        <label id="workTimeLabel" for="workTime">工作时间（分钟）</label>
        <input type="number" id="workTime" min="1" max="60" value="25">
      </div>
      <div class="settings-group">
        <label id="breakTimeLabel" for="breakTime">休息时间（分钟）</label>
        <input type="number" id="breakTime" min="1" max="30" value="5">
      </div>
    </div>
  </div>

  <script>
    // 客户端初始化代码
    document.addEventListener('DOMContentLoaded', () => {
      // 在这里初始化应用
      const startBtn = document.getElementById('startBtn');
      const skipBtn = document.getElementById('skipBtn');
      const resetBtn = document.getElementById('resetBtn');
      const settingsToggle = document.getElementById('settingsToggle');
      const settings = document.getElementById('settings');
      const workTimeInput = document.getElementById('workTime');
      const breakTimeInput = document.getElementById('breakTime');
      const languageSwitch = document.getElementById('languageSwitch');
      const timer = document.getElementById('timer');
      const progress = document.getElementById('progress');
      const statusDisplay = document.getElementById('statusDisplay');
      const modeIndicator = document.getElementById('modeIndicator');
      const tomatoCounter = document.getElementById('tomatoCounter');
      const container = document.getElementById('container');

      let isRunning = false;
      let isWorkTime = true;
      let timeLeft = 25 * 60;
      let totalTime = timeLeft;
      let intervalId = null;

      function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
        progress.style.width = \`\${progressPercent}%\`;
      }

      function start() {
        if (intervalId) return;
        
        isRunning = true;
        startBtn.textContent = '暂停';
        statusDisplay.textContent = isWorkTime ? '专注工作中...' : '休息时间...';
        
        intervalId = setInterval(() => {
          timeLeft--;
          updateDisplay();
          
          if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            
            if (isWorkTime) {
              // 增加番茄计数
              const tomato = document.createElement('span');
              tomato.textContent = '🍅';
              tomato.className = 'tomato-icon';
              tomatoCounter.appendChild(tomato);
              
              // 播放提示音
              const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-notification-306.mp3');
              audio.play().catch(console.error);
            }
            
            // 切换模式
            isWorkTime = !isWorkTime;
            timeLeft = (isWorkTime ? workTimeInput.value : breakTimeInput.value) * 60;
            totalTime = timeLeft;
            startBtn.textContent = '开始';
            container.className = \`container \${isWorkTime ? 'work-theme' : 'break-theme'}\`;
            modeIndicator.className = \`mode-indicator \${isWorkTime ? 'work-mode' : 'break-mode'}\`;
            modeIndicator.textContent = isWorkTime ? '专注工作模式' : '休息放松模式';
            statusDisplay.textContent = isWorkTime ? '准备工作' : '准备休息';
            updateDisplay();
          }
        }, 1000);
      }

      function pause() {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          isRunning = false;
          startBtn.textContent = '继续';
          statusDisplay.textContent = '已暂停';
        }
      }

      startBtn.addEventListener('click', () => {
        if (isRunning) {
          pause();
        } else {
          start();
        }
      });

      skipBtn.addEventListener('click', () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        isRunning = false;
        isWorkTime = !isWorkTime;
        timeLeft = (isWorkTime ? workTimeInput.value : breakTimeInput.value) * 60;
        totalTime = timeLeft;
        startBtn.textContent = '开始';
        container.className = \`container \${isWorkTime ? 'work-theme' : 'break-theme'}\`;
        modeIndicator.className = \`mode-indicator \${isWorkTime ? 'work-mode' : 'break-mode'}\`;
        modeIndicator.textContent = isWorkTime ? '专注工作模式' : '休息放松模式';
        statusDisplay.textContent = '准备开始';
        updateDisplay();
      });

      resetBtn.addEventListener('click', () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        isRunning = false;
        isWorkTime = true;
        timeLeft = workTimeInput.value * 60;
        totalTime = timeLeft;
        startBtn.textContent = '开始';
        container.className = 'container work-theme';
        modeIndicator.className = 'mode-indicator work-mode';
        modeIndicator.textContent = '专注工作模式';
        statusDisplay.textContent = '准备开始';
        updateDisplay();
      });

      settingsToggle.addEventListener('click', () => {
        settings.classList.toggle('expanded');
      });

      workTimeInput.addEventListener('change', () => {
        if (!isRunning && isWorkTime) {
          timeLeft = workTimeInput.value * 60;
          totalTime = timeLeft;
          updateDisplay();
        }
      });

      breakTimeInput.addEventListener('change', () => {
        if (!isRunning && !isWorkTime) {
          timeLeft = breakTimeInput.value * 60;
          totalTime = timeLeft;
          updateDisplay();
        }
      });

      let isEnglish = false;
      languageSwitch.addEventListener('click', () => {
        isEnglish = !isEnglish;
        const texts = isEnglish ? {
          title: 'Pomodoro Timer',
          heading: 'Pomodoro Timer',
          workMode: 'Focus Work Mode',
          breakMode: 'Break Mode',
          ready: 'Ready to Start',
          working: 'Working...',
          resting: 'Taking a break...',
          paused: 'Paused',
          start: 'Start',
          pause: 'Pause',
          resume: 'Resume',
          skip: 'Skip',
          reset: 'Reset',
          settings: 'Settings',
          workTime: 'Work Time (minutes)',
          breakTime: 'Break Time (minutes)',
          languageBtn: '🌐 中文'
        } : {
          title: '番茄时钟',
          heading: '番茄时钟',
          workMode: '专注工作模式',
          breakMode: '休息放松模式',
          ready: '准备开始',
          working: '专注工作中...',
          resting: '休息时间...',
          paused: '已暂停',
          start: '开始',
          pause: '暂停',
          resume: '继续',
          skip: '跳过',
          reset: '重置',
          settings: '设置',
          workTime: '工作时间（分钟）',
          breakTime: '休息时间（分钟）',
          languageBtn: '🌐 English'
        };

        document.title = texts.title;
        document.getElementById('heading').textContent = texts.heading;
        document.getElementById('modeIndicator').textContent = isWorkTime ? texts.workMode : texts.breakMode;
        statusDisplay.textContent = isRunning ? (isWorkTime ? texts.working : texts.resting) : 
                                  (intervalId ? texts.paused : texts.ready);
        startBtn.textContent = !isRunning ? texts.start : 
                             (intervalId ? texts.pause : texts.resume);
        skipBtn.textContent = texts.skip;
        resetBtn.textContent = texts.reset;
        document.getElementById('settingsHeading').textContent = texts.settings;
        document.getElementById('workTimeLabel').textContent = texts.workTime;
        document.getElementById('breakTimeLabel').textContent = texts.breakTime;
        languageSwitch.textContent = texts.languageBtn;
      });

      // 请求通知权限
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    });
  </script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  },
}; 