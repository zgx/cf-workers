import { Language, Translations, TimerState } from '../types';
import { translations } from '../i18n/translations';
import { Timer } from './timer';
import { TomatoCounter } from './tomatoCounter';
import { NotificationManager } from './notifications';
import { StorageManager } from './storage';

export class PomodoroApp {
  private timer!: Timer;
  private tomatoCounter!: TomatoCounter;
  private currentLang: Language = 'en';
  private t: Translations;

  constructor() {
    this.initializeLanguage();
    this.t = translations[this.currentLang];
    this.initializeApp();
  }

  private initializeLanguage(): void {
    const savedLang = StorageManager.getLanguagePreference();
    const userLang = navigator.language || 'en';
    
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      this.currentLang = savedLang as Language;
    } else if (userLang.toLowerCase().indexOf('zh') !== -1) {
      this.currentLang = 'zh';
    }

    document.getElementById('htmlRoot')?.setAttribute('lang', this.currentLang === 'zh' ? 'zh-CN' : 'en');
  }

  private initializeApp(): void {
    this.timer = new Timer(
      this.updateTimerDisplay.bind(this),
      this.handleStateChange.bind(this),
      this.handlePhaseComplete.bind(this)
    );

    this.tomatoCounter = new TomatoCounter(this.updateTomatoDisplay.bind(this));

    this.setupEventListeners();
    this.restoreState();
    this.updateUILanguage();
    this.setupAutoSave();

    // 初始化后请求通知权限
    setTimeout(() => {
      NotificationManager.requestPermission(this.t);
    }, 3000);
  }

  private setupEventListeners(): void {
    document.getElementById('startBtn')?.addEventListener('click', this.handleStartClick.bind(this));
    document.getElementById('skipBtn')?.addEventListener('click', this.handleSkipClick.bind(this));
    document.getElementById('resetBtn')?.addEventListener('click', this.handleResetClick.bind(this));
    document.getElementById('languageSwitch')?.addEventListener('click', this.handleLanguageSwitch.bind(this));
    document.getElementById('settingsToggle')?.addEventListener('click', this.handleSettingsToggle.bind(this));

    const workTimeInput = document.getElementById('workTime') as HTMLInputElement;
    const breakTimeInput = document.getElementById('breakTime') as HTMLInputElement;

    workTimeInput?.addEventListener('change', () => {
      const state = this.timer.getState();
      if (!state.isRunning && state.isWorkTime) {
        this.timer.reset(Number(workTimeInput.value) * 60);
      }
      StorageManager.saveSettings(Number(workTimeInput.value), Number(breakTimeInput.value));
    });

    breakTimeInput?.addEventListener('change', () => {
      const state = this.timer.getState();
      if (!state.isRunning && !state.isWorkTime) {
        this.timer.reset(Number(breakTimeInput.value) * 60);
      }
      StorageManager.saveSettings(Number(workTimeInput.value), Number(breakTimeInput.value));
    });
  }

  private updateTimerDisplay(timeLeft: number, progress: number): void {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer')!.textContent = timeDisplay;
    document.getElementById('progress')!.style.width = `${progress}%`;

    const state = this.timer.getState();
    const statusText = state.isRunning ? 
      (state.isWorkTime ? this.t.working : this.t.resting) : 
      (timeLeft < state.totalTime ? this.t.paused : this.t.ready);
    
    document.getElementById('pageTitle')!.textContent = `${timeDisplay} - ${statusText} - ${this.t.title}`;
  }

  private handleStateChange(state: TimerState): void {
    const startBtn = document.getElementById('startBtn')!;
    const statusDisplay = document.getElementById('statusDisplay')!;
    const container = document.getElementById('container')!;
    const modeIndicator = document.getElementById('modeIndicator')!;

    startBtn.textContent = state.isRunning ? this.t.pause : 
      (state.timeLeft < state.totalTime ? this.t.resume : this.t.start);

    statusDisplay.textContent = state.isRunning ? 
      (state.isWorkTime ? this.t.working : this.t.resting) : 
      (state.timeLeft < state.totalTime ? this.t.paused : this.t.ready);

    if (state.isWorkTime) {
      modeIndicator.textContent = this.t.workMode;
      modeIndicator.className = 'mode-indicator work-mode';
      container.className = 'container work-theme';
      document.body.style.backgroundColor = '#fff9f8';
    } else {
      modeIndicator.textContent = this.t.breakMode;
      modeIndicator.className = 'mode-indicator break-mode';
      container.className = 'container break-theme';
      document.body.style.backgroundColor = '#f5f8ff';
    }
  }

  private handlePhaseComplete(): void {
    const state = this.timer.getState();
    if (state.isWorkTime) {
      this.tomatoCounter.increment();
    }

    const notificationTitle = this.t.notificationTitle;
    const notificationMessage = state.isWorkTime ? this.t.breakEndMessage : this.t.workEndMessage;
    NotificationManager.sendNotification(notificationTitle, notificationMessage);
  }

  private updateTomatoDisplay(count: number): void {
    const container = document.getElementById('tomatoCounter')!;
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const tomatoIcon = document.createElement('span');
      tomatoIcon.className = 'tomato-icon';
      tomatoIcon.textContent = '🍅';
      tomatoIcon.style.animationDelay = `${i * 0.1}s`;
      container.appendChild(tomatoIcon);
    }
  }

  private handleStartClick(): void {
    const state = this.timer.getState();
    if (state.isRunning) {
      this.timer.pause();
    } else {
      this.timer.start();
    }
  }

  private handleSkipClick(): void {
    const state = this.timer.getState();
    const settings = StorageManager.getSettings();
    this.timer.switchPhase(
      state.isWorkTime ? settings.breakTime * 60 : settings.workTime * 60,
      !state.isWorkTime
    );
  }

  private handleResetClick(): void {
    const settings = StorageManager.getSettings();
    this.timer.reset(settings.workTime * 60);
  }

  private handleLanguageSwitch(): void {
    this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
    this.t = translations[this.currentLang];
    document.getElementById('htmlRoot')?.setAttribute('lang', this.currentLang === 'zh' ? 'zh-CN' : 'en');
    StorageManager.saveLanguagePreference(this.currentLang);
    this.updateUILanguage();
  }

  private handleSettingsToggle(): void {
    const settings = document.getElementById('settings')!;
    settings.classList.toggle('expanded');

    if (settings.classList.contains('expanded')) {
      const notificationPermissionGranted = NotificationManager.checkPermission();
      
      if (!notificationPermissionGranted) {
        const existingStatus = document.querySelector('.notification-status');
        if (existingStatus) {
          existingStatus.remove();
        }

        const notificationStatus = document.createElement('div');
        notificationStatus.className = 'notification-status';
        notificationStatus.style.marginBottom = '20px';

        const paragraph = document.createElement('p');
        paragraph.style.color = '#e74c3c';
        paragraph.style.marginTop = '15px';
        paragraph.style.fontSize = '0.9rem';
        paragraph.style.marginBottom = '15px';
        paragraph.textContent = this.t.notificationPermission;

        const enableButton = document.createElement('button');
        enableButton.id = 'enableNotifications';
        enableButton.style.cssText = `
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          display: block;
          width: 100%;
        `;
        enableButton.textContent = this.t.enableNotification;

        enableButton.addEventListener('click', () => {
          NotificationManager.requestPermission(this.t);
          notificationStatus.remove();
        });

        paragraph.appendChild(enableButton);
        notificationStatus.appendChild(paragraph);
        settings.appendChild(notificationStatus);
      }
    }
  }

  private updateUILanguage(): void {
    document.getElementById('pageTitle')!.textContent = this.t.title;
    document.getElementById('heading')!.textContent = this.t.heading;
    document.getElementById('settingsHeading')!.textContent = this.t.settings;
    document.getElementById('workTimeLabel')!.textContent = this.t.workTime;
    document.getElementById('breakTimeLabel')!.textContent = this.t.breakTime;
    document.getElementById('settingsToggle')!.setAttribute('aria-label', this.t.settings);
    document.getElementById('skipBtn')!.textContent = this.t.skip;
    document.getElementById('resetBtn')!.textContent = this.t.reset;
    document.getElementById('languageSwitch')!.textContent = this.currentLang === 'zh' ? '🌐 English' : '🌐 中文';

    const state = this.timer.getState();
    this.handleStateChange(state);
  }

  private restoreState(): void {
    const savedState = StorageManager.getTimerState();
    if (savedState) {
      this.timer.restoreState(savedState);
    }

    const settings = StorageManager.getSettings();
    const workTimeInput = document.getElementById('workTime') as HTMLInputElement;
    const breakTimeInput = document.getElementById('breakTime') as HTMLInputElement;
    
    if (workTimeInput && breakTimeInput) {
      workTimeInput.value = settings.workTime.toString();
      breakTimeInput.value = settings.breakTime.toString();
    }
  }

  private setupAutoSave(): void {
    setInterval(() => {
      const state = this.timer.getState();
      if (state.isRunning) {
        StorageManager.saveTimerState(state);
      }
    }, 5000);
  }
} 