// client/src/composables/useApi.js
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

export function useApi() {
  const authStore = useAuthStore()

  // Dynamic headers builder
  function getHeaders(isMultipart = false) {
    const headers = {}
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json'
    }
    return { headers }
  }

  return {
    async get(url, params = {}) {
      const res = await axios.get(url, { ...getHeaders(), params })
      return res.data
    },
    async post(url, data = {}, isMultipart = false) {
      const res = await axios.post(url, data, getHeaders(isMultipart))
      return res.data
    },
    async put(url, data = {}) {
      const res = await axios.put(url, data, getHeaders())
      return res.data
    },
    async delete(url, params = {}) {
      const res = await axios.delete(url, { ...getHeaders(), params })
      return res.data
    }
  }
}
