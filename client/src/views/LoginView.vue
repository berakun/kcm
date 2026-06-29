<template>
  <div class="min-h-screen flex flex-col items-center overflow-x-hidden">
    <!-- Top Hero Section -->
    <div class="relative w-full h-[40vh] md:h-[45vh] overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/assets/images/hero-login.jpg');"></div>
      <div class="absolute inset-0 hero-gradient"></div>
      
      <!-- Top Left Logo Link -->
      <div class="absolute top-6 left-6 flex items-center gap-2">
        <router-link to="/" class="w-[60px] h-[60px] rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform overflow-hidden">
          <img src="/logo-transparent.png" alt="KCM Interior Studio — Logo" class="w-15 h-15 rounded-lg object-contain shadow-md">
        </router-link>
      </div>
      
      <!-- Bottom Left Text -->
      <div class="absolute bottom-6 left-6 right-6 text-white">
        <h1 class="text-3xl md:text-4xl font-bold mb-1">Kurnia Cipta Mandiri</h1>
        <p class="text-sm opacity-95">Ingin interior murah? KCM solusinya</p>
      </div>
    </div>

    <!-- Login Form Section -->
    <div class="w-full max-w-md bg-white dark:bg-gray-850 flex-grow px-6 py-8 -mt-4 relative rounded-t-[2rem] shadow-2xl">
      <div class="text-center md:text-left mb-6 pt-2">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-1">Selamat Datang</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Masuk ke akun KCM Anda</p>
      </div>

      <!-- Alert Box -->
      <div v-if="alertMessage" :class="[alertType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800', 'mb-4 p-3.5 rounded-xl border text-sm transition-all duration-200']">
        {{ alertMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Username Field -->
        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 block ml-1">Username</label>
          <div class="relative flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-4 py-3 input-focus transition-all">
            <span class="material-symbols-outlined text-gray-400 mr-3">person</span>
            <input autocomplete="username" v-model="username" class="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-800 dark:text-white outline-none" placeholder="Masukkan username" required type="text"/>
          </div>
        </div>
        
        <!-- Password Field -->
        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 block ml-1">Password</label>
          <div class="relative flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-4 py-3 input-focus transition-all">
            <span class="material-symbols-outlined text-gray-400 mr-3">lock</span>
            <input autocomplete="current-password" :type="showPassword ? 'text' : 'password'" v-model="password" class="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-800 dark:text-white outline-none" placeholder="••••••••" required/>
            <button class="ml-2 flex items-center text-gray-400 hover:text-red-700 transition-colors" @click="showPassword = !showPassword" type="button">
              <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>
        
        <!-- Links Row -->
        <div class="flex items-center justify-between py-1">
          <label class="flex items-center cursor-pointer group">
            <input v-model="rememberMe" class="h-4.5 w-4.5 cursor-pointer rounded border border-gray-300 text-red-800 focus:ring-0 transition-all" type="checkbox"/>
            <span class="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-750 transition-colors">Ingat saya</span>
          </label>
          <!-- TODO: Implement password reset flow -->
          <!-- <a class="text-xs font-semibold text-red-800 hover:text-red-900 transition-colors" href="#" @click.prevent="forgotPassword">Lupa password?</a> -->
        </div>
        
        <!-- Main Action Button -->
        <button :disabled="authLoading" class="w-full bg-red-800 hover:bg-red-950 text-white font-semibold py-3.5 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 mt-2 flex justify-center items-center gap-2" type="submit">
          <span v-if="authLoading">Loading...</span>
          <span v-else>Masuk</span>
        </button>
      </form>

      <!-- Footer -->
      <footer class="mt-auto pt-4 text-center">
        <p class="text-[10px] text-gray-400">
          © 2026 Kurnia Cipta Mandiri. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, loading: authLoading } = useAuth()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const alertMessage = ref('')
const alertType = ref('error')

async function handleLogin() {
  alertMessage.value = ''
  try {
    await login(username.value, password.value)
  } catch (err) {
    alertType.value = 'error'
    alertMessage.value = err.message || 'Login gagal.'
  }
}

function forgotPassword() {
  alert('Silakan hubungi Super Admin untuk menyetel ulang password Anda.')
}
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(to bottom, rgba(153, 27, 27, 0.4) 0%, rgba(153, 27, 27, 0.8) 100%);
}
.input-focus:focus-within {
  border-color: #4b5563;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.15);
}
</style>
