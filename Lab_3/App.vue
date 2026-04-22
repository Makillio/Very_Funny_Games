<template>
  <div class="terminal">
    <h2>Vault-Tec Registration Terminal</h2>
    
    <div class="field">
      <label>NAME:</label>
      <input :value="name" @input="name = $event.target.value">
    </div>

    <div class="field">
      <label>SURNAME:</label>
      <input :value="surname" @input="surname = $event.target.value">
    </div>

    <div class="field">
      <label>GENDER:</label>
      <div class="radio-group">
        <label><input type="radio" value="male" :checked="gender === 'male'" @change="gender = 'male'"> MALE</label>
        <label><input type="radio" value="female" :checked="gender === 'female'" @change="gender = 'female'"> FEMALE</label>
      </div>
    </div>

    <div class="field">
      <label>PASSWORD:</label>
      <input :type="showPassword ? 'text' : 'password'" :value="password" @input="password = $event.target.value">
    </div>

    <div class="field">
      <label>CONFIRM PASSWORD:</label>
      <input :value="confirmPassword" @input="confirmPassword = $event.target.value">
    </div>

    <div class="field">
      <button class="show-btn" @mousedown="showPassword = true" @mouseup="showPassword = false" @mouseleave="showPassword = false">
        [ HOLD TO SHOW PASSWORD ]
      </button>
    </div>

    <div class="info">
      <p>USER: {{ name }} {{ surname }}. {{ gender === 'male' ? 'MALE' : 'FEMALE' }}</p>
    </div>

    <button class="register-btn" :disabled="password !== confirmPassword" @click="console.log(name, surname, gender, password)">
      REGISTER
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const name = ref('')
    const surname = ref('')
    const gender = ref('male')
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)

    return {
      name,
      surname,
      gender,
      password,
      confirmPassword,
      showPassword
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
  max-width: 500px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1);
  border-radius: 8px;
}

h2 {
  color: #3eff3e;
  text-align: center;
  font-size: 22px;
  letter-spacing: 2px;
  margin-bottom: 25px;
  text-shadow: 0 0 5px #3eff3e;
  border-bottom: 2px solid #2f5e2f;
  padding-bottom: 10px;
  font-family: monospace;
}

.field {
  margin-bottom: 18px;
}

label {
  display: block;
  color: #7acc7a;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 6px;
  font-weight: bold;
}

input {
  width: 100%;
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #3eff3e;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: #3eff3e;
  box-shadow: 0 0 8px #3eff3e;
  background: #0a140a;
}

.radio-group {
  display: flex;
  gap: 25px;
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 8px;
}

.radio-group label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 0;
  cursor: pointer;
}

input[type="radio"] {
  width: auto;
  margin: 0;
  accent-color: #3eff3e;
}

.show-btn {
  width: 100%;
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 8px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.1s;
}

.show-btn:active {
  background: #1a3a1a;
  color: #3eff3e;
  border-color: #3eff3e;
}

.info {
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 12px;
  margin: 20px 0;
  text-align: center;
}

.info p {
  color: #7acc7a;
  font-size: 14px;
  letter-spacing: 1px;
  word-break: break-word;
}

.register-btn {
  width: 100%;
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 12px;
  font-family: monospace;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 5px;
}

.register-btn:enabled {
  background: #0f2b0f;
  border-color: #3eff3e;
  color: #3eff3e;
  text-shadow: 0 0 3px #3eff3e;
}

.register-btn:enabled:hover {
  background: #1a3a1a;
  box-shadow: 0 0 10px rgba(62, 255, 62, 0.5);
  transform: scale(1.02);
}

.register-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

::-webkit-input-placeholder {
  color: #1a3a1a;
}
</style>
