<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col min-h-screen">
      <!-- Topbar Navigation -->
      <AppTopbar title="Manajemen Kehadiran Karyawan" />

      <!-- Content Body -->
      <div class="p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        
        <!-- Controls & Datepicker -->
        <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center space-x-3 w-full sm:w-auto">
            <span class="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Pilih Tanggal:</span>
            <input 
              v-model="selectedDate" 
              type="date"
              @change="fetchDailyLogs"
              class="rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs px-4 py-2 focus:border-red-500 focus:ring-0"
            />
          </div>
        </div>

        <!-- Attendance Stats Counters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Hadir hari ini</p>
              <h3 class="text-2xl font-black mt-2 text-gray-900 dark:text-white">{{ logsList.length }} Karyawan</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hadir di kantor</p>
              <h3 class="text-2xl font-black mt-2 text-emerald-600">{{ logsList.filter(l => l.status === 'di_kantor').length }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">check_circle</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hadir di luar kantor</p>
              <h3 class="text-2xl font-black mt-2 text-amber-600">{{ logsList.filter(l => l.status === 'luar_kantor').length }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-955/20 text-amber-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">hail</span>
            </div>
          </div>
        </div>

        <!-- Attendance logs list table -->
        <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 text-xxs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                  <th class="py-4 px-6">Nama Karyawan</th>
                  <th class="py-4 px-6">Departemen</th>
                  <th class="py-4 px-6 text-center font-semibold">Check-In</th>
                  <th class="py-4 px-6 text-center font-semibold">Check-Out</th>
                  <th class="py-4 px-6 text-center">Durasi</th>
                  <th class="py-4 px-6 text-center">Jarak Geofence</th>
                  <th class="py-4 px-6 text-center">IP Address</th>
                  <th class="py-4 px-6 text-center">Status</th>
                  <th class="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <tr v-if="logsList.length === 0">
                  <td colspan="9" class="py-12 text-center text-gray-400">Tidak ada rekap absensi pada tanggal ini.</td>
                </tr>
                <tr v-else v-for="log in logsList" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-red-900/10 text-red-800 font-bold flex items-center justify-center text-sm uppercase">
                      {{ log.employee_name.charAt(0) }}
                    </div>
                    <span>{{ log.employee_name }}</span>
                  </td>
                  <td class="py-4 px-6 font-medium text-gray-500 dark:text-gray-400">{{ log.department || 'Staff' }}</td>
                  <td class="py-4 px-6 text-center text-emerald-600 font-semibold font-mono">{{ log.check_in ? formatTime(log.check_in) : '--:--' }}</td>
                  <td class="py-4 px-6 text-center text-red-750 font-semibold font-mono">{{ log.check_out ? formatTime(log.check_out) : '--:--' }}</td>
                  <td class="py-4 px-6 text-center font-mono font-medium">{{ log.duration || '--:--:--' }}</td>
                  <td class="py-4 px-6 text-center font-mono font-medium">
                    <span v-if="log.distance !== null">{{ log.distance }} meter</span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="py-4 px-6 text-center text-gray-400 font-mono">{{ log.ip_address || '-' }}</td>
                  <td class="py-4 px-6 text-center">
                    <span :class="[
                      log.status === 'di_kantor' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-amber-700 bg-amber-50 dark:bg-amber-955/20',
                      'px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase'
                    ]">
                      {{ log.status === 'di_kantor' ? 'Di Kantor' : 'Luar Kantor' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <button @click="deleteLog(log.id)" class="text-red-650 hover:text-red-800">
                      <span class="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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

const selectedDate = ref(new Date().toISOString().split('T')[0])
const logsList = ref([])

onMounted(async () => {
  await fetchDailyLogs()
})

async function fetchDailyLogs() {
  try {
    const data = await api.get('/api/attendance/admin-list', { date: selectedDate.value })
    logsList.value = data
  } catch (err) {
    appStore.showAlert('Gagal mengambil data logs presensi.', 'error')
  }
}

async function deleteLog(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus data presensi karyawan ini?')) return
  try {
    await api.delete(`/api/attendance/${id}`)
    appStore.showAlert('Data presensi berhasil dihapus.', 'success')
    await fetchDailyLogs()
  } catch (err) {
    appStore.showAlert('Gagal menghapus log presensi.', 'error')
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' }).split('.').slice(0, 2).join(':')
  } catch (e) {
    return '-'
  }
}
</script>
