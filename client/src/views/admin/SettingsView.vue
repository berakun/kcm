<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <AppTopbar title="Pengaturan Sistem" />
      <div class="p-8 flex-grow space-y-6 overflow-y-auto max-w-2xl">

        <!-- Role-Based Menu Access -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div>
            <h3 class="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">admin_panel_settings</span>
              Akses Menu per Role
            </h3>
            <p class="text-[10px] text-gray-400 mt-1">Aktifkan/nonaktifkan menu di sidebar berdasarkan role pengguna.</p>
          </div>

          <!-- Role Tabs -->
          <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button 
              v-for="role in roles" 
              :key="role.id"
              @click="activeRole = role.id"
              :class="[
                activeRole === role.id 
                  ? 'bg-red-800 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                'px-4 py-1.5 rounded-lg text-xs font-bold transition-colors'
              ]"
            >
              {{ role.label }}
            </button>
          </div>

          <!-- Menu Toggles -->
          <div class="space-y-2">
            <div v-for="menu in menuList" :key="menu.id" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-gray-400 text-[18px]">{{ menu.icon }}</span>
                <div>
                  <span class="text-xs font-semibold text-gray-800 dark:text-white">{{ menu.label }}</span>
                  <span class="text-[10px] text-gray-400 ml-2">{{ menu.id }}</span>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="isEnabled(menu.id, activeRole)" 
                  @change="toggleMenu(menu.id, activeRole, $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
          </div>

          <!-- Note -->
          <div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4">
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-amber-600 text-sm mt-0.5">info</span>
              <p class="text-[10px] text-amber-700 dark:text-amber-400">
                Menu yang dinonaktifkan akan tersembunyi dari sidebar pengguna dengan role tersebut. Super Admin selalu memiliki akses penuh.
              </p>
            </div>
          </div>
        </div>

        <!-- WiFi Settings -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div>
            <h3 class="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">wifi</span>
              Setelan WiFi Kantor (IP Whitelist)
            </h3>
            <p class="text-[10px] text-gray-400 mt-1">IP WiFi kantor untuk validasi absensi karyawan.</p>
          </div>

          <div class="space-y-2">
            <div v-for="ip in officeIps" :key="ip" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span class="text-xs font-mono font-bold text-gray-800 dark:text-white">{{ ip }}</span>
              </div>
              <span class="text-[9px] font-bold text-emerald-600 uppercase">Active</span>
            </div>
            <div v-if="officeIps.length === 0" class="text-center py-6 text-xs text-gray-400">
              Belum ada IP yang terdaftar.
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'

const api = useApi()
const appStore = useAppStore()

// ─── Menu Access ───
const roles = [
  { id: 'admin', label: 'Admin' },
  { id: 'staff', label: 'Staff' }
]

const menuList = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'users', label: 'Users', icon: 'group' },
  { id: 'portfolio', label: 'Portfolio', icon: 'gallery_thumbnail' },
  { id: 'rab', label: 'RAB / Anggaran', icon: 'calculate' },
  { id: 'po-belanja', label: 'PO Belanja', icon: 'receipt_long' },
  { id: 'kwitansi-invoice', label: 'Kwitansi & Invoice', icon: 'description' },
  { id: 'financial', label: 'Keuangan', icon: 'payments' },
  { id: 'attendance', label: 'Absensi', icon: 'calendar_month' },
  { id: 'attendance-rekap', label: 'Rekap Absensi', icon: 'assignment' },
  { id: 'salary', label: 'Slip Gaji', icon: 'paid' },
  { id: 'settings', label: 'Pengaturan', icon: 'settings' }
]

const activeRole = ref('admin')
const accessMap = ref({}) // { "role:menu_id": boolean }

function isEnabled(menuId, role) {
  const key = `${role}:${menuId}`
  if (key in accessMap.value) return accessMap.value[key]
  return true // default: enabled
}

async function toggleMenu(menuId, role, enabled) {
  const key = `${role}:${menuId}`
  accessMap.value[key] = enabled
  try {
    await api.put('/api/menu-access', { menu_id: menuId, role, enabled })
    window.dispatchEvent(new Event('menu-access-changed'))
    appStore.showAlert(`${menuId} → ${role}: ${enabled ? 'Aktif' : 'Nonaktif'}`, 'success')
  } catch (err) {
    // revert on error
    accessMap.value[key] = !enabled
    appStore.showAlert('Gagal update akses menu.', 'error')
  }
}

async function loadMenuAccess() {
  try {
    accessMap.value = await api.get('/api/menu-access')
  } catch (e) { console.error(e) }
}

// ─── WiFi ───
const officeIps = ref([])

async function fetchWifiStatus() {
  try {
    const data = await api.get('/api/attendance/check-wifi?t=' + Date.now())
    officeIps.value = data.officeIps || []
  } catch (err) {
    appStore.showAlert('Gagal mengambil status WiFi.', 'error')
  }
}

onMounted(async () => {
  await Promise.all([loadMenuAccess(), fetchWifiStatus()])
})
</script>
