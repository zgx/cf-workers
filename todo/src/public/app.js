// 全局变量
let todos = [];
let currentFilter = 'all';
let pomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4
};
let currentSession = null;
let timer = null;
let timerRunning = false;
let remainingTime = 0;
let completedPomodoros = 0;
let totalFocusTime = 0;
let selectedTodoId = null;
let currentUser = null;
let currentMode = 'focus'; // 'focus' 或 'break'
let isLocalStorage = true; // 默认使用本地存储

// 本地存储键名
const LOCAL_TODOS_KEY = 'pomodoro_todos';
const LOCAL_SETTINGS_KEY = 'pomodoro_settings';
const LOCAL_STATS_KEY = 'pomodoro_stats';
const LOCAL_SESSION_KEY = 'pomodoro_current_session';

// DOM元素
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const timerStatus = document.getElementById('timer-status');
const startBtn = document.getElementById('start-btn');
const skipBtn = document.getElementById('skip-btn');
const resetBtn = document.getElementById('reset-btn');
const currentTaskDisplay = document.getElementById('current-task-display');
const clearTaskBtn = document.getElementById('clear-task-btn');
const completedPomodorosDisplay = document.getElementById('completed-pomodoros');
const totalFocusTimeDisplay = document.getElementById('total-focus-time');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');
const workDurationInput = document.getElementById('work-duration');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');
const longBreakIntervalInput = document.getElementById('long-break-interval');
const pomodoroSection = document.getElementById('pomodoro-section');
const modeIcon = document.getElementById('mode-icon');

// 用户相关DOM元素
const anonymousInfo = document.getElementById('anonymous-info');
const loggedInInfo = document.getElementById('logged-in-info');
const usernameDisplay = document.getElementById('username-display');
const showLoginBtn = document.getElementById('show-login-btn');
const showRegisterBtn = document.getElementById('show-register-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const syncModal = document.getElementById('sync-modal');
const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');
const closeSyncBtn = document.getElementById('close-sync');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const syncBtn = document.getElementById('sync-btn');
const discardLocalBtn = document.getElementById('discard-local-btn');
const cancelLoginBtn = document.getElementById('cancel-login');
const cancelRegisterBtn = document.getElementById('cancel-register');
const cancelSyncBtn = document.getElementById('cancel-sync');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const registerConfirmPassword = document.getElementById('register-confirm-password');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// 初始化
async function init() {
  // 设置默认值
  currentMode = 'focus';
  
  // 立即检查通知权限
  checkNotificationPermission();
  
  await checkCurrentUser();
  
  // 如果是匿名用户，从本地存储加载数据
  if (!currentUser) {
    isLocalStorage = true;
    loadFromLocalStorage();
  } else {
    isLocalStorage = false;
    await loadSettings();
    await loadTodos();
    await loadCurrentSession();
  }
  
  setupEventListeners();
  
  // 如果没有选择任务，显示"专注模式"
  if (!selectedTodoId) {
    currentTaskDisplay.textContent = '专注模式';
  }
  
  // 如果没有正在进行的会话，设置初始时间
  if (!currentSession) {
    remainingTime = pomodoroSettings.workDuration * 60;
    console.log('初始化时间:', remainingTime, '秒, 工作时长:', pomodoroSettings.workDuration, '分钟');
  }
  
  // 确保界面正确显示
  updateTimerDisplay();
  updateModeDisplay();
}

// 检查通知权限并提示用户授权
function checkNotificationPermission() {
  // 检查浏览器是否支持通知
  if (!("Notification" in window)) {
    console.log("此浏览器不支持系统通知");
    return;
  }
  
  // 如果已经授权，不需要做任何事情
  if (Notification.permission === "granted") {
    console.log("已获得通知权限");
    return;
  }
  
  // 如果权限状态是默认的（未设置），显示提示并请求权限
  if (Notification.permission === "default") {
    // 创建一个提示框
    const permissionPrompt = document.createElement('div');
    permissionPrompt.className = 'notification-prompt';
    permissionPrompt.innerHTML = `
      <div class="notification-prompt-content">
        <p>为了在番茄钟结束时通知您，我们需要获取通知权限。</p>
        <button id="grant-notification-btn">允许通知</button>
        <button id="dismiss-notification-btn">稍后再说</button>
      </div>
    `;
    
    document.body.appendChild(permissionPrompt);
    
    // 添加按钮事件
    document.getElementById('grant-notification-btn').addEventListener('click', () => {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("用户已授予通知权限");
        }
        permissionPrompt.remove();
      });
    });
    
    document.getElementById('dismiss-notification-btn').addEventListener('click', () => {
      permissionPrompt.remove();
    });
  }
  
  // 如果权限被拒绝，显示一个提示，告诉用户如何启用通知
  if (Notification.permission === "denied") {
    console.log("用户已拒绝通知权限");
    // 可以添加一个小提示，告诉用户如何在浏览器设置中启用通知
    const permissionDeniedTip = document.createElement('div');
    permissionDeniedTip.className = 'notification-tip';
    permissionDeniedTip.innerHTML = `
      <div class="notification-tip-content">
        <p>您已禁用通知权限。要在番茄钟结束时收到通知，请在浏览器设置中启用通知权限。</p>
        <button id="close-tip-btn">知道了</button>
      </div>
    `;
    
    document.body.appendChild(permissionDeniedTip);
    
    document.getElementById('close-tip-btn').addEventListener('click', () => {
      permissionDeniedTip.remove();
    });
    
    // 5秒后自动关闭提示
    setTimeout(() => {
      if (document.body.contains(permissionDeniedTip)) {
        permissionDeniedTip.remove();
      }
    }, 5000);
  }
}

