<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <main class="flex-grow flex flex-col min-h-screen">
      <AppTopbar title="Slip Gaji Karyawan" />
      <div class="p-6 md:p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">

        <!-- Filter -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tanggal Mulai</label>
              <input v-model="filterDateStart" type="date" @change="onDateRangeChange" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0"/>
            </div>
            <div class="flex items-center pb-1"><span class="text-gray-400 text-xs">→</span></div>
            <div class="flex-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tanggal Selesai</label>
              <input v-model="filterDateEnd" type="date" @change="onDateRangeChange" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0"/>
            </div>
            <div class="flex-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Bulan (Shortcut)</label>
              <select v-model="selectedMonth" @change="loadData" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="cetakSemua" :disabled="tableRows.length === 0" class="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50">
                <span class="material-symbols-outlined text-sm">print</span> Cetak Semua
              </button>
            </div>
          </div>
        </div>

        <!-- Pengaturan Gaji Toggle (superadmin only) -->
        <div v-if="isSuperAdmin">
          <button @click="showSettings = !showSettings" class="px-4 py-2 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="material-symbols-outlined text-sm">settings</span>
            {{ showSettings ? 'Tutup Pengaturan' : 'Pengaturan Gaji' }}
          </button>
        </div>

        <!-- Pengaturan Gaji Panel -->
        <div v-if="isSuperAdmin && showSettings" class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-base">payments</span> Pengaturan Gaji Per Role
          </h3>

          <div v-for="role in availableRoles" :key="role.key" class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-gray-500 uppercase">{{ role.label }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Gaji Pokok</label>
                <input type="number" v-model.number="salarySettings[role.key].gajiPokok" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Makan & Transport</label>
                <input type="number" v-model.number="salarySettings[role.key].makanTransport" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Kesehatan</label>
                <input type="number" v-model.number="salarySettings[role.key].tunjanganKesehatan" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Jabatan</label>
                <input type="number" v-model.number="salarySettings[role.key].tunjanganJabatan" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Hari Raya</label>
                <input type="number" v-model.number="salarySettings[role.key].tunjanganHariRaya" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
            </div>
          </div>

          <!-- Rates Section -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-gray-500 uppercase">Rate Lembur & Potongan</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Lembur per Jam</label>
                <input type="number" v-model.number="salarySettings._rates.lemburJam" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Lembur per Hari</label>
                <input type="number" v-model.number="salarySettings._rates.lemburHari" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Libur per Hari</label>
                <input type="number" v-model.number="salarySettings._rates.libur" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Terlambat (10 menit)</label>
                <input type="number" v-model.number="salarySettings._rates.terlambat" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Absen Setengah Hari</label>
                <input type="number" v-model.number="salarySettings._rates.absenSetengah" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tidak Hadir (1 Hari)</label>
                <input type="number" v-model.number="salarySettings._rates.tidakHadir" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="saveSettings" class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">save</span> Simpan Pengaturan
            </button>
            <button @click="resetSettings" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">restart_alt</span> Reset Default
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">
          <span class="material-symbols-outlined animate-spin text-lg mb-2 block">progress_activity</span> Memuat data...
        </div>

        <!-- Employee Table -->
        <div v-if="!loading && tableRows.length > 0" class="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Jabatan</th>
                  <th class="px-4 py-3 text-right">Gaji Pokok</th>
                  <th class="px-4 py-3 text-right">Makan & Transport</th>
                  <th class="px-4 py-3 text-right">Tunjangan</th>
                  <th class="px-4 py-3 text-right">Potongan</th>
                  <th class="px-4 py-3 text-right">Total Diterima</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-for="(row, idx) in tableRows" :key="row.userId" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="px-4 py-3 text-center font-bold text-gray-600 dark:text-gray-400">{{ idx + 1 }}</td>
                  <td class="px-4 py-3 font-bold text-gray-800 dark:text-white">{{ row.name }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ row.roleLabel }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(row.gajiPokok) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(row.makanTransport) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(row.tunjangan) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-red-600">-{{ formatCurrency(row.potongan) }}</td>
                  <td class="px-4 py-3 text-right font-mono font-bold text-red-700 dark:text-red-500">{{ formatCurrency(row.totalDiterima) }}</td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button @click="cetakSlip(row)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-700" title="Cetak Slip">
                        <span class="material-symbols-outlined text-base">print</span>
                      </button>
                      <button @click="openEditModal(row)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-700" title="Edit Data">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-50 dark:bg-gray-800 font-bold text-xs">
                  <td class="px-4 py-3 text-center text-gray-500" colspan="3">TOTAL</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(totalGajiPokok) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(totalMakanTransport) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(totalTunjangan) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-red-600">-{{ formatCurrency(totalPotongan) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-red-700 dark:text-red-500">{{ formatCurrency(totalDiterima) }}</td>
                  <td class="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && tableRows.length === 0 && users.length > 0" class="text-center py-12 text-gray-400 text-sm">
          Pilih bulan untuk melihat data gaji karyawan.
        </div>

      </div>
    </main>

    <!-- Edit Modal -->
    <div v-if="editModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="editModal.show = false"></div>
      <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6 space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black text-gray-800 dark:text-white">Edit Data Karyawan</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ editModal.name }} — {{ editModal.roleLabel }}</p>
          </div>
          <button @click="editModal.show = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Jumlah Cuti (hari)</label>
            <input type="number" v-model.number="editModal.cuti" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Libur Tahunan (hari)</label>
            <input type="number" v-model.number="editModal.liburTahunan" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Kesehatan</label>
            <input type="number" v-model.number="editModal.tunjanganKesehatan" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Jabatan</label>
            <input type="number" v-model.number="editModal.tunjanganJabatan" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Hari Raya</label>
            <input type="number" v-model.number="editModal.tunjanganHariRaya" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="editModal.show = false" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold">Batal</button>
          <button @click="saveEditModal" class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">save</span> Simpan
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { formatCurrency } from '../../utils/helpers'

