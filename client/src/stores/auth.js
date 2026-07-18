// client/src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('kcm_user')) || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user && ['admin', 'super_admin'].includes(state.user.role),
    isSuperAdmin: (state) => state.user && state.user.role === 'super_admin'
  },
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post('/api/auth/login', { username, password })
        const { user } = res.data
        
        this.user = user
        localStorage.setItem('kcm_user', JSON.stringify(user))
        
        // Auto-register device if on office WiFi (backend checks IP)
        axios.post('/api/attendance/register-device').catch(() => {})
        
        return user
      } catch (err) {
        this.error = err.response?.data?.error || 'Login gagal.'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('kcm_user')
      axios.post('/api/auth/logout').catch(() => {})
    },

    async checkAuthStatus() {
      if (!localStorage.getItem('kcm_user')) {
        this.logout()
        return null
      }
      try {
        const res = await axios.get('/api/auth/me')
        this.user = res.data.user
        localStorage.setItem('kcm_user', JSON.stringify(this.user))
        // Auto-register device if on office WiFi
        axios.post('/api/attendance/register-device').catch(() => {})
        return this.user
      } catch (err) {
        this.logout()
        return null
      }
    }
  }
})
