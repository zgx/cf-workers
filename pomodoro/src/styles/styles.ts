export const styles = `
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4a90e2;
  --background-color: #f7f9fc;
  --card-bg: #ffffff;
  --text-color: #2d3436;
  --button-hover: #ff5252;
  --button-secondary-hover: #357abd;
  --border-radius: 16px;
  --box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 工作模式颜色 */
  --work-primary: #ff6b6b;
  --work-light: #fff5f5;
  --work-accent: #ff5252;
  
  /* 休息模式颜色 */
  --break-primary: #4a90e2;
  --break-light: #f0f7ff;
  --break-accent: #357abd;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  line-height: 1.6;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(74, 144, 226, 0.05) 0%, transparent 50%);
}

.container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  text-align: center;
  transition: var(--transition);
  border: none;
  position: relative;
  overflow: hidden;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  transition: var(--transition);
}

h1 {
  color: var(--primary-color);
  margin-bottom: 25px;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timer-container {
  position: relative;
  margin: 35px 0;
}

.timer {
  font-size: 6rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 15px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: var(--transition);
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
}

.status {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: 600;
  opacity: 0.85;
}

.progress-container {
  margin: 30px 0;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: rgba(0,0,0,0.04);
  border-radius: 20px;
  overflow: hidden;
  margin: 15px 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.progress {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  width: 0%;
  transition: width 1s linear;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

button {
  padding: 14px 28px;
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
  min-width: 130px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0));
  opacity: 0;
  transition: var(--transition);
}

button:hover::after {
  opacity: 1;
}

.start-btn {
  background: linear-gradient(45deg, var(--primary-color), var(--button-hover));
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.skip-btn, .reset-btn {
  background: linear-gradient(45deg, var(--secondary-color), var(--button-secondary-hover));
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.skip-btn:hover, .reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.settings {
  margin-top: 40px;
  text-align: left;
  background: linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.9));
  padding: 25px;
  border-radius: var(--border-radius);
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}

.settings.expanded {
  max-height: 400px;
  padding: 25px;
  margin-top: 40px;
}

.settings-toggle {
  margin-top: 25px;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.04);
  transition: var(--transition);
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.settings-toggle:hover {
  background-color: rgba(0,0,0,0.06);
  transform: rotate(30deg);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.settings-toggle:before {
  content: "⚙️";
  font-size: 1.6rem;
}

.settings h2 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: 700;
  display: flex;
  align-items: center;
}

.settings h2:before {
  content: "⚙️";
  margin-right: 10px;
  font-size: 1.3rem;
}

.settings-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

input[type="number"] {
  width: 100%;
  padding: 14px;
  border: 2px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  font-size: 1rem;
  transition: var(--transition);
  background: rgba(255,255,255,0.9);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.15);
  background: white;
}

.mode-indicator {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: var(--transition);
  backdrop-filter: blur(5px);
}

.work-mode {
  background: linear-gradient(45deg, var(--work-primary), var(--work-accent));
  color: white;
}

.break-mode {
  background: linear-gradient(45deg, var(--break-primary), var(--break-accent));
  color: white;
}

.container.work-theme::before {
  background: linear-gradient(to right, var(--work-primary), var(--work-accent));
}

.container.break-theme::before {
  background: linear-gradient(to right, var(--break-primary), var(--break-accent));
}

.container.work-theme {
  background: linear-gradient(135deg, var(--work-light) 0%, white 100%);
}

.container.break-theme {
  background: linear-gradient(135deg, var(--break-light) 0%, white 100%);
}

.work-theme .timer {
  background: linear-gradient(45deg, var(--work-primary), var(--work-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.break-theme .timer {
  background: linear-gradient(45deg, var(--break-primary), var(--break-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.work-theme .progress {
  background: linear-gradient(to right, var(--work-primary), var(--work-accent));
}

.break-theme .progress {
  background: linear-gradient(to right, var(--break-primary), var(--break-accent));
}

.work-theme h1 {
  background: linear-gradient(45deg, var(--work-primary), var(--work-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.break-theme h1 {
  background: linear-gradient(45deg, var(--break-primary), var(--break-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.work-theme .start-btn {
  background: linear-gradient(45deg, var(--work-primary), var(--work-accent));
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.break-theme .start-btn {
  background: linear-gradient(45deg, var(--break-primary), var(--break-accent));
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.language-switch {
  position: fixed;
  top: 15px;
  right: 15px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  z-index: 1000;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  backdrop-filter: blur(10px);
}

.language-switch:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.tomato-counter {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
  min-height: 32px;
  overflow: hidden;
  gap: 5px;
}

.tomato-icon {
  font-size: 28px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  animation: popIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

@keyframes popIn {
  0% {
    transform: scale(0) rotate(-15deg);
    opacity: 0;
  }
  70% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 30px 20px;
  }
  
  .timer {
    font-size: 4.5rem;
  }
  
  .controls {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  button {
    flex: 1;
    min-width: 110px;
    padding: 12px 20px;
  }
  
  .settings {
    padding: 20px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .mode-indicator {
    font-size: 1rem;
    padding: 8px 16px;
  }
}`; 