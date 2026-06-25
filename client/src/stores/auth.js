// client/src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('kcm_token') || null,
    user: JSON.parse(localStorage.getItem('kcm_user')) || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user && ['admin', 'super_admin'].includes(state.user.role),
    isSuperAdmin: (state) => state.user && state.user.role === 'super_admin'
  },
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post('/api/auth/login', { username, password })
        const { token, user } = res.data
        
        this.token = token
        this.user = user
        
        localStorage.setItem('kcm_token', token)
        localStorage.setItem('kcm_user', JSON.stringify(user))
        
        // Setup axios authorization headers defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return user
      } catch (err) {
        this.error = err.response?.data?.error || 'Login gagal.'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },


    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('kcm_token')
      localStorage.removeItem('kcm_user')
      delete axios.defaults.headers.common['Authorization']
    },

    async checkAuthStatus() {
      if (!this.token) return null
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      try {
        const res = await axios.get('/api/auth/me')
        this.user = res.data.user
        localStorage.setItem('kcm_user', JSON.stringify(this.user))
        return this.user
      } catch (err) {
        // Token invalid or expired
        this.logout()
        return null
      }
    }
  }
})
