// client/src/composables/useAuth.js
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  const user = computed(() => store.user)
  const isAuthenticated = computed(() => store.isAuthenticated)
  const isAdmin = computed(() => store.isAdmin)
  const isSuperAdmin = computed(() => store.isSuperAdmin)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  async function login(email, password) {
    const userObj = await store.login(email, password)
    if (['admin', 'super_admin'].includes(userObj.role)) {
      router.push('/admin')
    } else {
      router.push('/absensi')
    }
    return userObj
  }

  function logout() {
    store.logout()
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    loading,
    error,
    login,
    logout
  }
}
