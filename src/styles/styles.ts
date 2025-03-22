export const styles = `
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

/* 番茄计数样式 */
.tomato-counter {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  flex-wrap: wrap;
  min-height: 32px;
  overflow: hidden;
}

.tomato-icon {
  font-size: 24px;
  margin: 0 3px;
  transition: transform 0.3s ease;
  display: inline-block;
  animation: popIn 0.5s ease forwards;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
}`; 