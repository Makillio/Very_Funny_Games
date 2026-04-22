<template>
  <!-- ============================================ -->
  <!-- БЛОК РЕГИСТРАЦИИ (показывается до входа)      -->
  <!-- ============================================ -->
  <div v-if="!registered" class="register-terminal">
    <h2>VAULT-TEC REGISTRATION TERMINAL</h2>
    
    <div class="register-box">
      <!-- БЛОК АВАТАРА -->
      <div class="avatar-section">
        <div v-if="!avatarUrl" class="avatar-placeholder">
          <div class="circle" :style="{ backgroundColor: avatarColor }"></div>
          <button class="upload-btn" @click="triggerUpload">ЗАГРУЗИТЬ АВАТАР</button>
        </div>
        
        <div v-else class="avatar-preview">
          <img :src="avatarUrl" alt="avatar">
          <button class="change-btn" @click="changeAvatar">СМЕНИТЬ ФОТО</button>
        </div>
        
        <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileUpload">
      </div>

      <!-- БЛОК ВВОДА ИМЕНИ -->
      <div class="name-section">
        <label>ИМЯ ЖИТЕЛЯ:</label>
        <input v-model="userName" type="text" placeholder="ВВЕДИТЕ ИМЯ" @keypress.enter="register">
      </div>

      <!-- КНОПКА ВХОДА -->
      <button class="register-btn" @click="register" :disabled="!userName">
        [ ВОЙТИ В УБЕЖИЩЕ ]
      </button>
    </div>

    <div class="footer">
      <div class="left">VAULT-TEC INDUSTRIES</div>
      <div class="right">ЖДЁМ ВАС <span class="blink"></span></div>
    </div>
  </div>

  <!-- ============================================ -->
  <!-- ГЛАВНЫЙ ЭКРАН ДАШБОРДА (после регистрации)    -->
  <!-- ============================================ -->
  <div v-else class="dashboard">
    <!-- ВЕРХНЯЯ ПАНЕЛЬ (ШАПКА) -->
    <div class="header">
      <div class="user-info">
        <div class="avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="avatar">
          <div v-else class="default-avatar"></div>
        </div>
        <div class="user-name">{{ userName }}</div>
      </div>
      <div class="system-title">VAULT-TEC TERMINAL v6.2</div>
      <button class="logout-btn" @click="logout">[ ВЫХОД ]</button>
    </div>

    <!-- НАВИГАЦИОННЫЕ ВКЛАДКИ -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: currentTab === tab.id }]"
        @click="switchTab(tab.id)">
        {{ tab.name }}
      </button>
    </div>

    <!-- ============================================ -->
    <!-- БЛОК 1: БЮДЖЕТ -->
    <!-- ============================================ -->
    <div v-if="currentTab === 'budget'" class="fullscreen-content">
      <div class="budget-full">
        <h3>СИСТЕМА БЮДЖЕТА</h3>
        
        <div class="balance-full">
          <div class="balance-label">БАЛАНС:</div>
          <div class="balance-amount" :class="getBalanceClass()">{{ getBalance() }} ₽</div>
        </div>

        <div class="add-form-full">
          <input v-model.trim="budgetTitle" placeholder="НАЗВАНИЕ" @keypress.enter="addTransaction">
          <input v-model.number="budgetAmount" type="number" placeholder="СУММА">
          <button @click="addTransaction">ДОБАВИТЬ</button>
        </div>

        <div class="history-full">
          <div class="history-header">
            <span>ИСТОРИЯ</span>
            <span>{{ history.length }} ОПЕРАЦИЙ</span>
          </div>
          <div v-if="history.length === 0" class="empty-full">НЕТ ОПЕРАЦИЙ</div>
          <div v-for="item in history" :key="item.id" class="transaction-full" :class="item.amount > 0 ? 'income' : 'expense'">
            <div class="transaction-text">{{ item.text }}</div>
            <div class="transaction-amount">{{ item.amount > 0 ? '+' : '' }}{{ item.amount }} ₽</div>
            <button class="delete-btn" @click="deleteTransaction(item.id)">✖</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- БЛОК 2: ЗАДАЧНИК -->
    <!-- ============================================ -->
    <div v-if="currentTab === 'tasks'" class="fullscreen-content">
      <div class="tasks-full">
        <h3>СИСТЕМА ЗАДАЧ</h3>
        
        <div class="add-task-full">
          <input v-model="newTask" placeholder="НОВАЯ ЗАДАЧА" @keypress.enter="addTask">
          <button @click="addTask">ДОБАВИТЬ</button>
        </div>

        <div class="task-list-full">
          <div class="tasks-header">
            <span>СПИСОК ЗАДАЧ</span>
            <span>{{ tasks.length }} ЗАДАЧ</span>
          </div>
          <div v-if="tasks.length === 0" class="empty-full">НЕТ ЗАДАЧ</div>
          <div v-for="task in tasks" :key="task.id" class="task-full" :class="{ done: task.done }">
            <input type="checkbox" v-model="task.done">
            <span class="task-text">{{ task.text }}</span>
            <button class="delete-task-btn" @click="deleteTask(task.id)">✖</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- БЛОК 3: ЗМЕЙКА (32x32, крупные клетки)      -->
    <!-- ============================================ -->
    <div v-if="currentTab === 'snake'" class="fullscreen-content snake-page">
      <div class="snake-full">
        <div class="snake-game-area">
          <div id="snake-board" class="snake-board-large"></div>
        </div>
        <div class="snake-controls-full">
          <div class="score-box-full">
            СЧЁТ: <span id="snake-score">1</span>
          </div>
          <div class="direction-buttons-full">
            <button class="snake-btn-full" id="snake-up">▲</button>
            <div>
              <button class="snake-btn-full" id="snake-left">◀</button>
              <button class="snake-btn-full" id="snake-down">▼</button>
              <button class="snake-btn-full" id="snake-right">▶</button>
            </div>
          </div>
          <div class="speed-control-full">
            <input type="range" id="snake-speed" min="50" max="250" value="120" step="10">
            <span id="snake-speed-value">120</span> мс
          </div>
          <button class="reset-btn-full" id="snake-reset">СБРОС</button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- БЛОК 4: ФАКТЫ О ЧИСЛАХ -->
    <!-- ============================================ -->
    <div v-if="currentTab === 'facts'" class="fullscreen-content">
      <div class="facts-full">
        <h3>ТЕРМИНАЛ ФАКТОВ</h3>
        
        <div class="fact-input-full">
          <input v-model.number="factNumber" type="number" placeholder="ЧИСЛО">
          <select v-model="factCategory">
            <option value="trivia">TRIVIA</option>
            <option value="math">MATH</option>
            <option value="year">YEAR</option>
          </select>
          <button @click="searchFact" :disabled="factLoading">НАЙТИ</button>
        </div>

        <div class="fact-result-full">
          <div v-if="factLoading" class="loading-full">ЗАГРУЗКА...</div>
          <div v-else-if="factText" class="fact-full">
            <div class="fact-icon">📖</div>
            <div class="fact-text-full">{{ factText }}</div>
          </div>
          <div v-else-if="factError" class="error-full">
            <div class="error-icon">⚠️</div>
            <div>{{ factError }}</div>
          </div>
          <div v-else class="placeholder-full">
            <div>🔢 ВВЕДИТЕ ЧИСЛО</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ПЕРЕМЕННЫЕ ДЛЯ РЕГИСТРАЦИИ