// 从本地存储加载数据
function loadFromLocalStorage() {
  // 加载设置
  const savedSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      console.log('从本地存储加载设置:', parsedSettings);
      
      // 确保所有必要的属性都存在
      pomodoroSettings = {
        workDuration: parseInt(parsedSettings.workDuration) || 25,
        shortBreakDuration: parseInt(parsedSettings.shortBreakDuration) || 5,
        longBreakDuration: parseInt(parsedSettings.longBreakDuration) || 15,
        longBreakInterval: parseInt(parsedSettings.longBreakInterval) || 4
      };
      
      updateSettingsInputs();
    } catch (error) {
      console.error('解析设置数据失败:', error);
      // 使用默认设置
      pomodoroSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4
      };
    }
  }
  
  // 加载待办事项
  const savedTodos = localStorage.getItem(LOCAL_TODOS_KEY);
  if (savedTodos) {
    try {
      todos = JSON.parse(savedTodos);
      renderTodos();
    } catch (error) {
      console.error('解析待办事项数据失败:', error);
      todos = [];
    }
  }
  
  // 加载统计信息
  const savedStats = localStorage.getItem(LOCAL_STATS_KEY);
  if (savedStats) {
    try {
      const stats = JSON.parse(savedStats);
      completedPomodoros = stats.completedPomodoros || 0;
      totalFocusTime = stats.totalFocusTime || 0;
      updateStats();
    } catch (error) {
      console.error('解析统计信息失败:', error);
      completedPomodoros = 0;
      totalFocusTime = 0;
    }
  }
  
  // 加载当前会话
  const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
  if (savedSession) {
    try {
      currentSession = JSON.parse(savedSession);
      selectedTodoId = currentSession.todoId;
      
      // 找到对应的待办事项
      if (selectedTodoId && selectedTodoId.trim() !== '') {
        const selectedTodo = todos.find(todo => todo.id === selectedTodoId);
        if (selectedTodo) {
          currentTaskDisplay.textContent = selectedTodo.title;
        } else {
          currentTaskDisplay.textContent = '专注模式';
        }
      } else {
        // 如果没有选择任务，显示"专注模式"
        currentTaskDisplay.textContent = '专注模式';
      }
      
      // 计算剩余时间
      const elapsedTime = Math.floor((Date.now() - currentSession.startTime) / 1000);
      const totalSeconds = currentSession.duration * 60;
      remainingTime = Math.max(0, totalSeconds - elapsedTime);
      
      // 根据会话持续时间判断当前模式
      if (currentSession.duration === pomodoroSettings.workDuration) {
        currentMode = 'focus';
      } else {
        currentMode = 'break';
      }
      
      // 更新定时器显示
      updateTimerDisplay();
      updateModeDisplay();
      
      // 如果会话仍在进行中且剩余时间大于0，启动定时器
      if (!currentSession.completed && remainingTime > 0) {
        startTimer();
      } else {
        // 如果会话已完成或剩余时间为0，清除会话
        localStorage.removeItem(LOCAL_SESSION_KEY);
        currentSession = null;
      }
    } catch (error) {
      console.error('解析会话数据失败:', error);
      currentSession = null;
    }
  }
}

