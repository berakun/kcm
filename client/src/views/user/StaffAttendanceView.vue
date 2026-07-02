<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-20">
    <!-- Top App Bar -->
    <header class="bg-white dark:bg-gray-850 text-red-950 dark:text-red-500 w-full sticky top-0 border-b border-gray-200/60 dark:border-gray-800 shadow-sm flex items-center justify-between px-6 h-16 z-50">
      <div class="flex items-center gap-3">
        <img src="/logo-transparent.png" alt="KCM Logo" class="w-12 h-12 rounded-lg object-contain border border-amber-500/20">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-800 dark:text-white leading-none">Portal Kehadiran</span>
          <span class="text-[9px] font-bold tracking-widest text-amber-500 uppercase mt-0.5">Kurnia Cipta Mandiri</span>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Dark Mode Toggle -->
        <button @click="appStore.toggleTheme" class="p-2 rounded-lg text-gray-500 hover:bg-gray-150 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
          <span class="material-symbols-outlined align-middle">
            {{ appStore.darkMode ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <button @click="handleLogout" class="p-2 rounded-lg text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
          <span class="material-symbols-outlined align-middle">logout</span>
        </button>
      </div>
    </header>

    <main class="px-6 mt-6 max-w-md mx-auto space-y-6">
      
      <!-- Welcome Header -->
      <section class="bg-gradient-to-r from-red-900 to-red-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div class="relative z-10 space-y-1">
          <span class="text-[9px] uppercase font-bold tracking-widest text-amber-500">Karyawan Area</span>
          <h2 class="text-xl font-bold">Halo, {{ user?.name || 'Staff' }}!</h2>
          <p class="text-xs text-gray-200">{{ formattedDate }}</p>
        </div>
        <div class="absolute -right-16 -bottom-16 w-44 h-44 bg-red-800/20 rounded-full blur-2xl"></div>
      </section>

      <!-- Real-time Clock Circle & Trigger Button -->
      <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
        <div class="font-mono text-3xl font-black text-gray-800 dark:text-white tracking-tight tabular-nums">
          {{ currentTime }}
        </div>

        <!-- Clock button -->
        <button 
          v-if="!attendanceStatus.has_checked_in" 
          @click="performCheckIn" 
          :disabled="!canCheckIn"
          class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-200"
          :class="canCheckIn 
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        >
          <span class="material-symbols-outlined text-[48px] font-bold">login</span>
          <span class="text-[11px] font-bold tracking-wider">CHECK IN</span>
        </button>

        <button 
          v-else-if="!attendanceStatus.has_checked_out" 
          @click="performCheckOut" 
          :disabled="gpsLoading"
          class="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-200 disabled:opacity-50"
        >
          <span class="material-symbols-outlined text-[48px] font-bold">logout</span>
          <span class="text-[11px] font-bold tracking-wider">CHECK OUT</span>
        </button>

        <div v-else class="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 flex flex-col items-center justify-center shadow-inner border border-gray-150 dark:border-gray-800 select-none">
          <span class="material-symbols-outlined text-[48px]">check_circle</span>
          <span class="text-[10px] font-bold tracking-wider uppercase mt-1">SELESAI</span>
        </div>

        <p class="text-[10px] text-gray-400">
          {{ gpsLoading ? 'Sedang mengakses lokasi GPS...' : 'Pastikan Anda berada dalam radius kantor.' }}
        </p>

        <!-- Tambahkan error message di bawah tombol -->
        <p v-if="!gpsGranted" class="text-red-500 text-[11px] font-medium text-center mt-2 max-w-xs">
          ⚠️ Aktifkan GPS untuk melakukan absensi. Akses lokasi diperlukan.
        </p>
        <p v-else-if="distance !== null && distance > 20" class="text-red-500 text-[11px] font-medium text-center mt-2 max-w-xs">
          🚫 Anda berada di luar radius kantor. Jarak Anda: {{ Math.round(distance) }} meter dari kantor.
        </p>
      </div>

      <!-- Live GPS Geofence Check -->
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

      <!-- Quick Actions Grid (Request Form Triggers) -->
      <div class="grid grid-cols-2 gap-4">
        <button @click="openCashbonModal" class="flex flex-col items-center justify-center p-5 bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all text-center">
          <div class="p-3.5 bg-amber-50 dark:bg-amber-955/40 text-amber-600 rounded-xl mb-2">
            <span class="material-symbols-outlined text-xl">payments</span>
          </div>
          <span class="text-xs font-bold text-gray-800 dark:text-white">Cashbon Lapangan</span>
          <span class="text-[9px] text-gray-400 mt-1">Ajukan dana operasional</span>
        </button>
        <button @click="openLeaveModal" class="flex flex-col items-center justify-center p-5 bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all text-center">
          <div class="p-3.5 bg-indigo-50 dark:bg-indigo-955/40 text-indigo-600 rounded-xl mb-2">
            <span class="material-symbols-outlined text-xl">date_range</span>
          </div>
          <span class="text-xs font-bold text-gray-800 dark:text-white">Ajukan Cuti</span>
          <span class="text-[9px] text-gray-400 mt-1">Mengajukan cuti kerja</span>
        </button>
      </div>

      <!-- Daily Summary Row -->
      <div class="bg-white dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden">
        <div class="px-4 py-3 bg-gray-50/60 dark:bg-gray-900/10 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detail Presensi Hari Ini</span>
          <span class="material-symbols-outlined text-sm text-red-800 dark:text-red-500">info</span>
        </div>
        <div class="grid grid-cols-3 divide-x divide-gray-150 dark:divide-gray-800 text-center py-4">
          <div>
            <div class="text-[9px] font-bold text-gray-400 uppercase">Check-In</div>
            <div class="text-xs font-black text-gray-800 dark:text-white mt-1">
              {{ attendanceStatus.data?.check_in ? formatTime(attendanceStatus.data.check_in) : '--:--' }}
            </div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-gray-400 uppercase">Check-Out</div>
            <div class="text-xs font-black text-gray-800 dark:text-white mt-1">
              {{ attendanceStatus.data?.check_out ? formatTime(attendanceStatus.data.check_out) : '--:--' }}
            </div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-gray-400 uppercase">Durasi Kerja</div>
            <div class="text-xs font-black text-emerald-600 mt-1">
              {{ attendanceStatus.data?.duration || '0j' }}
            </div>
          </div>
        </div>
        <!-- Status text -->
        <div class="text-center px-4 py-2 border-t border-gray-100 dark:border-gray-800">
          <span class="text-[10px] font-bold uppercase tracking-wider" :class="
            attendanceStatus.has_checked_out ? 'text-emerald-600' :
            attendanceStatus.has_checked_in ? 'text-amber-600' : 'text-gray-400'
          ">
            {{ attendanceStatus.has_checked_out ? 'Sudah clock-out' : attendanceStatus.has_checked_in ? 'Sudah clock-in' : 'Belum absen' }}
          </span>
        </div>
        </div>

      <!-- History List -->
      <section class="space-y-3">
        <h3 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Riwayat Kehadiran (30 Hari)</h3>
        
        <div class="space-y-2">
          <div v-if="historyList.length === 0" class="text-center py-8 text-xs text-gray-400">
            Belum ada catatan kehadiran.
          </div>
          <div 
            v-else 
            v-for="log in historyList" 
            :key="log.id"
            class="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-800 flex justify-between items-center"
          >
            <div>
              <div class="text-xs font-bold text-gray-800 dark:text-white">{{ formatDate(log.date) }}</div>
              <div class="text-[10px] text-gray-400 mt-0.5">
                Jam Kerja: {{ log.check_in ? formatTime(log.check_in) : '--:--' }} s/d {{ log.check_out ? formatTime(log.check_out) : '--:--' }}
              </div>
            </div>
            <div class="text-right">
              <span :class="[
                log.status === 'di_kantor' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-amber-700 bg-amber-50 dark:bg-amber-955/20',
                'px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase'
              ]">
                {{ log.status === 'di_kantor' ? 'Kantor' : 'Luar' }}
              </span>
              <div class="text-[9px] font-semibold text-gray-400 mt-1 font-mono">
                {{ log.duration || '--:--:--' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Leave History List -->
      <section class="space-y-3">
        <h3 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Riwayat Pengajuan Cuti</h3>
        
        <div class="space-y-2">
          <div v-if="filteredLeaveHistory.length === 0" class="text-center py-8 text-xs text-gray-400">
            Belum ada pengajuan cuti.
          </div>
          <div 
            v-else 
            v-for="leave in filteredLeaveHistory" 
            :key="leave.id"
            class="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-800 flex justify-between items-center"
          >
            <div>
              <div class="text-xs font-bold text-gray-800 dark:text-white">
                {{ formatDate(leave.start_date) }} s/d {{ formatDate(leave.end_date) }}
              </div>
              <div class="text-[10px] text-gray-400 mt-1">
                Alasan: {{ leave.reason }}
              </div>
            </div>
            <div class="text-right">
              <span :class="[
                leave.status === 'approved' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' :
                leave.status === 'rejected' ? 'text-red-700 bg-red-50 dark:bg-red-955/20' :
                'text-amber-700 bg-amber-50 dark:bg-amber-955/20',
                'px-2.5 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider'
              ]">
                {{ 
                  leave.status === 'approved' ? 'Disetujui' : 
                  leave.status === 'rejected' ? 'Ditolak' : 'Pending' 
                }}
              </span>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Modal Form: Request Cashbon -->
    <BaseModal :show="showCashbonModal" title="Pengajuan Cashbon Baru" @close="closeCashbonModal">
      <form @submit.prevent="submitCashbon" class="p-6 space-y-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Penerima Dana (Nama Rekening/Karyawan)</label>
          <input v-model="cashbonForm.recipient" type="text" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Contoh: Budi (Operasional Mandiri)"/>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Tanggal</label>
            <input v-model="cashbonForm.date" type="date" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Nominal Dana (Rp)</label>
            <input v-model.number="cashbonForm.amount" type="number" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Rp"/>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Deskripsi Keperluan Proyek</label>
          <input v-model="cashbonForm.description" type="text" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Contoh: Pembelian bensin & konsumsi lapangan"/>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Unggah Nota / Rincian Bukti (Opsional)</label>
          <input type="file" @change="handleFileChange" accept="image/*" class="w-full rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs p-2 focus:ring-0"/>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeCashbonModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Kirim Pengajuan
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Modal Form: Request Leave -->
    <BaseModal :show="showLeaveModal" title="Pengajuan Cuti Baru" @close="closeLeaveModal">
      <form @submit.prevent="submitLeave" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Tanggal Mulai</label>
            <input v-model="leaveForm.start_date" type="date" :min="todayMinDate" required class="w-full rounded-lg border border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Tanggal Selesai</label>
            <input v-model="leaveForm.end_date" type="date" :min="leaveForm.start_date || todayMinDate" required class="w-full rounded-lg border border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Alasan Pengajuan Cuti</label>
          <textarea v-model="leaveForm.reason" required rows="3" class="w-full rounded-lg border border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Jelaskan keperluan cuti Anda secara singkat..."></textarea>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeLeaveModal" class="px-5 py-2.5 rounded-lg border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-md">
            Kirim Pengajuan
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import BaseModal from '../../components/ui/BaseModal.vue'
import { useAuth } from '../../composables/useAuth'
import { useApi } from '../../composables/useApi'
import { useGps } from '../../composables/useGps'
import { useAppStore } from '../../stores/app'
import { formatDate, formatCurrency } from '../../utils/helpers'

const { user, logout } = useAuth()
const api = useApi()
const { getCurrentPosition, loading: gpsLoading } = useGps()
const appStore = useAppStore()

const currentTime = ref('00:00:00')
const formattedDate = computed(() => formatDate(new Date()))
let clockTimer = null

const attendanceStatus = ref({
  has_checked_in: false,
  has_checked_out: false,
  data: null
})

const historyList = ref([])
const gpsResult = ref(null)

const gpsGranted = computed(() => {
  return gpsResult.value !== null && gpsResult.value.status !== 'error'
})

const distance = computed(() => {
  return (gpsResult.value && gpsResult.value.distance !== undefined) ? gpsResult.value.distance : null
})

const canCheckIn = computed(() => {
  return gpsGranted.value && distance.value !== null && distance.value <= 20
})

// Forms
const showCashbonModal = ref(false)
const cashbonForm = ref({
  recipient: '',
  date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
  amount: 0,
  description: '',
  proof_file: null
})

const showLeaveModal = ref(false)
const leaveForm = ref({
  start_date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
  end_date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
  reason: ''
})
const leaveHistoryList = ref([])

const todayMinDate = computed(() => {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' })
})

const filteredLeaveHistory = computed(() => {
  return leaveHistoryList.value.filter(leave => {
    return leave.start_date && 
           leave.end_date && 
           leave.start_date !== '0000-00-00' && 
           leave.end_date !== '0000-00-00' &&
           String(leave.start_date).trim() !== ''
  })
})

onMounted(async () => {
  startClock()
  await fetchStatus()
  await fetchHistory()
  await fetchLeaveHistory()
  await triggerGpsCheck()
})

onBeforeUnmount(() => {
  stopClock()
})

function startClock() {
  clockTimer = setInterval(() => {
    currentTime.value = new Date().toTimeString().split(' ')[0]
  }, 1000)
}

function stopClock() {
  if (clockTimer) clearInterval(clockTimer)
}

async function fetchStatus() {
  try {
    const data = await api.get('/api/attendance/status')
    attendanceStatus.value = data
  } catch (err) {
    console.error('Failed to load presence status.')
  }
}

async function fetchHistory() {
  try {
    const data = await api.get('/api/attendance/history')
    historyList.value = data
  } catch (err) {
    console.error('Failed to load history list.')
  }
}

async function triggerGpsCheck() {
  try {
    const res = await getCurrentPosition()
    gpsResult.value = res
  } catch (err) {
    console.warn('GPS scanning failed:', err.message)
    gpsResult.value = { status: 'error', message: err.message || 'GPS Tidak Aktif' }
  }
}

async function performCheckIn() {
  try {
    const pos = await getCurrentPosition()
    gpsResult.value = pos
    
    const result = await api.post('/api/attendance/check-in', {
      latitude: pos.latitude,
      longitude: pos.longitude
    })
    
    appStore.showAlert(result.message, 'success')
    await fetchStatus()
    await fetchHistory()
  } catch (err) {
    gpsResult.value = { status: 'error', message: err.message || 'GPS Tidak Aktif' }
    appStore.showAlert('Check-In gagal: ' + (err.response?.data?.error || err.message), 'error')
  }
}

async function performCheckOut() {
  if (!confirm('Apakah Anda yakin ingin check-out presensi hari ini?')) return
  try {
    const pos = await getCurrentPosition()
    gpsResult.value = pos
    
    const result = await api.post('/api/attendance/check-out', {
      latitude: pos.latitude,
      longitude: pos.longitude
    })
    
    appStore.showAlert(result.message, 'success')
    await fetchStatus()
    await fetchHistory()
  } catch (err) {
    gpsResult.value = { status: 'error', message: err.message || 'GPS Tidak Aktif' }
    appStore.showAlert('Check-Out gagal: ' + (err.response?.data?.error || err.message), 'error')
  }
}

function handleLogout() {
  if (!window.confirm('Apakah Anda yakin ingin logout?')) return
  logout()
}

// ==========================================
// CASHBON REQUESTS
// ==========================================
function openCashbonModal() {
  cashbonForm.value = {
    recipient: '',
    date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
    amount: 0,
    description: '',
    proof_file: null
  }
  showCashbonModal.value = true
}

function closeCashbonModal() {
  showCashbonModal.value = false
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    cashbonForm.value.proof_file = file
  }
}

async function submitCashbon() {
  if (!cashbonForm.value.recipient || !cashbonForm.value.amount) {
    appStore.showAlert('Recipient and amount are required.', 'error')
    return
  }

  const formData = new FormData()
  formData.append('recipient', cashbonForm.value.recipient)
  formData.append('date', cashbonForm.value.date)
  formData.append('amount', cashbonForm.value.amount)
  formData.append('description', cashbonForm.value.description)
  if (cashbonForm.value.proof_file) {
    formData.append('proof_file', cashbonForm.value.proof_file)
  }

  try {
    const res = await api.post('/api/rab/cashbon', formData, true)
    appStore.showAlert(res.message, 'success')
    closeCashbonModal()
  } catch (err) {
    appStore.showAlert('Gagal mengirim cashbon: ' + (err.response?.data?.error || err.message), 'error')
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '--:--'
  if (typeof dateStr === 'string') {
    const parts = dateStr.split(' ')
    const timePart = parts.length > 1 ? parts[1] : parts[0]
    if (timePart.includes(':')) {
      const t = timePart.split(':')
      return `${t[0].padStart(2, '0')}:${t[1].padStart(2, '0')}`
    }
  }
  try {
    let standardized = dateStr
    if (typeof standardized === 'string' && standardized.includes(' ') && !standardized.includes('T')) {
      standardized = standardized.replace(' ', 'T')
    }
    const d = new Date(standardized)
    if (isNaN(d.getTime())) return '--:--'
    return d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')
  } catch (e) {
    return '--:--'
  }
}

// ==========================================
// LEAVE REQUESTS
// ==========================================
async function fetchLeaveHistory() {
  try {
    const data = await api.get('/api/leaves/my')
    leaveHistoryList.value = data
  } catch (err) {
    console.error('Failed to load leave history list.')
  }
}

function openLeaveModal() {
  leaveForm.value = {
    start_date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
    end_date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
    reason: ''
  }
  showLeaveModal.value = true
}

function closeLeaveModal() {
  showLeaveModal.value = false
}

async function submitLeave() {
  if (!leaveForm.value.start_date || !leaveForm.value.end_date || !leaveForm.value.reason) {
    appStore.showAlert('Semua field wajib diisi.', 'error')
    return
  }
  const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' })
  if (leaveForm.value.start_date < todayStr) {
    appStore.showAlert('Tanggal mulai tidak boleh sebelum hari ini.', 'error')
    return
  }
  if (leaveForm.value.end_date < leaveForm.value.start_date) {
    appStore.showAlert('Tanggal selesai tidak boleh sebelum tanggal mulai.', 'error')
    return
  }
  try {
    const res = await api.post('/api/leaves', leaveForm.value)
    appStore.showAlert(res.message, 'success')
    closeLeaveModal()
    await fetchLeaveHistory()
  } catch (err) {
    appStore.showAlert('Gagal mengirim pengajuan cuti: ' + (err.response?.data?.error || err.message), 'error')
  }
}
</script>
