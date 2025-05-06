<template>
  <div>
    <h1>.mov to .mp4 Converter</h1>
    <input type="file" @change="handleFileUpload" />
    <button @click="convert" :disabled="isUploading">Convert</button>
    <div v-if="isUploading" class="progress-container">
      <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
      <span class="progress-text">{{ uploadProgress }}%</span>
    </div>
    <div v-if="downloadUrl" class="download-section">
      <h3>Conversion Complete!</h3>
      <a :href="downloadUrl" download="converted.mp4" class="download-link">
        Download Converted File
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)
const downloadUrl = ref<string | null>(null)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
    // Reset download URL when new file is selected
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
.progress-container {
  margin-top: 20px;
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 12px;
  font-weight: bold;
}

.download-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.download-section h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.download-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.download-link:hover {
  background-color: #45a049;
}
</style>