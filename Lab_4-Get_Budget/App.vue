<template>
  <div class="terminal">
    <h2>VAULT-TEC СИСТЕМА УПРАВЛЕНИЯ БЮДЖЕТОМ</h2>
    
    <div class="balance-box">
      <div class="balance-label">ТЕКУЩИЙ БАЛАНС:</div>
      <div class="balance-amount" :class="getBalanceClass()">{{ getBalance() }} ₽</div>
    </div>

    <div class="form-box">
      <div class="field">
        <label>НАЗВАНИЕ ОПЕРАЦИИ:</label>
        <input v-model.trim="title" type="text" placeholder="Например, ЗАРПЛАТА">
      </div>

      <div class="field">
        <label>СУММА (РУБ):</label>
        <input v-model.number="amount" type="number" placeholder="+ для дохода, - для расхода">
      </div>

      <button class="add-btn" @click="addTransaction">
        [ ДОБАВИТЬ ОПЕРАЦИЮ ]
      </button>
    </div>

    <div class="history-box">
      <div class="history-header">
        <span>ИСТОРИЯ ОПЕРАЦИЙ</span>
        <span class="history-count">ВСЕГО: {{ history.length }} ОПЕРАЦИЙ</span>
      </div>

      <div v-if="history.length === 0" class="empty-history">
        ВЫ НЕ СОВЕРШАЛИ ФИНАНСОВЫХ ОПЕРАЦИЙ
      </div>

      <ul v-else class="history-list">
        <li v-for="item in history" :key="item.id" class="history-item" :class="getItemClass(item.amount)">
          <div class="item-text">{{ item.text }}</div>
          <div class="item-amount">{{ formatAmount(item.amount) }} ₽</div>
          <button class="delete-btn" @click="deleteTransaction(item.id)">[X]</button>
        </li>
      </ul>
    </div>

    <div class="footer">
      <div class="left">VAULT-TEC INDUSTRIES</div>
      <div class="right">ОНЛАЙН <span class="blink"></span></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const history = ref([])
    const title = ref('')
    const amount = ref(null)

    const getBalance = () => {
      let total = 0
      for (let i = 0; i < history.value.length; i++) {
        total = total + history.value[i].amount
      }
      return total
    }

    const getBalanceClass = () => {
      let balance = getBalance()
      if (balance > 0) return 'positive'
      if (balance < 0) return 'negative'
      return 'zero'
    }

    const getItemClass = (amount) => {
      if (amount > 0) return 'income'
      if (amount < 0) return 'expense'
      return ''
    }

    const formatAmount = (amount) => {
      if (amount > 0) return '+' + amount
      return amount.toString()
    }

    const addTransaction = () => {
      if (title.value.trim() === '') {
        alert('ОШИБКА: НЕОБХОДИМО ВВЕСТИ НАЗВАНИЕ ОПЕРАЦИИ')
        return
      }

      if (amount.value === null || isNaN(amount.value)) {
        alert('ОШИБКА: НЕОБХОДИМО ВВЕСТИ СУММУ')
        return
      }

      if (amount.value === 0) {
        alert('ОШИБКА: СУММА НЕ МОЖЕТ БЫТЬ РАВНА 0')
        return
      }

      const newItem = {
        id: Date.now(),
        text: title.value.trim().toUpperCase(),
        amount: amount.value
      }

      history.value.push(newItem)
      
      title.value = ''
      amount.value = null
    }

    const deleteTransaction = (id) => {
      let sure = confirm('УДАЛИТЬ ОПЕРАЦИЮ? [Y/N]')
      if (sure) {
        const index = history.value.findIndex(item => item.id === id)
        if (index !== -1) {
          history.value.splice(index, 1)
        }
      }
    }

    return {
      history,
      title,
      amount,
      getBalance,
      getBalanceClass,
      getItemClass,
      formatAmount,
      addTransaction,
      deleteTransaction
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
  font-family: 'Courier New', 'VT323', monospace;
  padding: 20px;
}

