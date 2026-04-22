<template>
  <div class="avatar-container">
    <!-- Если есть картинка - показываем её -->
    <div v-if="imageUrl" class="avatar-image">
      <img :src="imageUrl" alt="avatar">
      <button class="change-btn" @click="changeImage">Сменить фото</button>
    </div>
    
    <!-- Если картинки нет - показываем цветной кружок -->
    <div v-else>
      <div class="circle" :style="{ backgroundColor: colors[index] }">
      </div>
      <button class="change-btn" @click="changeColor">Сменить цвет</button>
      <button class="upload-btn" @click="triggerUpload">Загрузить фото</button>
    </div>

    <!-- Скрытый инпут для загрузки файла -->
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept="image/*"
      @change="handleFileUpload"
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['name'])
const emit = defineEmits(['color-changed'])

const colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6']
const index = ref(0)
const imageUrl = ref('')
const fileInput = ref(null)

function changeColor() {
  index.value = (index.value + 1) % colors.length
  emit('color-changed', colors[index.value])
}

function triggerUpload() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function changeImage() {
  imageUrl.value = ''
  triggerUpload()
}
</script>

<style scoped>
.avatar-container {
  text-align: center;
}

.circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border: 2px solid #3eff3e;
  box-shadow: 0 0 15px rgba(62, 255, 62, 0.3);
}

.avatar-image {
  text-align: center;
}

.avatar-image img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3eff3e;
  box-shadow: 0 0 15px rgba(62, 255, 62, 0.3);
  margin-bottom: 10px;
}

.change-btn, .upload-btn {
  background: #071007;
  border: 2px solid #2f5e2f;
  color: #7acc7a;
  padding: 6px 12px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
  margin: 5px;
}

.change-btn:hover, .upload-btn:hover {
  background: #1a3a1a;
  color: #3eff3e;
  border-color: #3eff3e;
}
</style>