// 保存到本地存储
function saveToLocalStorage() {
  if (!isLocalStorage) return;
  
  try {
    // 保存待办事项
    localStorage.setItem(LOCAL_TODOS_KEY, JSON.stringify(todos));
    
    // 保存设置
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(pomodoroSettings));
    console.log('保存设置到本地存储:', pomodoroSettings);
    
    // 保存统计信息
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify({
      completedPomodoros,
      totalFocusTime
    }));
    
    // 保存当前会话
    if (currentSession) {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(currentSession));
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
  } catch (error) {
    console.error('保存到本地存储失败:', error);
  }
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 检查当前用户
async function checkCurrentUser() {
  try {
    const response = await fetch('/api/users/current');
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        currentUser = data.data;
        updateUserUI();
      }
    }
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
  }
}

// 更新用户界面
function updateUserUI() {
  if (currentUser) {
    anonymousInfo.style.display = 'none';
    loggedInInfo.style.display = 'flex';
    usernameDisplay.textContent = currentUser.username;
  } else {
    anonymousInfo.style.display = 'flex';
    loggedInInfo.style.display = 'none';
  }
}

// 加载设置
async function loadSettings() {
  try {
    const response = await fetch('/api/pomodoro/settings');
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        pomodoroSettings = data.data;
        updateSettingsInputs();
      }
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
}

// 更新设置输入框
function updateSettingsInputs() {
  workDurationInput.value = pomodoroSettings.workDuration;
  shortBreakInput.value = pomodoroSettings.shortBreakDuration;
  longBreakInput.value = pomodoroSettings.longBreakDuration;
  longBreakIntervalInput.value = pomodoroSettings.longBreakInterval;
}

// 加载待办事项
async function loadTodos() {
  try {
    const response = await fetch('/api/todos');
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        todos = data.data;
        renderTodos();
      }
    }
  } catch (error) {
    console.error('加载待办事项失败:', error);
  }
}

// 加载当前番茄钟会话
async function loadCurrentSession() {
  try {
    const response = await fetch('/api/pomodoro/sessions/current');
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        currentSession = data.data;
        selectedTodoId = currentSession.todoId;
        
        // 找到对应的待办事项
        if (selectedTodoId && selectedTodoId.trim() !== '') {
          const selectedTodo = todos.find(todo => todo.id === selectedTodoId);
          if (selectedTodo) {
            currentTaskDisplay.textContent = selectedTodo.title;
          } else {
            currentTaskDisplay.textContent = '专注模式';
          }
        } else {
          // 如果没有选择任务，显示"专注模式"
          currentTaskDisplay.textContent = '专注模式';
        }
        
        // 计算剩余时间
        const elapsedTime = Math.floor((Date.now() - currentSession.startTime) / 1000);
        const totalSeconds = currentSession.duration * 60;
        remainingTime = Math.max(0, totalSeconds - elapsedTime);
        
        // 根据会话持续时间判断当前模式
        // 如果持续时间等于工作时长，则为专注模式
        // 否则为休息模式
        if (currentSession.duration === pomodoroSettings.workDuration) {
          currentMode = 'focus';
        } else {
          currentMode = 'break';
        }
        
        // 更新定时器显示
        updateTimerDisplay();
        updateModeDisplay();
        
        // 如果会话仍在进行中，启动定时器
        if (!currentSession.completed && remainingTime > 0) {
          startTimer();
        }
      } else {
        // 如果没有正在进行的会话，初始化为专注模式
        currentMode = 'focus';
        remainingTime = pomodoroSettings.workDuration * 60;
        updateTimerDisplay();
        updateModeDisplay();
        
        // 如果没有选择任务，显示"专注模式"
        if (!selectedTodoId) {
          currentTaskDisplay.textContent = '专注模式';
        }
      }
    }
  } catch (error) {
    console.error('加载当前番茄钟会话失败:', error);
    
    // 出错时也初始化为专注模式
    currentMode = 'focus';
    remainingTime = pomodoroSettings.workDuration * 60;
    updateTimerDisplay();
    updateModeDisplay();
  }
}

