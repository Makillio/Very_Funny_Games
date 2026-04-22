<template>
  <div class="terminal">
    <h2>VAULT-TEC: КАРТОЧКА ЖИТЕЛЯ</h2>
    
    <div class="profile">
      <UserAvatar :name="name" />
      <UserCard :name="name" @name-changed="name = $event" />
    </div>

    <div class="footer">
      <div class="left">VAULT-TEC INDUSTRIES</div>
      <div class="right">ONLINE<span class="blink"></span></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserAvatar from './components/UserAvatar.vue'
import UserCard from './components/UserCard.vue'

const name = ref('Валерий Васильев')
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
  max-width: 450px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  border-radius: 8px;
}

h2 {
  color: #3eff3e;
  text-align: center;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 25px;
  border-bottom: 2px solid #2f5e2f;
  padding-bottom: 10px;
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: #071007;
  border: 2px solid #2f5e2f;
  padding: 30px;
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
