<template>
  <div class="container" :class="timeOfDay">
    <h2 class="greeting fade-in">{{ greeting }}</h2>
    <p class="subtitle fade-in delay-1">Convert your .mov files to .mp4 format with ease</p>
    <div class="converter-card fade-in delay-2">
      <div class="animated-image">
        <img 
          :src="currentImage" 
          alt="Benny" 
          class="header-image"
          @load="onImageLoad"
        />
      </div>
      <h1>.mov to .mp4 Converter</h1>
      <div class="upload-section">
        <div class="file-input-wrapper">
          <input 
            type="file" 
            @change="handleFileUpload" 
            class="file-input"
            accept=".mov"
          />
          <div class="file-input-label">
            <span class="file-icon">📁</span>
            <span class="file-text">{{ file ? file.name : 'Choose a .mov file' }}</span>
          </div>
        </div>
        <button 
          @click="convert" 
          :disabled="isUploading || !file" 
          class="convert-button"
          :class="{ 'converting': isUploading }"
        >
          {{ isUploading ? 'Converting...' : 'Convert' }}
        </button>
      </div>

      <div v-if="isUploading" class="progress-container">
        <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
        <span class="progress-text">{{ uploadProgress }}%</span>
      </div>

      <div class="download-section" :class="{ 'converting': isUploading }">
        <h3>{{ downloadSectionTitle }}</h3>
        <div v-if="downloadUrl" class="download-content">
          <a :href="downloadUrl" download="converted.mp4" class="download-link">
            <span class="download-icon">⬇️</span>
            Download Converted File
          </a>
        </div>
        <div v-else class="placeholder-content">
          <p>Your converted file will appear here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import benny1 from './img/benny-1.png'
import benny2 from './img/benny-2.png'

const file = ref<File | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)
const downloadUrl = ref<string | null>(null)
const currentImage = ref(benny1)
let animationInterval: number | null = null

const downloadSectionTitle = computed(() => {
  if (isUploading.value) return 'Converting...'
  if (downloadUrl.value) return 'Conversion Complete!'
  return 'Ready to Convert'
})

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning! 🌞'
  if (hour >= 12 && hour < 18) return 'Good afternoon! 😎'
  return 'Good evening! 🌛'
})

function onImageLoad() {
  // Ensure smooth transition between images
  const img = document.querySelector('.header-image') as HTMLImageElement
  if (img) {
    img.style.opacity = '1'
  }
}

onMounted(() => {
  // Start the animation
  animationInterval = window.setInterval(() => {
    currentImage.value = currentImage.value === benny1 ? benny2 : benny1
  }, 500)
})

onUnmounted(() => {
  // Clean up the animation interval
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
    downloadUrl.value = null
  }
}

async function convert() {
  if (!file.value) return
  const formData = new FormData()
  formData.append('file', file.value)
  
  isUploading.value = true
  uploadProgress.value = 0
  downloadUrl.value = null

  try {
    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          uploadProgress.value = Math.round((event.loaded * 80) / event.total)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response)
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('POST', 'http://localhost:3000/upload')
      xhr.responseType = 'blob'
      xhr.send(formData)
    })

    const blob = response as Blob
    downloadUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload failed. Please try again.')
  } finally {
    isUploading.value = false
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  transition: background 1s ease;
}

.container.morning {
  background: linear-gradient(180deg, #FFB6C1 0%, #87CEEB 100%);
}

.container.afternoon {
  background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%);
}

.container.evening {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}

.container.evening::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.5;
  z-index: 1;
}

.greeting {
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.container.morning .greeting {
  color: #2c3e50;
}

.container.afternoon .greeting {
  color: #2c3e50;
}

.container.evening .greeting {
  color: #fff;
}

.converter-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.animated-image {
  width: 100%;
  max-width: 300px;
  margin: 0 auto 2rem;
  display: block;
}

.header-image {
  width: 100%;
  height: auto;
  transition: opacity 0.1s ease;
  opacity: 0;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.file-input-label:hover {
  border-color: #4CAF50;
  background: #f0f7f0;
}

.file-icon {
  font-size: 1.5rem;
}

.file-text {
  color: #666;
  font-size: 0.9rem;
}

.convert-button {
  padding: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.convert-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
}

.convert-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.convert-button.converting {
  background: #2196F3;
}

.progress-container {
  margin: 1.5rem 0;
  width: 100%;
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 0.9rem;
  font-weight: 500;
}

.download-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
}

.download-section.converting {
  background-color: #e8f5e9;
}

.download-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 500;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.download-link:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.download-icon {
  font-size: 1.2rem;
}

.placeholder-content {
  color: #666;
  font-style: italic;
}

.placeholder-content p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .converter-card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .download-section {
    padding: 1rem;
  }
}

.subtitle {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  line-height: 1.5;
}

.container.morning .subtitle {
  color: #2c3e50;
}

.container.afternoon .subtitle {
  color: #2c3e50;
}

.container.evening .subtitle {
  color: #fff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}

.delay-1 {
  animation-delay: 0.2s;
}

.delay-2 {
  animation-delay: 0.4s;
}
</style>