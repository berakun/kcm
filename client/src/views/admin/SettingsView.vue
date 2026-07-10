<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <AppTopbar title="Pengaturan Sistem" />
      <div class="p-8 flex-grow space-y-6 overflow-y-auto max-w-xl">
        <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-6">
          <div>
            <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">wifi</span>
              <span>Setelan WiFi Kantor (IP Whitelist)</span>
            </h3>
            <p class="text-[10px] text-gray-400 mt-1 leading-relaxed">
              Absensi karyawan divalidasi berdasarkan IP publik WiFi kantor. IP yang diizinkan terdaftar di file konfigurasi server (.env). Hubungi administrator untuk menambah/mengubah IP.
            </p>
          </div>

          <div class="space-y-3">
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

          <div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4">
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-amber-600 text-sm mt-0.5">info</span>
              <div>
                <p class="text-[10px] font-bold text-amber-800 dark:text-amber-500">Catatan</p>
                <p class="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                  IP WiFi kantor bisa berubah. Jika karyawan tidak bisa absen, pastikan IP publik mereka terdaftar di sini. IP dapat dilihat di kartu status WiFi pada halaman absensi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'

const api = useApi()
const appStore = useAppStore()

const officeIps = ref([])

onMounted(async () => {
  await fetchWifiStatus()
})

async function fetchWifiStatus() {
  try {
    const data = await api.get('/api/attendance/check-wifi?t=' + Date.now())
    officeIps.value = data.officeIps || []
  } catch (err) {
    appStore.showAlert('Gagal mengambil status WiFi.', 'error')
  }
}
</script>