const registered = ref(false)
const userName = ref('')
const avatarUrl = ref('')
const avatarColor = ref('#3498db')
const fileInput = ref(null)

// ПЕРЕМЕННЫЕ ДЛЯ НАВИГАЦИИ
const currentTab = ref('budget')
const tabs = [
  { id: 'budget', name: '💰 БЮДЖЕТ' },
  { id: 'tasks', name: '📋 ЗАДАЧИ' },
  { id: 'snake', name: '🐍 ЗМЕЙКА' },
  { id: 'facts', name: '🔢 ФАКТЫ' }
]

// ПЕРЕМЕННЫЕ ДЛЯ БЮДЖЕТА
const history = ref([])
const budgetTitle = ref('')
const budgetAmount = ref(null)

// ПЕРЕМЕННЫЕ ДЛЯ ЗАДАЧНИКА
const tasks = ref([])
const newTask = ref('')

// ПЕРЕМЕННЫЕ ДЛЯ ФАКТОВ
const factNumber = ref(42)
const factCategory = ref('trivia')
const factText = ref('')
const factError = ref('')
const factLoading = ref(false)

// ПЕРЕМЕННЫЕ ДЛЯ ЗМЕЙКИ (32x32 - крупные клетки)
let snakeGameInitialized = false
let currentSnakeGame = null

