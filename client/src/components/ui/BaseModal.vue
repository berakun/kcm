<template>
  <div v-if="show" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-850 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 class="font-bold text-base text-gray-900 dark:text-white">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal Title'
  }
})

defineEmits(['close'])
</script>