// 设置事件监听器
function setupEventListeners() {
  // 添加待办事项
  addTodoBtn.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTodo();
  });
  
  // 过滤器
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTodos();
    });
  });
  
  // 番茄钟控制
  startBtn.addEventListener('click', startPomodoro);
  skipBtn.addEventListener('click', skipTimer);
  resetBtn.addEventListener('click', resetTimer);
  clearTaskBtn.addEventListener('click', clearSelectedTask);
  
  // 设置
  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });
  
  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
  
  cancelSettingsBtn.addEventListener('click', () => {
    updateSettingsInputs();
    settingsModal.style.display = 'none';
  });
  
  saveSettingsBtn.addEventListener('click', saveSettings);
  
  // 用户认证
  showLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    loginError.textContent = '';
  });
  
  showRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
    registerError.textContent = '';
  });
  
  closeLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });
  
  closeRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });
  
  cancelLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });
  
  cancelRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });
  
  loginBtn.addEventListener('click', login);
  registerBtn.addEventListener('click', register);
  logoutBtn.addEventListener('click', logout);
  
  // 点击模态框外部关闭
  window.addEventListener('click', e => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    } else if (e.target === loginModal) {
      loginModal.style.display = 'none';
    } else if (e.target === registerModal) {
      registerModal.style.display = 'none';
    } else if (e.target === syncModal) {
      syncModal.style.display = 'none';
    }
  });
}

// 添加待办事项
async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;
  
  if (isLocalStorage) {
    // 本地存储模式
    const newTodo = {
      id: generateId(),
      title,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    todos.unshift(newTodo);
    renderTodos();
    todoInput.value = '';
    saveToLocalStorage();
  } else {
    // 服务器模式
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          todos.unshift(data.data);
          renderTodos();
          todoInput.value = '';
        }
      }
    } catch (error) {
      console.error('添加待办事项失败:', error);
    }
  }
}

// 切换待办事项完成状态
async function toggleTodoComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  
  if (isLocalStorage) {
    // 本地存储模式
    todo.completed = !todo.completed;
    todo.updatedAt = Date.now();
    renderTodos();
    saveToLocalStorage();
  } else {
    // 服务器模式
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !todo.completed })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const index = todos.findIndex(t => t.id === id);
          todos[index] = data.data;
          renderTodos();
        }
      }
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  }
}

// 删除待办事项
async function deleteTodo(id) {
  if (isLocalStorage) {
    // 本地存储模式
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    
    // 如果删除的是当前选中的待办事项，重置选择
    if (selectedTodoId === id) {
      selectedTodoId = null;
      currentTaskDisplay.textContent = '专注模式';
      
      // 如果有正在进行的会话，需要重置
      if (currentSession && currentSession.todoId === id) {
        resetTimer();
      }
    }
    
    saveToLocalStorage();
  } else {
    // 服务器模式
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          todos = todos.filter(t => t.id !== id);
          renderTodos();
          
          // 如果删除的是当前选中的待办事项，重置选择
          if (selectedTodoId === id) {
            selectedTodoId = null;
            currentTaskDisplay.textContent = '专注模式';
            
            // 如果有正在进行的会话，需要重置
            if (currentSession && currentSession.todoId === id) {
              resetTimer();
            }
          }
        }
      }
    } catch (error) {
      console.error('删除待办事项失败:', error);
    }
  }
}

