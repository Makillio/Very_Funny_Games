<template>
  <div class="terminal">
    <h2>VAULT-TEC БАЗА ЗНАНИЙ</h2>
    
    <div class="main-box">
      <div class="field">
        <label>ВВЕДИТЕ ЧИСЛО:</label>
        <input 
          v-model="number" 
          type="number" 
          placeholder="например, 42"
          @keypress.enter="searchFact"
        >
      </div>

      <div class="field">
        <label>КАТЕГОРИЯ ФАКТА:</label>
        <select v-model="category">
          <option value="trivia">TRIVIA - случайный факт</option>
          <option value="math">MATH - математический факт</option>
          <option value="year">YEAR - факт о годе</option>
        </select>
      </div>

      <button class="search-btn" @click="searchFact" :disabled="loading">
        {{ loading ? '[ ЗАГРУЗКА... ]' : '[ ПОИСК ФАКТА ]' }}
      </button>

      <div class="result-box">
        <div v-if="loading" class="loading">
          ЗАГРУЗКА ДАННЫХ...
        </div>
        <div v-else-if="factText" class="fact-text">
          {{ factText }}
        </div>
        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="right">ONLINE <span class="blink"></span></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const number = ref(42)
    const category = ref('trivia')
    const factText = ref('')
    const errorMessage = ref('')
    const loading = ref(false)

    const searchFact = async () => {
      loading.value = true
      factText.value = ''
      errorMessage.value = ''

      try {
        const response = await fetch(`/api/${number.value}/${category.value}?json`)
        const data = await response.json()
        
        if (data.found) {
          factText.value = data.text
        } else {
          errorMessage.value = `${number.value} - скучное число`
        }
      } catch (error) {
        errorMessage.value = 'НЕ УДАЛОСЬ ПОЛУЧИТЬ ФАКТ'
      } finally {
        loading.value = false
      }
    }

    return {
      number,
      category,
      factText,
      errorMessage,
      loading,
      searchFact
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: radial-gradient(circle at 20% 30%, #1a3a1a, #0a1f0a);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', monospace;
  padding: 20px;
}

.terminal {
  background: #0c1b0c;
  border: 4px solid #2f5e2f;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  border-radius: 8px;
}

h2 {
  color: #3eff3e;
  text-align: center;
  font-size: 18px;
  letter-spacing: 2px;
  margin-bottom: 25px;
  border-bottom: 2px solid #2f5e2f;
  padding-bottom: 10px;
}

.main-box {
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 25px;
}

.field {
  margin-bottom: 20px;
}

label {
  display: block;
  color: #7acc7a;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

input, select {
  width: 100%;
  background: #050805;
  border: 2px solid #2f5e2f;
  color: #3eff3e;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
  outline: none;
}

input:focus, select:focus {
  border-color: #3eff3e;
  box-shadow: 0 0 8px #3eff3e;
}

.search-btn {
  width: 100%;
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  margin: 10px 0 20px 0;
}

.search-btn:hover:not(:disabled) {
  background: #1a3a1a;
  color: #3eff3e;
  border-color: #3eff3e;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-box {
  background: #050805;
  border: 1px solid #1a4a1a;
  padding: 20px;
  min-height: 120px;
}

.loading {
  text-align: center;
  color: #3eff3e;
  font-size: 12px;
  letter-spacing: 2px;
}

.error-message {
  color: #ff4444;
  text-align: center;
  font-size: 14px;
}

.fact-text {
  color: #4afc4a;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.footer {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #1a4a1a;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #2d8c3c;
}

.blink {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #4afc4a;
  animation: blink 1s infinite;
  margin-left: 4px;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