// ФУНКЦИИ РЕГИСТРАЦИИ
function triggerUpload() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function changeAvatar() {
  avatarUrl.value = ''
  triggerUpload()
}

function register() {
  if (userName.value.trim()) {
    registered.value = true
  }
}

function logout() {
  if (confirm('ВЫЙТИ ИЗ СИСТЕМЫ?')) {
    registered.value = false
    userName.value = ''
    avatarUrl.value = ''
    currentTab.value = 'budget'
  }
}

function switchTab(tabId) {
  currentTab.value = tabId
  if (tabId === 'snake') {
    setTimeout(() => initSnakeGame(), 100)
  }
}

// ФУНКЦИИ БЮДЖЕТА
function getBalance() {
  let total = 0
  for (let i = 0; i < history.value.length; i++) {
    total += history.value[i].amount
  }
  return total
}

function getBalanceClass() {
  let balance = getBalance()
  if (balance > 0) return 'positive'
  if (balance < 0) return 'negative'
  return 'zero'
}

function addTransaction() {
  if (!budgetTitle.value.trim() || !budgetAmount.value) return
  
  history.value.push({
    id: Date.now(),
    text: budgetTitle.value.trim().toUpperCase(),
    amount: budgetAmount.value
  })
  
  budgetTitle.value = ''
  budgetAmount.value = null
}

function deleteTransaction(id) {
  const index = history.value.findIndex(item => item.id === id)
  if (index !== -1) history.value.splice(index, 1)
}

// ФУНКЦИИ ЗАДАЧНИКА
function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      text: newTask.value.trim().toUpperCase(),
      done: false
    })
    newTask.value = ''
  }
}

function deleteTask(id) {
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) tasks.value.splice(index, 1)
}

// ФУНКЦИИ ФАКТОВ
async function searchFact() {
  if (!factNumber.value) return
  
  factLoading.value = true
  factText.value = ''
  factError.value = ''

  try {
    const response = await fetch(`https://numbersapi.com/${factNumber.value}/${factCategory.value}?json`)
    const data = await response.json()
    
    if (data.found) {
      factText.value = data.text
    } else {
      if (factCategory.value === 'year') {
        factError.value = `${factNumber.value} - скучный год`
      } else {
        factError.value = `${factNumber.value} - скучное число`
      }
    }
  } catch (error) {
    factError.value = 'ОШИБКА API'
  } finally {
    factLoading.value = false
  }
}