// 渲染待办事项列表
function renderTodos() {
  todoList.innerHTML = '';
  
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });
  
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<li class="todo-item">没有待办事项</li>';
    return;
  }
  
  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodoComplete(todo.id));
    
    const text = document.createElement('span');
    text.className = `todo-text ${todo.completed ? 'completed' : ''}`;
    text.textContent = todo.title;
    
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    
    const startBtn = document.createElement('button');
    startBtn.className = 'start-pomodoro-btn';
    startBtn.innerHTML = '&#9658;';
    startBtn.title = '开始番茄钟';
    startBtn.addEventListener('click', () => selectTodoForPomodoro(todo));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-todo-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = '删除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    actions.appendChild(startBtn);
    actions.appendChild(deleteBtn);
    
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(actions);
    
    todoList.appendChild(li);
  });
}

// 选择待办事项进行番茄钟
function selectTodoForPomodoro(todo) {
  selectedTodoId = todo.id;
  currentTaskDisplay.textContent = todo.title;
  
  // 如果定时器正在运行，重置它
  if (timerRunning) {
    resetTimer();
  }
  
  // 设置为专注模式
  currentMode = 'focus';
  
  // 设置初始时间
  remainingTime = pomodoroSettings.workDuration * 60;
  console.log('选择任务后设置时间:', remainingTime, '秒, 工作时长:', pomodoroSettings.workDuration, '分钟');
  
  updateTimerDisplay();
  updateModeDisplay();
}

// 清除当前选择的任务
function clearSelectedTask() {
  selectedTodoId = null;
  currentTaskDisplay.textContent = '专注模式';
  
  // 如果定时器正在运行，只更新任务显示，不重置定时器
  if (timerRunning) {
    console.log('清除任务但保持番茄钟运行');
    return;
  }
  
  // 设置为专注模式
  currentMode = 'focus';
  
  // 设置初始时间
  remainingTime = pomodoroSettings.workDuration * 60;
  console.log('清除任务后设置时间:', remainingTime, '秒, 工作时长:', pomodoroSettings.workDuration, '分钟');
  
  updateTimerDisplay();
  updateModeDisplay();
}

// 开始番茄钟
async function startPomodoro() {
  // 如果没有选择任务，确保显示"专注模式"
  if (!selectedTodoId) {
    currentTaskDisplay.textContent = '专注模式';
  }
  
  if (!currentSession) {
    if (isLocalStorage) {
      // 本地存储模式
      // 根据当前模式确定会话持续时间
      let duration;
      if (currentMode === 'focus') {
        duration = pomodoroSettings.workDuration;
      } else {
        // 根据完成的番茄钟数决定是短休息还是长休息
        const isLongBreak = completedPomodoros % pomodoroSettings.longBreakInterval === 0;
        duration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
      }
      
      // 创建新会话
      currentSession = {
        id: generateId(),
        todoId: selectedTodoId || '',
        startTime: Date.now(),
        endTime: null,
        duration: duration,
        completed: false
      };
      
      remainingTime = duration * 60;
      updateTimerDisplay();
      saveToLocalStorage();
      startTimer();
    } else {
      // 服务器模式
      try {
        // 保持当前模式（专注或休息）
        updateModeDisplay();
        
        // 准备请求数据
        const requestData = {
          mode: currentMode // 添加当前模式信息
        };
        
        // 只有当selectedTodoId有值时才添加到请求中
        if (selectedTodoId) {
          requestData.todoId = selectedTodoId;
        }
        
        // 根据当前模式确定会话持续时间
        let duration;
        if (currentMode === 'focus') {
          duration = pomodoroSettings.workDuration;
        } else {
          // 根据完成的番茄钟数决定是短休息还是长休息
          const isLongBreak = completedPomodoros % pomodoroSettings.longBreakInterval === 0;
          duration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
        }
        
        // 添加持续时间到请求数据
        requestData.duration = duration;
        
        const response = await fetch('/api/pomodoro/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            currentSession = data.data;
            remainingTime = currentSession.duration * 60;
            updateTimerDisplay();
            startTimer();
          } else {
            console.error('开始番茄钟失败:', data.message);
            alert(data.message || '开始番茄钟失败');
          }
        } else {
          console.error('开始番茄钟请求失败');
          alert('开始番茄钟失败，请稍后再试');
        }
      } catch (error) {
        console.error('开始番茄钟失败:', error);
        alert('开始番茄钟失败，请稍后再试');
      }
    }
  } else {
    startTimer();
  }
}

