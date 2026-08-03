<template>
  <div>
    <!-- Backdrop overlay — muncul saat sidebar open di mobile -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 lg:static h-screen lg:h-full flex flex-col justify-between bg-red-950 text-white w-64 shadow-xl select-none transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
    <div ref="scrollContainer" class="flex-grow overflow-y-auto scrollbar-hide" @scroll="onScroll">
      <!-- Brand Logo Header -->
      <div class="flex items-center space-x-3 px-5 py-4 border-b border-red-900/50">
        <img src="/logo-transparent.png" alt="KCM Logo" class="w-11 h-11 rounded-lg object-contain">
        <div>
          <h2 class="font-bold text-[13px] tracking-wide leading-none text-white">Kurnia Cipta Mandiri</h2>
          <span class="text-[9px] text-amber-400 font-semibold tracking-widest uppercase block mt-0.5">Interior & Renov</span>
        </div>
      </div>

      <!-- User Profile Box -->
      <div class="px-5 py-3 flex items-center space-x-3 border-b border-red-900/40" v-if="user">
        <div class="w-9 h-9 rounded-full bg-red-900/60 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 text-sm uppercase">
          {{ user.name.charAt(0) }}
        </div>
        <div class="overflow-hidden">
          <div class="font-semibold text-[13px] text-gray-100 truncate leading-tight">{{ user.name }}</div>
          <div class="text-[10px] text-amber-400 font-medium capitalize mt-0.5">{{ user.role.replace('_', ' ') }}</div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="px-3 py-3 space-y-0.5">
        <router-link 
          v-for="link in visibleLinks" 
          :key="link.id" 
          :to="link.url"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a 
            :href="href" 
            @click="navigate" 
            :class="[
              isActive 
                ? 'bg-amber-600/90 text-white shadow-sm' 
                : 'text-red-100 hover:bg-red-900/40 hover:text-white',
              'flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-150'
            ]"
          >
            <span class="material-symbols-outlined text-[18px] leading-none">{{ link.icon }}</span>
            <span class="text-[13px] font-medium leading-tight">{{ link.label }}</span>
          </a>
        </router-link>
      </nav>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-red-900/50">
      <button 
        @click="onLogout" 
        class="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-red-800/60 hover:bg-red-900/40 text-red-200 text-[13px] font-medium transition-colors"
      >
        <span class="material-symbols-outlined text-[18px] leading-none">logout</span>
        <span>Log Out</span>
      </button>
      <div class="text-center text-red-800 text-[9px] mt-2 tracking-wide">
        © 2026 Kurnia Cipta Mandiri
      </div>
    </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useAppStore } from '../../stores/app'
import { useApi } from '../../composables/useApi'

const appStore = useAppStore()
const route = useRoute()
const api = useApi()

const scrollContainer = ref(null)

function onScroll(e) {
  sessionStorage.setItem('sidebar_scroll_top', e.target.scrollTop)
}

onMounted(() => {
  const savedScroll = sessionStorage.getItem('sidebar_scroll_top')
  if (savedScroll && scrollContainer.value) {
    scrollContainer.value.scrollTop = parseInt(savedScroll, 10)
  }
  loadMenuAccess()
})

const sidebarOpen = computed({
  get: () => appStore.sidebarOpen,
  set: (val) => {
    if (!val) appStore.closeSidebar()
  }
})

watch(() => route.path, () => {
  appStore.closeSidebar()
})

const { user, logout } = useAuth()

const allLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', url: '/admin', roles: ['super_admin', 'admin'] },
  { id: 'users', label: 'Users', icon: 'group', url: '/admin/users', roles: ['super_admin'] },
  { id: 'portfolio', label: 'Portfolio', icon: 'gallery_thumbnail', url: '/admin/portfolio', roles: ['admin', 'super_admin'] },
  { id: 'rab', label: 'RAB / Anggaran', icon: 'calculate', url: '/admin/rab', roles: ['admin', 'super_admin'] },
  { id: 'po-belanja', label: 'PO Belanja', icon: 'receipt_long', url: '/admin/po-belanja', roles: ['admin', 'super_admin'] },
  { id: 'kwitansi-invoice', label: 'Kwitansi & Invoice', icon: 'description', url: '/admin/kwitansi-invoice', roles: ['super_admin'] },
  { id: 'financial', label: 'Keuangan', icon: 'payments', url: '/admin/financial', roles: ['super_admin'] },
  { id: 'attendance', label: 'Absensi', icon: 'calendar_month', url: '/admin/attendance', roles: ['super_admin'] },
  { id: 'attendance-rekap', label: 'Rekap Absensi', icon: 'assignment', url: '/admin/attendance/rekap', roles: ['admin', 'super_admin'] },
  { id: 'salary', label: 'Slip Gaji', icon: 'paid', url: '/admin/salary', roles: ['super_admin'] },
  { id: 'settings', label: 'Pengaturan', icon: 'settings', url: '/admin/settings', roles: ['super_admin'] }
]

// Menu access from DB: { menu_id: boolean }
const menuAccess = ref({})

async function loadMenuAccess() {
  try {
    const data = await api.get('/api/menu-access')
    menuAccess.value = data || {}
  } catch (e) {
    // fallback: use hardcoded roles
    menuAccess.value = {}
  }
}

const visibleLinks = computed(() => {
  if (!user.value) return []
  const role = user.value.role
  
  return allLinks.filter(link => {
    // Check base role permission
    if (!link.roles.includes(role)) return false
    // Check DB override (if key exists and is false, hide it)
    const key = `${role}:${link.id}`
    if (key in menuAccess.value) return menuAccess.value[key]
    return true
  })
})

function onLogout() {
  if (!window.confirm('Apakah Anda yakin ingin logout?')) return
  logout()
}
</script>