.terminal {
  background: #0c1b0c;
  border: 4px solid #2f5e2f;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1);
  border-radius: 8px;
}

h2 {
  color: #3eff3e;
  text-align: center;
  font-size: 18px;
  letter-spacing: 2px;
  margin-bottom: 25px;
  text-shadow: 0 0 5px #3eff3e;
  border-bottom: 2px solid #2f5e2f;
  padding-bottom: 10px;
  font-family: monospace;
}

.balance-box {
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 20px;
  margin-bottom: 25px;
  text-align: center;
}

.balance-label {
  color: #7acc7a;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 2px;
}

.balance-amount.positive {
  color: #3eff3e;
  text-shadow: 0 0 8px #3eff3e;
}

.balance-amount.negative {
  color: #ff4444;
  text-shadow: 0 0 8px #ff4444;
}

.balance-amount.zero {
  color: #7acc7a;
}

.form-box {
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 20px;
  margin-bottom: 25px;
}

.field {
  margin-bottom: 18px;
}

label {
  display: block;
  color: #7acc7a;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 6px;
  font-weight: bold;
}

input {
  width: 100%;
  background: #050805;
  border: 2px solid #2f5e2f;
  color: #3eff3e;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  outline: none;
}

input:focus {
  border-color: #3eff3e;
  box-shadow: 0 0 8px #3eff3e;
  background: #0a140a;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 0.5;
  background: #2f5e2f;
}

.add-btn {
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
  transition: all 0.2s;
  margin-top: 5px;
}

.add-btn:hover {
  background: #1a3a1a;
  color: #3eff3e;
  border-color: #3eff3e;
  box-shadow: 0 0 10px rgba(62, 255, 62, 0.5);
  transform: scale(1.02);
}

.history-box {
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #7acc7a;
  font-size: 12px;
  letter-spacing: 2px;
  padding-bottom: 10px;
  border-bottom: 1px solid #2f5e2f;
  margin-bottom: 15px;
}

.history-count {
  color: #3eff3e;
  font-size: 10px;
}

.empty-history {
  text-align: center;
  color: #1a4a1a;
  padding: 40px 20px;
  font-size: 12px;
  letter-spacing: 1px;
}

.history-list {
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
}

.history-list::-webkit-scrollbar {
  width: 8px;
  background: #050805;
}

.history-list::-webkit-scrollbar-track {
  background: #050805;
  border-left: 1px solid #1a4a1a;
}

.history-list::-webkit-scrollbar-thumb {
  background: #2d8c3c;
  border-radius: 4px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin: 4px 0;
  border-left: 3px solid #2f5e2f;
  background: #050805;
  transition: all 0.15s;
}

.history-item:hover {
  background: #0a120a;
  border-left-color: #4afc4a;
}

.history-item.income {
  border-left-color: #3eff3e;
}

.history-item.expense {
  border-left-color: #ff4444;
}

.item-text {
  flex: 1;
  color: #4afc4a;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.item-text::before {
  content: "▪ ";
  color: #2d8c3c;
}

.item-amount {
  font-size: 13px;
  font-weight: bold;
  margin: 0 15px;
}

.history-item.income .item-amount {
  color: #3eff3e;
}

.history-item.expense .item-amount {
  color: #ff4444;
}

.delete-btn {
  background: #0a0c0b;
  border: 1px solid #1a4a1a;
  color: #ff4444;
  font-size: 12px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: monospace;
  transition: all 0.15s;
}

.delete-btn:hover {
  background: #3a0a0a;
  border-color: #ff4444;
  box-shadow: 0 0 6px rgba(255, 68, 68, 0.3);
}

.footer {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #1a4a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #2d8c3c;
  font-family: monospace;
}

.left {
  color: #2d8c3c;
}

.right {
  display: flex;
  align-items: center;
  gap: 6px;
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