// 更新模式显示
function updateModeDisplay() {
  // 移除所有模式类
  pomodoroSection.classList.remove('focus-mode', 'break-mode');
  timerStatus.classList.remove('focus', 'break');
  
  if (currentMode === 'focus') {
    pomodoroSection.classList.add('focus-mode');
    timerStatus.classList.add('focus');
    modeIcon.textContent = '🎯'; // 专注模式图标
    timerStatus.textContent = timerRunning ? '专注中...' : '准备专注';
  } else {
    pomodoroSection.classList.add('break-mode');
    timerStatus.classList.add('break');
    modeIcon.textContent = '☕'; // 休息模式图标
    timerStatus.textContent = timerRunning ? '休息中...' : '准备休息';
  }
}

// 开始定时器
function startTimer() {
  if (timerRunning) return;
  
  timerRunning = true;
  startBtn.disabled = true;
  skipBtn.disabled = false;
  resetBtn.disabled = false;
  
  // 更新状态文本和样式
  updateModeDisplay();
  
  // 清除之前的定时器（如果有）
  if (timer) {
    clearInterval(timer);
  }
  
  // 设置新的定时器
  timer = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();
    
    if (remainingTime <= 0) {
      completePomodoro();
    }
  }, 1000);
}

// 跳过当前番茄钟
function skipTimer() {
  if (!timerRunning) return;
  
  // 清除当前定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  // 保存当前模式，用于日志记录
  const skippedMode = currentMode;
  console.log(`已跳过${skippedMode === 'focus' ? '专注' : '休息'}时间`);
  
  // 直接完成当前番茄钟，进入下一阶段
  completePomodoro(true);
}

// 重置定时器
async function resetTimer() {
  // 清除定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  timerRunning = false;
  
  if (isLocalStorage) {
    // 本地存储模式
    if (currentSession) {
      currentSession = null;
      // 确保更新本地存储
      saveToLocalStorage();
    }
  } else {
    // 服务器模式
    // 如果有正在进行的会话，取消它
    if (currentSession) {
      try {
        // 调用API取消当前会话
        const response = await fetch(`/api/pomodoro/sessions/${currentSession.id}/cancel`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          // 重置当前会话
          currentSession = null;
        }
      } catch (error) {
        console.error('取消番茄钟会话失败:', error);
      }
    }
  }
  
  // 根据当前模式设置时间
  if (currentMode === 'focus') {
    remainingTime = pomodoroSettings.workDuration * 60;
    console.log('重置为专注模式，时长:', pomodoroSettings.workDuration, '分钟');
  } else {
    // 根据完成的番茄钟数决定是短休息还是长休息
    const isLongBreak = completedPomodoros % pomodoroSettings.longBreakInterval === 0;
    const breakDuration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
    remainingTime = breakDuration * 60;
    console.log('重置为休息模式，时长:', breakDuration, '分钟');
  }
  
  updateTimerDisplay();
  startBtn.disabled = false;
  skipBtn.disabled = true;
  resetBtn.disabled = true;
  timerStatus.textContent = currentMode === 'focus' ? '准备专注' : '准备休息';
  updateModeDisplay();
}

