<template>
  <div class="container">
    <div class="converter-card">
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
import { ref, computed } from 'vue'
const file = ref<File | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)
const downloadUrl = ref<string | null>(null)

const downloadSectionTitle = computed(() => {
  if (isUploading.value) return 'Converting...'
  if (downloadUrl.value) return 'Conversion Complete!'
  return 'Ready to Convert'
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
          uploadProgress.value = Math.round((event.loaded * 100) / event.total)
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

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.converter-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
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
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
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
  font-size: 0.8rem;
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
</style>