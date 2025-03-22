import { Env } from './types';
import { styles } from './styles/styles';
import { PomodoroApp } from './utils/app';

const html = `<!DOCTYPE html>
<html id="htmlRoot">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="pageTitle">Pomodoro Timer</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-5 0 110 100%22><text y=%2280%22 font-size=%2280%22>🍅</text></svg>" type="image/svg+xml">
  <style>${styles}</style>
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
    
    <div class="tomato-counter" id="tomatoCounter"></div>
    
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
    document.addEventListener('DOMContentLoaded', () => {
      new PomodoroApp();
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