// 完成番茄钟
async function completePomodoro(skipNotification = false) {
  // 清除定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  timerRunning = false;
  
  if (isLocalStorage) {
    // 本地存储模式
    if (currentSession) {
      // 更新统计信息
      completedPomodoros++;
      totalFocusTime += currentSession.duration;
      updateStats();
      
      // 播放提示音
      playNotificationSound();
      
      // 切换模式
      if (currentMode === 'focus') {
        // 从专注模式切换到休息模式
        currentMode = 'break';
        
        // 根据完成的番茄钟数决定是短休息还是长休息
        const isLongBreak = completedPomodoros % pomodoroSettings.longBreakInterval === 0;
        const breakDuration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
        
        remainingTime = breakDuration * 60;
        
        // 显示系统通知，除非是跳过操作
        if (!skipNotification) {
          showNotification(
            '专注完成！', 
            `现在开始${isLongBreak ? '长' : '短'}休息 (${breakDuration}分钟)`
          );
        }
      } else {
        // 从休息模式切换到专注模式
        currentMode = 'focus';
        remainingTime = pomodoroSettings.workDuration * 60;
        
        // 显示系统通知，除非是跳过操作
        if (!skipNotification) {
          showNotification('休息结束！', '准备开始新的专注');
        }
      }
      
      // 重置当前会话
      currentSession = null;
      
      // 更新UI
      updateTimerDisplay();
      updateModeDisplay();
      
      // 重置按钮状态
      startBtn.disabled = false;
      skipBtn.disabled = true;
      resetBtn.disabled = true;
      
      // 保存到本地存储
      saveToLocalStorage();
    }
  } else {
    // 服务器模式
    if (currentSession) {
      try {
        const response = await fetch(`/api/pomodoro/sessions/${currentSession.id}/complete`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // 更新统计信息
            completedPomodoros++;
            totalFocusTime += currentSession.duration;
            updateStats();
            
            // 播放提示音
            playNotificationSound();
            
            // 切换模式
            if (currentMode === 'focus') {
              // 从专注模式切换到休息模式
              currentMode = 'break';
              
              // 根据完成的番茄钟数决定是短休息还是长休息
              const isLongBreak = completedPomodoros % pomodoroSettings.longBreakInterval === 0;
              const breakDuration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
              
              remainingTime = breakDuration * 60;
              
              // 显示系统通知，除非是跳过操作
              if (!skipNotification) {
                showNotification(
                  '专注完成！', 
                  `现在开始${isLongBreak ? '长' : '短'}休息 (${breakDuration}分钟)`
                );
              }
            } else {
              // 从休息模式切换到专注模式
              currentMode = 'focus';
              remainingTime = pomodoroSettings.workDuration * 60;
              
              // 显示系统通知，除非是跳过操作
              if (!skipNotification) {
                showNotification('休息结束！', '准备开始新的专注');
              }
            }
            
            // 重置当前会话
            currentSession = null;
            
            // 更新UI
            updateTimerDisplay();
            updateModeDisplay();
            
            // 重置按钮状态
            startBtn.disabled = false;
            skipBtn.disabled = true;
            resetBtn.disabled = true;
          }
        }
      } catch (error) {
        console.error('完成番茄钟失败:', error);
        
        // 出错时也要重置状态
        currentSession = null;
        timerRunning = false;
        startBtn.disabled = false;
        skipBtn.disabled = true;
        resetBtn.disabled = true;
        updateModeDisplay();
      }
    }
  }
  
  // 确保当前任务显示正确
  if (!selectedTodoId) {
    currentTaskDisplay.textContent = '专注模式';
  }
}

// 更新定时器显示
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  
  minutesDisplay.textContent = minutes.toString().padStart(2, '0');
  secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// 更新统计信息
function updateStats() {
  completedPomodorosDisplay.textContent = completedPomodoros;
  totalFocusTimeDisplay.textContent = `${totalFocusTime}分钟`;
}

// 播放提示音
function playNotificationSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3');
  audio.play();
}

// 显示系统通知
function showNotification(title, body) {
  // 检查浏览器是否支持通知
  if (!("Notification" in window)) {
    alert(body); // 如果不支持，回退到alert
    return;
  }
  
  // 检查通知权限
  if (Notification.permission === "granted") {
    // 如果已授权，直接显示通知
    const notification = new Notification(title, {
      body: body,
      icon: '/favicon.ico' // 可以替换为应用图标
    });
    
    // 点击通知时聚焦到应用窗口
    notification.onclick = function() {
      window.focus();
      this.close();
    };
  } else if (Notification.permission !== "denied") {
    // 如果未拒绝也未授权，请求权限
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showNotification(title, body); // 递归调用
      } else {
        alert(body); // 如果拒绝授权，回退到alert
      }
    });
  } else {
    // 如果已拒绝授权，回退到alert
    alert(body);
  }
}

