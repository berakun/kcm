<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <router-view />
    
    <!-- Global Alert Notification -->
    <div 
      v-if="appStore.alert"
      class="fixed bottom-6 right-6 z-[9999] flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-xl border glass-effect transition-all duration-300 transform translate-y-0"
      :class="[
        appStore.alert.type === 'success' 
          ? 'border-emerald-500/30 text-emerald-800 dark:text-emerald-400' 
          : 'border-red-500/30 text-red-800 dark:text-red-400'
      ]"
    >
      <span class="material-symbols-outlined text-xl">
        {{ appStore.alert.type === 'success' ? 'check_circle' : 'error' }}
      </span>
      <span class="text-xs font-semibold">{{ appStore.alert.message }}</span>
      <button @click="appStore.clearAlert" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-2">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})
</script>
