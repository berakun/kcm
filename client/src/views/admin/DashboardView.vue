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
          <router-link to="/admin/users" v-if="isSuperAdmin" class="flex items-center justify-between bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
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

        <!-- Admin Attendance Check-in/out (admin only, not superadmin) - styled like staff version -->
        <div v-if="isAdminOnly" class="space-y-4">
          <!-- Welcome-style header for attendance -->
          <div class="bg-gradient-to-r from-red-900 to-red-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div class="relative z-10 space-y-1">
              <span class="text-[9px] uppercase font-bold tracking-widest text-amber-500">Kehadiran Harian</span>
              <h2 class="text-xl font-bold">Absensi Hari Ini</h2>
              <p class="text-xs text-gray-200">{{ todayDate }}</p>
            </div>
            <div class="absolute -right-16 -bottom-16 w-44 h-44 bg-red-800/20 rounded-full blur-2xl"></div>
          </div>

          <!-- Clock & Check-in/out Buttons -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <div class="font-mono text-3xl font-black text-gray-800 dark:text-white tracking-tight tabular-nums">
              {{ currentTime }}
            </div>

            <button 
              v-if="!todayStatus.checkedIn"
              @click="checkIn" 
              :disabled="loadingAbsen || gpsLoading"
              class="w-28 h-28 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-200"
            >
              <span class="material-symbols-outlined text-[40px]">login</span>
              <span class="text-[10px] font-bold tracking-wider mt-0.5">CHECK IN</span>
            </button>
            <button 
              v-else-if="!todayStatus.checkedOut"
              @click="checkOut"
              :disabled="loadingAbsen || gpsLoading"
              class="w-28 h-28 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-200"
            >
              <span class="material-symbols-outlined text-[40px]">logout</span>
              <span class="text-[10px] font-bold tracking-wider mt-0.5">CHECK OUT</span>
            </button>
            <div v-else class="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 flex flex-col items-center justify-center shadow-inner border border-gray-150 dark:border-gray-800">
              <span class="material-symbols-outlined text-[40px]">check_circle</span>
              <span class="text-[9px] font-bold tracking-wider uppercase mt-1">SELESAI</span>
            </div>

            <p class="text-[10px] text-gray-400">
              {{ gpsLoading ? 'Sedang mengakses lokasi GPS...' : 'Pastikan Anda berada dalam radius kantor.' }}
            </p>
          </div>

          <!-- GPS Geofence Status -->
          <div class="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500">
                <span class="material-symbols-outlined text-lg">location_on</span>
              </div>
              <div>
                <div class="text-[10px] font-bold text-gray-400 uppercase">Geofencing Status</div>
                <div class="text-xs font-bold mt-0.5 flex items-center gap-1" :class="gpsResult?.status === 'di_kantor' ? 'text-emerald-700' : 'text-amber-700'">
                  <span class="material-symbols-outlined text-sm">{{ gpsResult?.status === 'di_kantor' ? 'verified' : 'warning' }}</span>
                  <span>
                    {{ 
                      gpsResult?.status === 'di_kantor' ? 'Di Area Kantor' : 
                      gpsResult?.status === 'luar_kantor' ? 'Di Luar Area' : 
                      gpsResult?.status === 'error' ? (gpsResult.message || 'GPS Tidak Aktif') : 
                      'Memuat...' 
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-[9px] font-bold text-gray-400 uppercase">Jarak</div>
              <div class="text-sm font-black text-gray-850 dark:text-white">
                {{ gpsResult?.distance !== undefined ? gpsResult.distance + ' m' : '-- m' }}
              </div>
            </div>
          </div>

          <!-- Today's Attendance Detail -->
          <div class="bg-white dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden">
            <div class="px-4 py-3 bg-gray-50/60 dark:bg-gray-900/10 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detail Presensi Hari Ini</span>
              <span class="material-symbols-outlined text-sm text-red-800 dark:text-red-500">info</span>
            </div>
            <div class="grid grid-cols-3 divide-x divide-gray-150 dark:divide-gray-800 text-center py-4">
              <div>
                <div class="text-[9px] font-bold text-gray-400 uppercase">Check-In</div>
                <div class="text-xs font-black mt-1" :class="todayStatus.checkedIn ? 'text-emerald-600' : 'text-gray-400'">
                  {{ todayStatus.checkIn || '--:--' }}
                </div>
              </div>
              <div>
                <div class="text-[9px] font-bold text-gray-400 uppercase">Check-Out</div>
                <div class="text-xs font-black mt-1" :class="todayStatus.checkedOut ? 'text-red-700' : 'text-gray-400'">
                  {{ todayStatus.checkOut || '--:--' }}
                </div>
              </div>
              <div>
                <div class="text-[9px] font-bold text-gray-400 uppercase">Durasi Kerja</div>
                <div class="text-xs font-black mt-1" :class="todayStatusRaw?.duration ? 'text-emerald-600' : 'text-gray-400'">
                  {{ todayStatusRaw?.duration || '0j' }}
                </div>
              </div>
            </div>
            <!-- Status text -->
            <div class="text-center pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
              <span class="text-[10px] font-bold uppercase tracking-wider" :class="
                todayStatus.checkedOut ? 'text-emerald-600' :
                todayStatus.checkedIn ? 'text-amber-600' : 'text-gray-400'
              ">
                {{ todayStatus.checkedOut ? 'Sudah clock-out' : todayStatus.checkedIn ? 'Sudah clock-in' : 'Belum absen' }}
              </span>
            </div>
          </div>

          <p v-if="absenMsg" :class="['text-xs mt-2 text-center', absenError ? 'text-red-500' : absenWarning ? 'text-amber-600' : 'text-emerald-600']">{{ absenMsg }}</p>
        </div>

        <!-- Graphs and Attendance Logs (superadmin only) -->
        <div v-if="isSuperAdmin" class="grid grid-cols-1 gap-8">
          <!-- Graph -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm lg:col-span-2">
            <h3 class="font-bold text-sm mb-6 text-gray-900 dark:text-white">Statistik Kehadiran Karyawan</h3>
            <div class="h-64">
              <canvas id="attendanceChart"></canvas>
            </div>
          </div>

          <!-- Daily presence log list (last 7 days) -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm lg:col-span-3">
            <h3 class="font-bold text-sm mb-4 text-gray-900 dark:text-white">Absensi 7 Hari Terakhir</h3>
            <div v-if="attendanceList.length === 0" class="text-center py-12 text-xs text-gray-400">
              Belum ada data absensi.
            </div>
            <div v-else class="overflow-y-auto max-h-80">
              <table class="w-full text-left text-[11px]">
                <thead>
                  <tr class="border-b border-gray-150 dark:border-gray-800 text-gray-400 uppercase tracking-wider text-[9px]">
                    <th class="pb-2 font-bold">Nama</th>
                    <th class="pb-2 font-bold">Tanggal</th>
                    <th class="pb-2 font-bold">Clock In</th>
                    <th class="pb-2 font-bold">Clock Out</th>
                    <th class="pb-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in attendanceList" :key="log.id" class="border-b border-gray-50 dark:border-gray-800/50 last:border-b-0">
                    <td class="py-2 font-semibold text-gray-900 dark:text-white">{{ log.employee_name }}</td>
                    <td class="py-2 text-gray-500">{{ formatAttendanceDate(log.date) }}</td>
                    <td class="py-2 text-gray-500">{{ log.check_in ? formatTime(log.check_in) : '--:--' }}</td>
                    <td class="py-2 text-gray-500">{{ log.check_out ? formatTime(log.check_out) : '--:--' }}</td>
                    <td class="py-2">
                      <span :class="[
                        log.status === 'di_kantor' 
                          ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' 
                          : 'text-amber-700 bg-amber-50 dark:bg-amber-950/20',
                        'px-2 py-0.5 text-[10px] font-bold rounded-lg'
                      ]">
                        {{ log.status === 'di_kantor' ? 'Hadir' : 'Di Luar' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useAuth } from '../../composables/useAuth'
import { useApi } from '../../composables/useApi'
import { useGps } from '../../composables/useGps'
import { formatTime, formatDate } from '../../utils/helpers'
import Chart from 'chart.js/auto'

const { user } = useAuth()
const api = useApi()
const { getCurrentPosition, loading: gpsLoading } = useGps()

const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
const isAdminOnly = computed(() => user.value?.role === 'admin')

// Admin attendance state
const currentTime = ref('')
const todayDate = ref('')
const todayStatus = ref({ checkedIn: false, checkedOut: false, checkIn: null, checkOut: null })
const todayStatusRaw = ref(null)
const loadingAbsen = ref(false)
const absenMsg = ref('')
const absenError = ref(false)
const absenWarning = ref(false)
const gpsResult = ref(null)

function formatAttendanceDate(dateStr) {
  if (!dateStr) return ''
  // Handle both "2026-06-25" and "2026-06-25T17:00:00.000Z"
  const d = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
}

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  todayDate.value = formatDate(now)
}

async function loadTodayStatus() {
  if (!isAdminOnly.value) return
  try {
    const data = await api.get('/api/attendance/status')
    todayStatusRaw.value = data
    todayStatus.value = {
      checkedIn: data.has_checked_in,
      checkedOut: data.has_checked_out,
      checkIn: data.data?.check_in ? data.data.check_in.split(' ')[1]?.substring(0, 5) : null,
      checkOut: data.data?.check_out ? data.data.check_out.split(' ')[1]?.substring(0, 5) : null
    }
  } catch (e) { /* ignore */ }
}

async function checkIn() {
  loadingAbsen.value = true
  absenMsg.value = ''
  absenWarning.value = false
  try {
    const pos = await getCurrentPosition().catch(err => {
      gpsResult.value = { status: 'error', message: err.message || 'GPS Tidak Aktif' }
      return null
    })
    const payload = pos ? { latitude: pos.latitude, longitude: pos.longitude } : {}
    if (pos) gpsResult.value = pos
    const res = await api.post('/api/attendance/check-in', payload)
    absenMsg.value = res.message || 'Berhasil check-in!'
    absenError.value = false
    absenWarning.value = !!res.warning
    await loadTodayStatus()
  } catch (e) {
    absenMsg.value = e.response?.data?.error || 'Gagal check-in'
    absenError.value = true
  }
  loadingAbsen.value = false
}

async function checkOut() {
  loadingAbsen.value = true
  absenMsg.value = ''
  try {
    const pos = await getCurrentPosition().catch(err => {
      gpsResult.value = { status: 'error', message: err.message || 'GPS Tidak Aktif' }
      return null
    })
    const payload = pos ? { latitude: pos.latitude, longitude: pos.longitude } : {}
    if (pos) gpsResult.value = pos
    await api.post('/api/attendance/check-out', payload)
    absenMsg.value = 'Berhasil check-out!'
    absenError.value = false
    await loadTodayStatus()
  } catch (e) {
    absenMsg.value = e.response?.data?.error || 'Gagal check-out'
    absenError.value = true
  }
  loadingAbsen.value = false
}

const stats = ref([
  { label: 'TOTAL KARYAWAN', val: 0, icon: 'groups' },
  { label: 'PRESENSI HARI INI', val: 0, icon: 'fingerprint' },
  { label: 'PROYEK AKTIF', val: 0, icon: 'construction' },
  { label: 'PORTFOLIO PUBLISHED', val: 0, icon: 'imagesmode' }
])

const attendanceList = ref([])

onMounted(async () => {
  // Start clock for admin attendance
  updateClock()
  setInterval(updateClock, 1000)
  loadTodayStatus()
  // Scan GPS on load for geofence display
  getCurrentPosition()
    .then(pos => { gpsResult.value = pos })
    .catch(err => {
      gpsResult.value = { status: 'error', message: err.message || 'GPS Tidak Aktif' }
    })

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

    // 4. Fetch Attendance list (last 7 days)
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 6)
    const fromStr = weekAgo.toISOString().split('T')[0]
    const toStr = today.toISOString().split('T')[0]
    const logs = await api.get('/api/attendance/admin-list', { from: fromStr, to: toStr })
    attendanceList.value = logs
    // Count today's attendance only for the stat counter
    const todayStr = toStr
    const todayLogs = logs.filter(l => l.date === todayStr)
    stats.value[1].val = todayLogs.length

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