const api = useApi()
const loading = ref(false)
const showSettings = ref(false)

const now = new Date()
const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const months = ref(monthNames.map((m, i) => ({ value: `${now.getFullYear()}-${String(i+1).padStart(2,'0')}`, label: `${m} ${now.getFullYear()}` })))
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`)
const filterDateStart = ref('')
const filterDateEnd = ref('')
const users = ref([])
const currentUser = ref(null)
const tableRows = ref([]) // computed rows for the table

const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin')

const monthLabel = computed(() => {
  const [y, m] = selectedMonth.value.split('-')
  return `${monthNames[parseInt(m)-1]} ${y}`
})

// Table totals
const totalGajiPokok = computed(() => tableRows.value.reduce((s, r) => s + r.gajiPokok, 0))
const totalMakanTransport = computed(() => tableRows.value.reduce((s, r) => s + r.makanTransport, 0))
const totalTunjangan = computed(() => tableRows.value.reduce((s, r) => s + r.tunjangan, 0))
const totalPotongan = computed(() => tableRows.value.reduce((s, r) => s + r.potongan, 0))
const totalDiterima = computed(() => tableRows.value.reduce((s, r) => s + r.totalDiterima, 0))

// Roles
const availableRoles = [
  { key: 'super_admin', label: 'Super Admin' },
  { key: 'admin', label: 'Admin' },
  { key: 'staff', label: 'Staff' }
]

// Default salary settings
const defaultSettings = () => ({
  super_admin: { gajiPokok: 4500000, makanTransport: 800000, tunjanganKesehatan: 0, tunjanganJabatan: 0, tunjanganHariRaya: 0 },
  admin: { gajiPokok: 3500000, makanTransport: 700000, tunjanganKesehatan: 0, tunjanganJabatan: 0, tunjanganHariRaya: 0 },
  staff: { gajiPokok: 2500000, makanTransport: 625000, tunjanganKesehatan: 0, tunjanganJabatan: 0, tunjanganHariRaya: 0 },
  _rates: { lemburJam: 0, lemburHari: 0, libur: 25000, terlambat: 5000, absenSetengah: 40000, tidakHadir: 80000 }
})

// Load settings from localStorage
function loadSettings() {
  try {
    const raw = localStorage.getItem('kcm_salary_settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      const def = defaultSettings()
      for (const role of ['super_admin', 'admin', 'staff']) {
        def[role] = { ...def[role], ...(parsed[role] || {}) }
      }
      def._rates = { ...def._rates, ...(parsed._rates || {}) }
      return def
    }
  } catch (e) { console.error('Failed to load salary settings', e) }
  return defaultSettings()
}

const salarySettings = reactive(loadSettings())

// Employee overrides from localStorage
function loadOverrides() {
  try {
    const raw = localStorage.getItem('kcm_employee_overrides')
    return raw ? JSON.parse(raw) : {}
  } catch (e) { return {} }
}

function saveOverrides(data) {
  localStorage.setItem('kcm_employee_overrides', JSON.stringify(data))
}

// Edit modal state
const editModal = reactive({
  show: false,
  userId: null,
  name: '',
  roleLabel: '',
  cuti: 0,
  liburTahunan: 0,
  tunjanganKesehatan: 0,
  tunjanganJabatan: 0,
  tunjanganHariRaya: 0
})

function saveSettings() {
  localStorage.setItem('kcm_salary_settings', JSON.stringify(salarySettings))
  showSettings.value = false
  loadData()
}

function resetSettings() {
  const def = defaultSettings()
  for (const role of ['super_admin', 'admin', 'staff']) {
    Object.assign(salarySettings[role], def[role])
  }
  Object.assign(salarySettings._rates, def._rates)
}

function getConfig(roleKey) {
  return salarySettings[roleKey] || salarySettings.staff
}

function getRates() {
  return salarySettings._rates
}

function formatNumber(val) {
  if (!val && val !== 0) return '0'
  return parseFloat(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

function roleLabel(role) {
  if (role === 'super_admin') return 'Super Admin'
  if (role === 'admin') return 'Admin'
  return 'Staff'
}

// Terbilang function - works up to triliun
function terbilang(num) {
  if (num === 0 || !num) return 'NOL RUPIAH'
  const satuan = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas']
  const ribuan = ['','Ribu','Juta','Miliar','Triliun']

  let result = ''
  let n = Math.abs(Math.round(num))
  let i = 0

  while (n > 0) {
    const bagian = n % 1000
    if (bagian > 0) {
      let str = ''
      const ratusan = Math.floor(bagian / 100)
      const puluhan = bagian % 100
      if (ratusan > 0) {
        str += (ratusan === 1 ? 'Seratus' : satuan[ratusan] + ' Ratus')
      }
      if (puluhan > 0) {
        if (str) str += ' '
        if (puluhan < 12) {
          str += satuan[puluhan]
        } else {
          const puluh = Math.floor(puluhan / 10)
          const sisa = puluhan % 10
          str += satuan[puluh] + ' Puluh'
          if (sisa > 0) str += ' ' + satuan[sisa]
        }
      }
      const suffix = ribuan[i]
      if (i === 1 && bagian < 100) {
        result = 'Se' + suffix + (result ? ' ' + result : '')
      } else {
        result = str + ' ' + suffix + (result ? ' ' + result : '')
      }
    }
    n = Math.floor(n / 1000)
    i++
  }

  return result.trim() + ' RUPIAH'
}

async function loadUsers() {
  try {
    const data = await api.get('/api/users')
    if (Array.isArray(data)) users.value = data
    else if (data && data.filter) users.value = data
    else users.value = []
    try {
      const me = await api.get('/api/auth/me')
      currentUser.value = me
    } catch (e) { /* ignore */ }
  } catch (e) { console.error(e) }
}

function onDateRangeChange() {
  // When user picks date range, keep it; month dropdown is a shortcut
  loadData()
}

// Count working days (Mon-Sat) between two date strings
function countWorkingDays(start, end) {
  let count = 0
  const d = new Date(start)
  const endD = new Date(end)
  while (d <= endD) {
    const dow = d.getDay()
    if (dow >= 1 && dow <= 6) count++ // Mon-Sat
    d.setDate(d.getDate() + 1)
  }
  return count
}

async function loadData() {
  if (!selectedMonth.value && !filterDateStart.value) return
  loading.value = true
  tableRows.value = []

  const targetUsers = users.value.filter(u => ['admin', 'staff'].includes(u.role))
  const rates = getRates()
  const overrides = loadOverrides()

  let startDate, endDate
  if (filterDateStart.value && filterDateEnd.value) {
    startDate = filterDateStart.value
    endDate = filterDateEnd.value
  } else {
    const [year, month] = selectedMonth.value.split('-')
    startDate = `${year}-${month}-01`
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
    endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
  }

  const totalWorkingDays = countWorkingDays(startDate, endDate)

  for (const u of targetUsers) {
    try {
      const res = await api.get('/api/attendance/rekap', { user_id: u.id, start: startDate, end: endDate })
      const logs = res.records || res || [] // API returns { records: [...] }

      // Separate: normal attendance (check_in type or no type) vs izin/cuti/libur
      const normalLogs = logs.filter(l => !l.type || l.type === 'check_in')

      // Hari hadir lengkap: check_in + check_out
      const hadirLengkap = normalLogs.filter(l => l.check_in && l.check_out).length

      // Absen setengah: check_in tapi tidak check_out
      const absenSetengah = normalLogs.filter(l => l.check_in && !l.check_out).length

      // Hari dengan any record (including izin/cuti/libur — these are NOT counted as absent)
      const daysWithAnyRecord = new Set(logs.map(l => l.date)).size

      // Tidak hadir = totalWorkingDays - days with any attendance record
      const tidakHadir = Math.max(0, totalWorkingDays - daysWithAnyRecord)

      // Terlambat: check_in after 08:15 (hour > 8 or hour === 8 && minute > 15)
      const terlambat = normalLogs.filter(l => {
        if (!l.check_in) return false
        const t = l.check_in.includes(' ') ? l.check_in.split(' ')[1] : l.check_in
        const parts = t.split(':')
        const h = parseInt(parts[0])
        const m = parseInt(parts[1])
        return h > 8 || (h === 8 && m > 15)
      }).length

      const config = getConfig(u.role)
      const ov = overrides[u.id] || {}
      const gajiPokok = config.gajiPokok || 0
      const makanTransport = config.makanTransport || 0
      const tunjanganKesehatan = ov.tunjanganKesehatan ?? config.tunjanganKesehatan ?? 0
      const tunjanganJabatan = ov.tunjanganJabatan ?? config.tunjanganJabatan ?? 0
      const tunjanganHariRaya = ov.tunjanganHariRaya ?? config.tunjanganHariRaya ?? 0
      const tunjangan = tunjanganKesehatan + tunjanganJabatan + tunjanganHariRaya

      // Potongan
      const terlambatRate = rates.terlambat || 5000
      const tidakHadirRate = rates.tidakHadir || 80000
      const absenSetengahRate = rates.absenSetengah || 40000
      const potonganTerlambat = terlambat * terlambatRate
      const potonganTidakHadir = tidakHadir * tidakHadirRate
      const potonganAbsen = absenSetengah * absenSetengahRate
      const totalPotongan = potonganTerlambat + potonganTidakHadir + potonganAbsen

      // Total Diterima = Pokok + Makan + Tunjangan - Potongan
      const totalDiterima = gajiPokok + makanTransport + tunjangan - totalPotongan

      tableRows.value.push({
        userId: u.id,
        name: u.name,
        role: u.role,
        roleLabel: roleLabel(u.role),
        gajiPokok,
        makanTransport,
        tunjanganKesehatan,
        tunjanganJabatan,
        tunjanganHariRaya,
        tunjangan,
        // Attendance breakdown
        totalWorkingDays,
        hadirLengkap,
        potonganTerlambatCount: terlambat,
        potonganTidakHadirCount: tidakHadir,
        potonganAbsenCount: absenSetengah,
        potongan: totalPotongan,
        totalPotongan,
        // Overrides
        cuti: ov.cuti || 0,
        liburTahunan: ov.liburTahunan || 0,
        // Config rates for slip
        terlambatRate,
        tidakHadirRate,
        absenSetengahRate,
        totalDiterima
      })
    } catch (e) {
      console.error('Error loading data for', u.name, e)
    }
  }
  loading.value = false
}

// Open edit modal for a row
function openEditModal(row) {
  editModal.show = true
  editModal.userId = row.userId
  editModal.name = row.name
  editModal.roleLabel = row.roleLabel
  editModal.cuti = row.cuti
  editModal.liburTahunan = row.liburTahunan
  editModal.tunjanganKesehatan = row.tunjanganKesehatan
  editModal.tunjanganJabatan = row.tunjanganJabatan
  editModal.tunjanganHariRaya = row.tunjanganHariRaya
}

function saveEditModal() {
  const overrides = loadOverrides()
  overrides[editModal.userId] = {
    cuti: editModal.cuti || 0,
    liburTahunan: editModal.liburTahunan || 0,
    tunjanganKesehatan: editModal.tunjanganKesehatan || 0,
    tunjanganJabatan: editModal.tunjanganJabatan || 0,
    tunjanganHariRaya: editModal.tunjanganHariRaya || 0
  }
  saveOverrides(overrides)
  editModal.show = false
  loadData()
}

// Build a single slip's HTML for print window
function buildSlipHTML(slip) {
  return `
    <div class="slip-page">
      <div class="text-center mb-4" style="border-bottom: 2px double #111; padding-bottom: 10px;">
        <h1 style="font-size: 16px; font-weight: 900; letter-spacing: 0.5px;">cv. KURNIA CIPTA MANDIRI</h1>
        <p style="font-size: 9px; color: #666; margin-top: 2px;">Jl. Kaliurang Km. 12, Griya Penen Asri Blok D-12, Harjobinangun, Pakem, Sleman, Yogyakarta</p>
        <p style="font-size: 9px; color: #666;">Telp. +62 85 100 80 5285 | Fax: +62 85 100 80 5285 | Email: kcm_production@ymail.com</p>
        <div style="margin-top: 10px; font-size: 13px; font-weight: 900; letter-spacing: 2px; display: inline-block; border-bottom: 1px solid #888; padding-bottom: 3px;">SLIP GAJI KARYAWAN</div>
        <div style="font-size: 11px; font-weight: 700; color: #c0392b; margin-top: 4px;">BULAN ${monthLabel.value}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 12px; font-size: 11px;">
        <div>NO URUT <b>: ${slip.no}</b></div>
        <div>TANGGAL <b>: ${slip.tanggal}</b></div>
        <div>NAMA <b>: ${slip.name}</b></div>
        <div>JABATAN <b>: ${slip.roleLabel}</b></div>
      </div>

      <div class="bg-section">PENDAPATAN</div>
      <table>
        <tr><td style="width:60%">GAJI POKOK</td><td class="text-right font-bold" style="width:40%">${formatCurrency(slip.gajiPokok)}</td></tr>
        <tr><td>MAKAN & TRANSPORT</td><td class="text-right font-bold">${formatCurrency(slip.makanTransport)}</td></tr>
        <tr><td>TUNJANGAN KESEHATAN</td><td class="text-right font-bold">${formatCurrency(slip.tunjanganKesehatan)}</td></tr>
        <tr><td>TUNJANGAN JABATAN</td><td class="text-right font-bold">${formatCurrency(slip.tunjanganJabatan)}</td></tr>
        <tr><td>TUNJANGAN HARI RAYA</td><td class="text-right font-bold">${formatCurrency(slip.tunjanganHariRaya)}</td></tr>
        <tr class="border-t"><td class="font-bold" style="padding-top:4px;">Pokok + Makan dan Trans</td><td class="text-right font-bold" style="padding-top:4px;">${formatCurrency(slip.pokokMakanTrans)}</td></tr>
      </table>

      <div class="bg-section">LEMBUR KERJA</div>
      <table>
        <tr><td>HARI</td><td class="text-right" style="color:#888">${slip.lemburHariCount} x Rp ${formatNumber(slip.lemburHariRate)}</td><td class="text-right font-bold" style="width:25%">${formatCurrency(slip.lemburHari)}</td></tr>
        <tr><td>JAM</td><td class="text-right" style="color:#888">${slip.lemburJamCount} x Rp ${formatNumber(slip.lemburJamRate)}</td><td class="text-right font-bold">${formatCurrency(slip.lemburJam)}</td></tr>
        <tr><td>LIBUR</td><td class="text-right" style="color:#888">${slip.liburCount} x Rp ${formatNumber(slip.liburRate)}</td><td class="text-right font-bold">${formatCurrency(slip.libur)}</td></tr>
      </table>

      <div class="bg-section">POTONGAN</div>
      <table>
        <tr><td>Absen 1x (1/2hari)</td><td class="text-right" style="color:#888">${slip.potonganAbsenCount} x Rp ${formatNumber(slip.absenSetengahRate)}</td><td class="text-right text-red">-${formatCurrency(slip.potonganAbsen)}</td></tr>
        <tr><td>Tidak Hadir (1hari)</td><td class="text-right" style="color:#888">${slip.potonganTidakHadirCount} x Rp ${formatNumber(slip.tidakHadirRate)}</td><td class="text-right text-red">-${formatCurrency(slip.potonganTidakHadir)}</td></tr>
        <tr><td>Terlambat Hadir (10menit)</td><td class="text-right" style="color:#888">${slip.potonganTerlambatCount} x Rp ${formatNumber(slip.terlambatRate)}</td><td class="text-right text-red">-${formatCurrency(slip.potonganTerlambat)}</td></tr>
        <tr class="border-t"><td colspan="2" class="font-bold" style="padding-top:4px;">Total Potongan</td><td class="text-right font-bold text-red" style="padding-top:4px;">-${formatCurrency(slip.totalPotongan)}</td></tr>
      </table>

      <div class="bg-section">POTONGAN KAS BON</div>
      <table>
        <tr><td>JUMLAH PINJAMAN</td><td class="text-right" style="width:40%">${formatCurrency(slip.jumlahPinjaman)}</td></tr>
        <tr><td>PEMOTONGAN CICILAN S/D KE-</td><td class="text-right">${slip.pemotonganCicilanKe}</td></tr>
        <tr><td>JUMLAH POTONGAN CICILAN KE-</td><td class="text-right">${formatCurrency(slip.jumlahPotonganCicilan)}</td></tr>
        <tr><td>LEMBUR KERJA</td><td class="text-right">${formatCurrency(slip.totalLembur)}</td></tr>
        <tr class="border-t"><td class="font-bold" style="padding-top:4px;">SISA PINJAMAN KAS BON</td><td class="text-right font-bold" style="padding-top:4px;">${formatCurrency(slip.sisaPinjaman)}</td></tr>
      </table>

      <div class="flex-between border-double-top mt-4 pt-3">
        <span style="font-size:13px; font-weight:900;">TOTAL DITERIMA</span>
        <span style="font-size:16px; font-weight:900; color:#c0392b;">${formatCurrency(slip.totalDiterima)}</span>
      </div>

      <p class="mt-2 italic" style="font-size:10px; color:#666;">
        <b>TERBILANG DENGAN KATA :</b> ${slip.terbilang}
      </p>

      <div class="flex-sig mt-4" style="font-size:11px; color:#666;">
        <div class="sig-block">
          <p class="font-bold spacer">DISETUJUI OLEH</p>
          <div class="sig-line"></div>
        </div>
        <div class="sig-block">
          <p class="font-bold spacer">DITERIMA OLEH</p>
          <div class="sig-line"></div>
        </div>
      </div>
    </div>`
}

// Build full slip data from a table row
function buildSlipData(row, slipNo) {
  const rates = getRates()
  const pokokMakanTrans = row.gajiPokok + row.makanTransport
  const lemburHariCount = 0
  const lemburJamCount = 0
  const liburCount = 0
  const lemburHariRate = rates.lemburHari || 0
  const lemburJamRate = rates.lemburJam || 0
  const liburRate = rates.libur || 25000
  const lemburHari = lemburHariCount * lemburHariRate
  const lemburJam = lemburJamCount * lemburJamRate
  const libur = liburCount * liburRate
  const totalLembur = lemburHari + lemburJam + libur
  const potonganAbsen = row.potonganAbsenCount * row.absenSetengahRate
  const potonganTidakHadir = row.potonganTidakHadirCount * row.tidakHadirRate
  const potonganTerlambat = row.potonganTerlambatCount * row.terlambatRate
  const totalPotongan = potonganAbsen + potonganTidakHadir + potonganTerlambat
  const jumlahPinjaman = 0
  const pemotonganCicilanKe = 0
  const jumlahPotonganCicilan = 0
  const sisaPinjaman = jumlahPinjaman - jumlahPotonganCicilan
  const totalDiterima = row.gajiPokok + row.makanTransport + row.tunjangan - totalPotongan + totalLembur

  return {
    no: slipNo,
    name: row.name,
    roleLabel: row.roleLabel,
    tanggal: `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`,
    gajiPokok: row.gajiPokok,
    makanTransport: row.makanTransport,
    tunjanganKesehatan: row.tunjanganKesehatan,
    tunjanganJabatan: row.tunjanganJabatan,
    tunjanganHariRaya: row.tunjanganHariRaya,
    pokokMakanTrans,
    lemburHariCount, lemburHariRate, lemburHari,
    lemburJamCount, lemburJamRate, lemburJam,
    liburCount, liburRate, libur,
    totalLembur,
    potonganAbsenCount: row.potonganAbsenCount, absenSetengahRate: row.absenSetengahRate, potonganAbsen,
    potonganTidakHadirCount: row.potonganTidakHadirCount, tidakHadirRate: row.tidakHadirRate, potonganTidakHadir,
    potonganTerlambatCount: row.potonganTerlambatCount, terlambatRate: row.terlambatRate, potonganTerlambat,
    totalPotongan,
    jumlahPinjaman, pemotonganCicilanKe, jumlahPotonganCicilan, sisaPinjaman,
    totalDiterima,
    terbilang: terbilang(totalDiterima)
  }
}

function printWindowStyles() {
  return `
    @page { size: A4; margin: 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #222; font-size: 11px; line-height: 1.4; }
    .slip-page { page-break-after: always; padding: 10px 0; }
    .slip-page:last-child { page-break-after: avoid; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 2px 4px; font-size: 11px; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .border-t { border-top: 1px solid #ccc; }
    .border-double-top { border-top: 2px double #111; }
    .bg-section { background: #f5f5f5; padding: 3px 8px; font-weight: 900; font-size: 10px; text-transform: uppercase; margin: 8px 0 4px 0; border-radius: 3px; }
    .text-red { color: #c0392b; }
    .italic { font-style: italic; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .pt-3 { padding-top: 12px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .flex-sig { display: flex; justify-content: space-between; }
    .sig-block { text-align: center; }
    .sig-line { border-top: 1px solid #888; width: 130px; margin: 0 auto; }
    .spacer { margin-top: 40px; }
    .print-btn { position: fixed; top: 16px; right: 16px; z-index: 9999; padding: 10px 24px; background: #991b1b; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    .print-btn:hover { background: #7f1d1d; }
    @media print { .print-btn { display: none !important; } }
  `
}

// Open slip in new window with Print button (no auto-print)
function cetakSlip(row) {
  const slipNo = tableRows.value.indexOf(row) + 1
  const slipData = buildSlipData(row, slipNo)
  const slipHTML = buildSlipHTML(slipData)

  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>Slip Gaji - ${row.name} - ${monthLabel.value}</title>
    <style>${printWindowStyles()}</style></head><body>
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
    ${slipHTML}
    </body></html>
  `)
  win.document.close()
}

// Cetak Semua - opens all slips in one window
function cetakSemua() {
  if (tableRows.value.length === 0) return
  let allSlipsHTML = ''
  tableRows.value.forEach((row, idx) => {
    const slipData = buildSlipData(row, idx + 1)
    allSlipsHTML += buildSlipHTML(slipData)
  })

  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>Slip Gaji - ${monthLabel.value}</title>
    <style>${printWindowStyles()}</style></head><body>
    <button class="print-btn" onclick="window.print()">🖨️ Print Semua</button>
    ${allSlipsHTML}
    </body></html>
  `)
  win.document.close()
}

onMounted(async () => { await loadUsers(); loadData() })
</script>

<style scoped>
@media print {
  .slip-page {
    page-break-after: always;
    break-after: page;
  }
  .slip-page:last-child {
    page-break-after: avoid;
    break-after: auto;
  }
}
</style>
