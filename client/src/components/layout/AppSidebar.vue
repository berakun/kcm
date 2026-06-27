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
    <div>
      <!-- Brand Logo Header -->
      <div class="flex items-center space-x-3 px-6 py-5 border-b border-red-900/60 bg-red-900/10">
        <img src="/logo-transparent.png" alt="KCM Logo" class="w-12 h-12 rounded-lg object-contain">
        <div>
          <h2 class="font-bold text-sm tracking-wide leading-none text-white">Kurnia Cipta Mandiri</h2>
          <span class="text-[9px] text-amber-500 font-medium tracking-widest uppercase block mt-0.5">Interior & Renov</span>
        </div>
      </div>

      <!-- User Profile Box -->
      <div class="px-6 py-4 flex items-center space-x-3 border-b border-red-900/40 bg-red-900/5" v-if="user">
        <div class="w-10 h-10 rounded-full bg-red-900/60 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 text-lg uppercase">
          {{ user.name.charAt(0) }}
        </div>
        <div class="overflow-hidden">
          <div class="font-semibold text-sm text-gray-100 truncate">{{ user.name }}</div>
          <div class="text-[10px] text-amber-400 font-medium capitalize mt-0.5">{{ user.role.replace('_', ' ') }}</div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="mt-4 px-4 space-y-1">
        <router-link 
          v-for="link in filterLinks" 
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
                ? 'bg-amber-600 text-white shadow-md font-medium' 
                : 'text-red-100 hover:bg-red-900/40 hover:text-white',
              'flex items-center space-x-3 px-4 py-3 rounded-lg text-xs transition-all duration-200'
            ]"
          >
            <span class="material-symbols-outlined text-lg">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </a>
        </router-link>
      </nav>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-red-900/60 bg-red-950">
      <button 
        @click="onLogout" 
        class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-red-850 hover:bg-red-900/40 hover:border-red-750 text-red-100 text-xs font-semibold transition-colors"
      >
        <span class="material-symbols-outlined text-base">logout</span>
        <span>Log Out</span>
      </button>
      <div class="text-center text-gray-500 text-[9px] mt-3 tracking-wide">
        © 2026 Kurnia Cipta Mandiri
      </div>
    </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
const route = useRoute()

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
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    url: '/admin',
    roles: ['super_admin', 'admin']
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'group',
    url: '/admin/users',
    roles: ['super_admin']
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: 'gallery_thumbnail',
    url: '/admin/portfolio',
    roles: ['admin', 'super_admin']
  },
  {
    id: 'rab',
    label: 'RAB / Anggaran',
    icon: 'calculate',
    url: '/admin/rab',
    roles: ['admin', 'super_admin']
  },
  {
    id: 'po-belanja',
    label: 'PO Belanja',
    icon: 'receipt_long',
    url: '/admin/po-belanja',
    roles: ['admin', 'super_admin']
  },
  {
    id: 'financial',
    label: 'Keuangan',
    icon: 'payments',
    url: '/admin/financial',
    roles: ['super_admin']
  },
  {
    id: 'attendance',
    label: 'Absensi',
    icon: 'calendar_month',
    url: '/admin/attendance',
    roles: ['super_admin']
  },
  {
    id: 'attendance-rekap',
    label: 'Rekap Absensi',
    icon: 'assignment',
    url: '/admin/attendance/rekap',
    roles: ['admin', 'super_admin']
  },
  {
    id: 'salary',
    label: 'Slip Gaji',
    icon: 'paid',
    url: '/admin/salary',
    roles: ['super_admin']
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    icon: 'settings',
    url: '/admin/settings',
    roles: ['super_admin']
  }
]

const filterLinks = computed(() => {
  if (!user.value) return []
  return allLinks.filter(link => link.roles.includes(user.value.role))
})

function onLogout() {
  if (!window.confirm('Apakah Anda yakin ingin logout?')) return
  logout()
}
</script>
