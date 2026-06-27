<template>
  <header class="h-20 bg-white dark:bg-gray-850 border-b border-gray-200/60 dark:border-gray-800/60 px-8 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <button @click="appStore.toggleSidebar" class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
        <span class="material-symbols-outlined align-middle">menu</span>
      </button>
      <h1 class="text-base font-bold text-gray-800 dark:text-white">{{ title }}</h1>
    </div>
    
    <div class="flex items-center space-x-6">
      <button @click="appStore.toggleTheme" class="p-2.5 rounded-lg text-gray-500 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Toggle Theme">
        <span class="material-symbols-outlined align-middle transition-transform duration-300 hover:rotate-12">
          {{ appStore.darkMode ? 'light_mode' : 'dark_mode' }}
        </span>
      </button>
      <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {{ formattedDate }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'
import { formatDate } from '../../utils/helpers'

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
})

const appStore = useAppStore()
const formattedDate = computed(() => formatDate(new Date()))
</script>