// ФУНКЦИИ ЗМЕЙКИ (32x32 - КРУПНЫЕ КЛЕТКИ)
function initSnakeGame() {
  if (snakeGameInitialized) return
  
  const boardSize = 32
  const gameBoard = document.getElementById('snake-board')
  if (!gameBoard) return
  
  gameBoard.innerHTML = ''
  
  const cells = []
  let snake = [{ x: 16, y: 16 }]
  let food = { x: 20, y: 20 }
  let direction = 'right'
  let speed = 120
  let gameLoopTimeout = null

  const scoreSpan = document.getElementById('snake-score')
  const speedRange = document.getElementById('snake-speed')
  const speedSpan = document.getElementById('snake-speed-value')

  gameBoard.style.display = 'grid'
  gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`
  gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`

  function initBoard() {
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        const cell = document.createElement('div')
        cell.className = 'snake-cell-large'
        cells.push(cell)
        gameBoard.appendChild(cell)
      }
    }
  }

  function render() {
    cells.forEach(c => {
      c.classList.remove('snake-cell-active', 'snake-cell-food')
    })
    
    snake.forEach(s => {
      const index = s.y * boardSize + s.x
      if (cells[index]) cells[index].classList.add('snake-cell-active')
    })
    
    const foodIndex = food.y * boardSize + food.x
    if (cells[foodIndex]) cells[foodIndex].classList.add('snake-cell-food')
    
    if (scoreSpan) scoreSpan.textContent = snake.length
  }

  function update() {
    const head = { ...snake[0] }
    switch (direction) {
      case 'up': head.y--; break
      case 'down': head.y++; break
      case 'left': head.x--; break
      case 'right': head.x++; break
    }

    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
      resetGame()
      return
    }

    const collision = snake.some((seg, i) => i > 0 && seg.x === head.x && seg.y === head.y)
    if (collision) {
      resetGame()
      return
    }

    if (head.x === food.x && head.y === food.y) {
      snake.unshift(head)
      generateFood()
    } else {
      snake.pop()
      snake.unshift(head)
    }
  }

  function generateFood() {
    let newFood
    let attempts = 0
    const maxAttempts = 1000
    
    do {
      newFood = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
      }
      attempts++
      if (attempts > maxAttempts) {
        alert('ПОБЕДА!')
        resetGame()
        return
      }
    } while (snake.some(s => s.x === newFood.x && s.y === newFood.y))
    
    food = newFood
  }

  function resetGame() {
    snake = [{ x: 16, y: 16 }]
    direction = 'right'
    generateFood()
    render()
  }

  function gameLoop() {
    update()
    render()
    gameLoopTimeout = setTimeout(gameLoop, speed)
  }

  function restartLoop() {
    clearTimeout(gameLoopTimeout)
    gameLoopTimeout = setTimeout(gameLoop, speed)
  }

  const keyHandler = (e) => {
    const key = e.key
    if (key === 'ArrowUp') { e.preventDefault(); direction = 'up' }
    else if (key === 'ArrowDown') { e.preventDefault(); direction = 'down' }
    else if (key === 'ArrowLeft') { e.preventDefault(); direction = 'left' }
    else if (key === 'ArrowRight') { e.preventDefault(); direction = 'right' }
    else if (key.toLowerCase() === 'r') { resetGame() }
  }
  
  document.addEventListener('keydown', keyHandler)

  const upBtn = document.getElementById('snake-up')
  const downBtn = document.getElementById('snake-down')
  const leftBtn = document.getElementById('snake-left')
  const rightBtn = document.getElementById('snake-right')
  const resetBtn = document.getElementById('snake-reset')

  if (upBtn) upBtn.addEventListener('click', () => direction = 'up')
  if (downBtn) downBtn.addEventListener('click', () => direction = 'down')
  if (leftBtn) leftBtn.addEventListener('click', () => direction = 'left')
  if (rightBtn) rightBtn.addEventListener('click', () => direction = 'right')
  if (resetBtn) resetBtn.addEventListener('click', () => resetGame())

  if (speedRange) {
    speedRange.addEventListener('input', (e) => {
      if (speedSpan) speedSpan.textContent = e.target.value
    })

    speedRange.addEventListener('change', (e) => {
      speed = parseInt(e.target.value, 10)
      restartLoop()
    })
  }

  initBoard()
  generateFood()
  render()
  gameLoopTimeout = setTimeout(gameLoop, speed)
  
  snakeGameInitialized = true
  currentSnakeGame = { gameLoopTimeout, keyHandler }
}

function cleanupSnakeGame() {
  if (currentSnakeGame) {
    if (currentSnakeGame.gameLoopTimeout) {
      clearTimeout(currentSnakeGame.gameLoopTimeout)
    }
    if (currentSnakeGame.keyHandler) {
      document.removeEventListener('keydown', currentSnakeGame.keyHandler)
    }
  }
  snakeGameInitialized = false
  currentSnakeGame = null
}

// ЖИЗНЕННЫЙ ЦИКЛ
onMounted(() => {
  initSnakeGame()
})

onUnmounted(() => {
  cleanupSnakeGame()
})
</script>

<style>
/* ============================================ */
/* ГЛОБАЛЬНЫЕ СТИЛИ */
/* ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: radial-gradient(circle at 20% 30%, #1a3a1a, #0a1f0a);
  min-height: 100vh;
  font-family: 'Courier New', monospace;
}

/* ============================================ */
/* СТИЛИ РЕГИСТРАЦИИ */
/* ============================================ */
.register-terminal {
  background: #0c1b0c;
  border: 4px solid #2f5e2f;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  margin: 50px auto;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
  border-radius: 8px;
}

.register-terminal h2 {
  color: #3eff3e;
  text-align: center;
  font-size: 18px;
  letter-spacing: 2px;
  margin-bottom: 25px;
  border-bottom: 2px solid #2f5e2f;
  padding-bottom: 10px;
}

.register-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 25px;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 10px;
  border: 3px solid #3eff3e;
  box-shadow: 0 0 20px rgba(62, 255, 62, 0.3);
  background: #3498db;
}

.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3eff3e;
  margin-bottom: 10px;
}

.upload-btn, .change-btn {
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 8px 16px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
}

.name-section label {
  display: block;
  color: #7acc7a;
  font-size: 12px;
  margin-bottom: 8px;
}

