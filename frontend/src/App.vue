<template>
  <div>
    <h1>.mov to .mp4 Converter</h1>
    <input type="file" @change="handleFileUpload" />
    <button @click="convert">Convert</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

async function convert() {
  if (!file.value) return
  const formData = new FormData()
  formData.append('file', file.value)

  const res = await fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData
  })

  if (res.ok) {
    const blob = await res.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'converted.mp4'
    link.click()
  }
}
</script>