// 保存设置
async function saveSettings() {
  const workDuration = parseInt(workDurationInput.value);
  const shortBreakDuration = parseInt(shortBreakInput.value);
  const longBreakDuration = parseInt(longBreakInput.value);
  const longBreakInterval = parseInt(longBreakIntervalInput.value);
  
  // 验证输入
  if (isNaN(workDuration) || isNaN(shortBreakDuration) || isNaN(longBreakDuration) || isNaN(longBreakInterval)) {
    alert('请输入有效的数字');
    return;
  }
  
  if (isLocalStorage) {
    // 本地存储模式
    pomodoroSettings = {
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakInterval
    };
    
    // 如果没有正在进行的番茄钟，更新剩余时间
    if (!currentSession) {
      remainingTime = pomodoroSettings.workDuration * 60;
      updateTimerDisplay();
    }
    
    // 确保保存到本地存储
    saveToLocalStorage();
    
    // 打印日志以便调试
    console.log('保存设置到本地存储:', pomodoroSettings);
    
    settingsModal.style.display = 'none';
  } else {
    // 服务器模式
    try {
      const response = await fetch('/api/pomodoro/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workDuration,
          shortBreakDuration,
          longBreakDuration,
          longBreakInterval
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          pomodoroSettings = data.data;
          
          // 如果没有正在进行的番茄钟，更新剩余时间
          if (!currentSession) {
            remainingTime = pomodoroSettings.workDuration * 60;
            updateTimerDisplay();
          }
          
          settingsModal.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }
}

// 用户登录
async function login() {
  const username = loginUsername.value.trim();
  const password = loginPassword.value;
  
  if (!username || !password) {
    loginError.textContent = '用户名和密码不能为空';
    return;
  }
  
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      currentUser = data.data;
      updateUserUI();
      loginModal.style.display = 'none';
      loginUsername.value = '';
      loginPassword.value = '';
      
      // 重新加载数据
      await loadTodos();
      await loadSettings();
      await loadCurrentSession();
    } else {
      loginError.textContent = data.message || '登录失败';
    }
  } catch (error) {
    console.error('登录失败:', error);
    loginError.textContent = '登录失败，请稍后再试';
  }
}

// 用户注册
async function register() {
  const username = registerUsername.value.trim();
  const password = registerPassword.value;
  const confirmPassword = registerConfirmPassword.value;
  
  if (!username || !password || !confirmPassword) {
    registerError.textContent = '所有字段都必须填写';
    return;
  }
  
  if (username.length < 3) {
    registerError.textContent = '用户名至少需要3个字符';
    return;
  }
  
  if (password.length < 6) {
    registerError.textContent = '密码至少需要6个字符';
    return;
  }
  
  if (password !== confirmPassword) {
    registerError.textContent = '两次输入的密码不一致';
    return;
  }
  
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      currentUser = data.data;
      updateUserUI();
      registerModal.style.display = 'none';
      registerUsername.value = '';
      registerPassword.value = '';
      registerConfirmPassword.value = '';
      
      // 重新加载数据
      await loadTodos();
      await loadSettings();
      await loadCurrentSession();
    } else {
      registerError.textContent = data.message || '注册失败';
    }
  } catch (error) {
    console.error('注册失败:', error);
    registerError.textContent = '注册失败，请稍后再试';
  }
}

// 用户登出
async function logout() {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST'
    });
    
    if (response.ok) {
      currentUser = null;
      updateUserUI();
      
      // 重新加载数据
      await loadTodos();
      await loadSettings();
      await loadCurrentSession();
    }
  } catch (error) {
    console.error('登出失败:', error);
  }
}

// 初始化应用
init(); 