.name-section input {
  width: 100%;
  background: #050805;
  border: 2px solid #2f5e2f;
  color: #3eff3e;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
}

.register-btn {
  width: 100%;
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.register-btn:enabled:hover {
  background: #1a3a1a;
  color: #3eff3e;
  border-color: #3eff3e;
}

.register-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================ */
/* СТИЛИ ДАШБОРДА - КОМПАКТНЫЕ */
/* ============================================ */
.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a1f0a;
  overflow: hidden;
}

.header {
  background: #0c1b0c;
  border-bottom: 2px solid #2f5e2f;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar img, .default-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #3eff3e;
  background: #3498db;
}

.user-name {
  color: #3eff3e;
  font-size: 14px;
}

.system-title {
  color: #7acc7a;
  font-size: 12px;
}

.logout-btn {
  background: #071007;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 4px 10px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;
}

/* ============================================ */
/* СТИЛИ ВКЛАДОК */
/* ============================================ */
.tabs {
  display: flex;
  gap: 3px;
  padding: 8px 16px 0 16px;
  background: #0a1f0a;
  flex-shrink: 0;
}

.tab-btn {
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 6px 16px;
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px 6px 0 0;
}

.tab-btn:hover {
  background: #1a3a1a;
  color: #3eff3e;
}

.tab-btn.active {
  background: #0c1b0c;
  color: #3eff3e;
  border-bottom: 2px solid #0c1b0c;
  border-color: #3eff3e;
}

/* ============================================ */
/* ПОЛНОЭКРАННЫЙ КОНТЕНТ - КОМПАКТНЫЙ */
/* ============================================ */
.fullscreen-content {
  flex: 1;
  padding: 12px;
  overflow: auto;
  background: #0c1b0c;
  margin: 0 12px 12px 12px;
  border: 2px solid #2f5e2f;
  border-radius: 8px;
}

