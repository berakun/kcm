// client/src/stores/app.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: localStorage.getItem('kcm_dark_mode') === 'true',
    alert: null,
    sidebarOpen: false
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    closeSidebar() {
      this.sidebarOpen = false
    },
    initTheme() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
    },
    toggleTheme() {
      this.darkMode = !this.darkMode
      localStorage.setItem('kcm_dark_mode', this.darkMode)
      this.initTheme()
    },
    showAlert(message, type = 'success') {
      this.alert = { message, type }
      setTimeout(() => {
        this.alert = null
      }, 5000)
    },
    clearAlert() {
      this.alert = null
    }
  }
})
