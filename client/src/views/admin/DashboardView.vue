<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col min-h-screen">
      <!-- Top Navigation -->
      <AppTopbar title="Beranda Overview" />

      <!-- Dashboard Body -->
      <div class="p-8 flex-grow space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-red-900 to-red-950 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
          <div class="relative z-10 space-y-2">
            <span class="text-xs uppercase font-bold tracking-widest text-amber-500">Panel Administrator</span>
            <h2 class="text-3xl font-bold">Selamat Datang, <span class="text-amber-450">{{ user?.name || 'Admin' }}</span></h2>
            <p class="text-xs text-gray-200 max-w-xl">Berikut ringkasan statistik harian, kehadiran karyawan, dan pemantauan keuangan proyek Kurnia Cipta Mandiri.</p>
          </div>
          <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-red-800/20 rounded-full blur-2xl"></div>
        </div>

        <!-- Quick Action Links -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link to="/admin/users" v-if="user?.role === 'super_admin'" class="flex items-center justify-between bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
            <div class="flex items-center space-x-4">
              <div class="p-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
                <span class="material-symbols-outlined text-2xl">person_add</span>
              </div>
              <div>
                <h4 class="font-bold text-xs text-gray-800 dark:text-white">Kelola Karyawan</h4>
                <p class="text-[10px] text-gray-400 mt-0.5">Tambah & atur hak akses staff</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform text-lg">chevron_right</span>
          </router-link>
          
          <router-link to="/admin/rab" class="flex items-center justify-between bg-white dark:bg-gray-855 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
            <div class="flex items-center space-x-4">
              <div class="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
                <span class="material-symbols-outlined text-2xl">calculate</span>
              </div>
              <div>
                <h4 class="font-bold text-xs text-gray-800 dark:text-white">RAB Builder</h4>
                <p class="text-[10px] text-gray-400 mt-0.5">Buat rancangan anggaran proyek</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform text-lg">chevron_right</span>
          </router-link>

          <router-link to="/admin/financial" class="flex items-center justify-between bg-white dark:bg-gray-855 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
            <div class="flex items-center space-x-4">
              <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                <span class="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div>
                <h4 class="font-bold text-xs text-gray-800 dark:text-white">Laporan Keuangan</h4>
                <p class="text-[10px] text-gray-400 mt-0.5">Lihat laba rugi & pengeluaran</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform text-lg">chevron_right</span>
          </router-link>
        </div>

        <!-- Stats Counters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 relative overflow-hidden" v-for="stat in stats" :key="stat.label">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
            <h3 class="text-3xl font-extrabold mt-2 text-gray-900 dark:text-white">{{ stat.val }}</h3>
            <div class="absolute right-6 top-6 text-gray-150 dark:text-gray-700">
              <span class="material-symbols-outlined text-4xl">{{ stat.icon }}</span>
            </div>
          </div>
        </div>

        <!-- Graphs and Attendance Logs -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Graph -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm lg:col-span-2">
            <h3 class="font-bold text-sm mb-6 text-gray-900 dark:text-white">Statistik Kehadiran Karyawan</h3>
            <div class="h-64">
              <canvas id="attendanceChart"></canvas>
            </div>
          </div>

          <!-- Daily presence log list -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm">
            <h3 class="font-bold text-sm mb-6 text-gray-900 dark:text-white">Absensi Hari Ini</h3>
            <div class="flow-root overflow-y-auto max-h-64 pr-2 space-y-3">
              <div v-if="attendanceList.length === 0" class="text-center py-12 text-xs text-gray-400">
                Belum ada karyawan yang absen hari ini.
              </div>
              <div 
                v-else 
                v-for="log in attendanceList" 
                :key="log.id"
                class="flex items-center space-x-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <div class="flex-grow min-w-0">
                  <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ log.employee_name }}</p>
                  <p class="text-[10px] text-gray-400 truncate">{{ log.department || 'Staff' }}</p>
                </div>
                <div class="text-right text-[10px] font-medium text-gray-500">
                  <div>In: {{ log.check_in ? log.check_in.split(' ')[1].substring(0, 5) : '--:--' }}</div>
                  <div>Out: {{ log.check_out ? log.check_out.split(' ')[1].substring(0, 5) : '--:--' }}</div>
                </div>
                <span :class="[
                  log.status === 'di_kantor' 
                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' 
                    : 'text-amber-700 bg-amber-50 dark:bg-amber-950/20',
                  'px-2.5 py-1 text-[10px] font-bold rounded-lg'
                ]">
                  {{ log.status === 'di_kantor' ? 'Di Kantor' : 'Di Luar' }}
                </span>
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
import { useAuth } from '../../composables/useAuth'
import { useApi } from '../../composables/useApi'
import Chart from 'chart.js/auto'

const { user } = useAuth()
const api = useApi()

const stats = ref([
  { label: 'TOTAL KARYAWAN', val: 0, icon: 'groups' },
  { label: 'PRESENSI HARI INI', val: 0, icon: 'fingerprint' },
  { label: 'PROYEK AKTIF', val: 0, icon: 'construction' },
  { label: 'PORTFOLIO PUBLISHED', val: 0, icon: 'imagesmode' }
])

const attendanceList = ref([])

onMounted(async () => {
  try {
    // 1. Fetch Total Users
    const users = await api.get('/api/users')
    stats.value[0].val = users.length

    // 2. Fetch Active Projects (dikerjakan)
    const rabs = await api.get('/api/rab')
    stats.value[2].val = rabs.filter(r => r.status === 'dikerjakan').length

    // 3. Fetch Portfolios
    const portfolios = await api.get('/api/portfolio?status=published')
    stats.value[3].val = portfolios.length

    // 4. Fetch Attendance list
    const todayStr = new Date().toISOString().split('T')[0]
    const logs = await api.get('/api/attendance/admin-list', { date: todayStr })
    attendanceList.value = logs
    stats.value[1].val = logs.length

    // Render chart
    renderChart()
  } catch (err) {
    console.error('Dashboard load failed:', err)
  }
})

function renderChart() {
  const ctx = document.getElementById('attendanceChart').getContext('2d')
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
      datasets: [{
        label: 'Kehadiran Karyawan (Orang)',
        data: [12, 14, 13, 15, 14],
        backgroundColor: 'rgba(153, 27, 27, 0.1)',
        borderColor: '#991b1b',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(156, 163, 175, 0.1)' }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  })
}
</script>