/* ============================================ */
/* БЛОК 1: БЮДЖЕТ */
/* ============================================ */
.budget-full {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.budget-full h3 {
  color: #3eff3e;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #2f5e2f;
  padding-bottom: 6px;
}

.balance-full {
  text-align: center;
  padding: 10px;
  background: #071007;
  border: 1px solid #2f5e2f;
  border-radius: 6px;
}

.balance-label {
  color: #7acc7a;
  font-size: 11px;
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
}

.positive { color: #3eff3e; }
.negative { color: #ff4444; }
.zero { color: #7acc7a; }

.add-form-full {
  display: flex;
  gap: 8px;
}

.add-form-full input {
  flex: 1;
  background: #050805;
  border: 1px solid #2f5e2f;
  color: #3eff3e;
  padding: 6px 8px;
  font-family: monospace;
  font-size: 11px;
}

.add-form-full button {
  background: #071007;
  border: 1px solid #2f5e2f;
  color: #7acc7a;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;
}

.history-full {
  flex: 1;
  background: #071007;
  border: 1px solid #2f5e2f;
  border-radius: 6px;
  overflow: auto;
  min-height: 150px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  background: #050805;
  border-bottom: 1px solid #2f5e2f;
  color: #3eff3e;
  font-size: 10px;
}

.transaction-full {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-left: 3px solid;
  margin: 2px 0;
  background: #050805;
  font-size: 11px;
}

.transaction-full.income { border-left-color: #3eff3e; }
.transaction-full.expense { border-left-color: #ff4444; }

.transaction-text {
  flex: 1;
  color: #4afc4a;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 2px 5px;
}

.empty-full {
  text-align: center;
  color: #1a4a1a;
  padding: 20px;
  font-size: 12px;
}

/* ============================================ */
/* БЛОК 2: ЗАДАЧНИК */
/* ============================================ */
.tasks-full {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tasks-full h3 {
  color: #3eff3e;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #2f5e2f;
  padding-bottom: 6px;
}

.add-task-full {
  display: flex;
  gap: 8px;
}

.add-task-full input {
  flex: 1;
  background: #050805;
  border: 1px solid #2f5e2f;
  color: #3eff3e;
  padding: 6px 8px;
  font-family: monospace;
  font-size: 11px;
}

.add-task-full button {
  background: #071007;
  border: 1px solid #2f5e2f;
  color: #7acc7a;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;
}

.task-list-full {
  flex: 1;
  background: #071007;
  border: 1px solid #2f5e2f;
  border-radius: 6px;
  overflow: auto;
  min-height: 150px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  background: #050805;
  border-bottom: 1px solid #2f5e2f;
  color: #3eff3e;
  font-size: 10px;
}

.task-full {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin: 2px 0;
  background: #050805;
}

.task-full input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: #3eff3e;
}

.task-text {
  flex: 1;
  font-size: 11px;
  color: #4afc4a;
}

.task-full.done .task-text {
  text-decoration: line-through;
  color: #1a4a1a;
}

.delete-task-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 2px 5px;
}

/* ============================================ */
/* БЛОК 3: ЗМЕЙКА - УВЕЛИЧЕННАЯ (32x32, крупные клетки) */
/* ============================================ */
.snake-page {
  padding: 8px;
}

.snake-full {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.snake-game-area {
  flex: 2;
  min-height: 0;
  background: #050805;
  border: 2px solid #2f5e2f;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.snake-board-large {
  display: grid;
  background: #0a0a0a;
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 600px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
}

.snake-cell-large {
  border: 0.5px solid #1a3a1a;
}

.snake-cell-active {
  background: #3eff3e;
  box-shadow: inset 0 0 0 0.5px #0a0a0a;
}

.snake-cell-food {
  background: #ff4444;
  box-shadow: inset 0 0 0 0.5px #0a0a0a;
}

.snake-controls-full {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
  background: #071007;
  border: 2px solid #2f5e2f;
  border-radius: 8px;
}

.score-box-full {
  color: #3eff3e;
  font-size: 16px;
  font-weight: bold;
  background: #050805;
  padding: 5px 15px;
  border: 1px solid #2f5e2f;
  border-radius: 6px;
}

#snake-score {
  color: #ffd700;
  font-size: 20px;
  margin-left: 5px;
}

.snake-btn-full {
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  font-size: 18px;
  width: 45px;
  height: 45px;
  cursor: pointer;
  font-family: monospace;
  margin: 2px;
  border-radius: 6px;
}

.snake-btn-full:hover {
  background: #1a3a1a;
  color: #3eff3e;
  border-color: #3eff3e;
}

.speed-control-full {
  color: #7acc7a;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

#snake-speed {
  width: 120px;
  accent-color: #3eff3e;
}

.reset-btn-full {
  background: #071007;
  border: 2px solid #ff4444;
  color: #ff4444;
  padding: 6px 15px;
  font-family: monospace;
  cursor: pointer;
  font-size: 12px;
  border-radius: 6px;
}

.reset-btn-full:hover {
  background: #3a0a0a;
  border-color: #ff4444;
}

/* ============================================ */
/* БЛОК 4: ФАКТЫ О ЧИСЛАХ */
/* ============================================ */
.facts-full {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.facts-full h3 {
  color: #3eff3e;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #2f5e2f;
  padding-bottom: 6px;
}

.fact-input-full {
  display: flex;
  gap: 8px;
}

.fact-input-full input, .fact-input-full select {
  flex: 1;
  background: #050805;
  border: 1px solid #2f5e2f;
  color: #3eff3e;
  padding: 6px 8px;
  font-family: monospace;
  font-size: 11px;
}

.fact-input-full button {
  background: #071007;
  border: 1px solid #2f5e2f;
  color: #7acc7a;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;
}

.fact-result-full {
  flex: 1;
  background: #071007;
  border: 1px solid #2f5e2f;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.loading-full, .placeholder-full {
  text-align: center;
  color: #1a4a1a;
  font-size: 12px;
}

.fact-full {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.fact-icon, .error-icon {
  font-size: 24px;
}

.fact-text-full {
  color: #4afc4a;
  font-size: 12px;
  line-height: 1.4;
  flex: 1;
}

.error-full {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #ff4444;
  font-size: 12px;
}

/* ============================================ */
/* ОБЩИЕ ЭЛЕМЕНТЫ */
/* ============================================ */
.footer {
  margin-top: 15px;
  padding-top: 8px;
  border-top: 1px solid #1a4a1a;
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #2d8c3c;
}

.blink {
  display: inline-block;
  width: 6px;
  height: 10px;
  background: #4afc4a;
  animation: blink 1s infinite;
  margin-left: 4px;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

::-webkit-scrollbar {
  width: 6px;
  background: #050805;
}

::-webkit-scrollbar-track {
  background: #050805;
}

::-webkit-scrollbar-thumb {
  background: #2d8c3c;
  border-radius: 3px;
}
</style>
