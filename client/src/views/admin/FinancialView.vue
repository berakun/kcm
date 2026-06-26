<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col min-h-screen">
      <!-- Topbar Navigation -->
      <AppTopbar title="Analisis & Laporan Keuangan" />

      <!-- Content Body -->
      <div class="p-8 flex-grow space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
        
        <!-- Date Range Filter -->
        <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter Periode:</span>
            <input v-model="filterDateStart" type="date" class="bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-red-500" title="Tanggal Mulai"/>
            <span class="text-gray-400 text-xs">→</span>
            <input v-model="filterDateEnd" type="date" class="bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-red-500" title="Tanggal Selesai"/>
            <button @click="applyDateFilter" class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">filter_alt</span> Terapkan
            </button>
            <button @click="resetDateFilter" class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">restart_alt</span> Reset
            </button>
          </div>
        </div>

        <!-- Summary Bento Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Total Pendapatan -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
            <div class="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Pendapatan Proyek</p>
              <h3 class="text-2xl font-black mt-2 text-emerald-600 font-mono">{{ formatCurrency(summary.total_revenue) }}</h3>
            </div>
            <div class="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
              <span>Berdasarkan RAB Proyek Aktif & Selesai</span>
            </div>
          </div>

          <!-- Total Pengeluaran -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
            <div class="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Biaya & Pengeluaran</p>
              <h3 class="text-2xl font-black mt-2 text-red-800 font-mono">{{ formatCurrency(summary.total_expenses) }}</h3>
            </div>
            <div class="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-red-800">info</span>
              <span>Gabungan Rembes, Cashbon & ATK</span>
            </div>
          </div>

          <!-- Laba Bersih -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
            <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Estimasi Laba Bersih</p>
              <h3 class="text-2xl font-black mt-2 text-gray-900 dark:text-white font-mono">{{ formatCurrency(summary.total_profit) }}</h3>
            </div>
            <div class="text-[10px] text-gray-400 mt-2 flex items-center gap-1" :class="summary.total_profit >= 0 ? 'text-emerald-700' : 'text-red-750'">
              <span class="material-symbols-outlined text-sm">{{ summary.total_profit >= 0 ? 'trending_up' : 'trending_down' }}</span>
              <span>{{ summary.total_profit >= 0 ? 'Surplus Operasional' : 'Defisit Anggaran' }}</span>
            </div>
          </div>

          <!-- Budget Utilization Rate -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between min-h-[120px]">
            <div class="space-y-1">
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rasio Utilisasi Biaya</p>
              <h3 class="text-3xl font-black text-gray-900 dark:text-white">{{ summary.utilization_rate?.toFixed(1) }}%</h3>
              <p class="text-[9px] text-gray-450 italic">Efisiensi Alokasi Dana</p>
            </div>
            <div class="relative w-16 h-16 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90">
                <circle class="text-gray-100 dark:text-gray-800" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" stroke-width="5"></circle>
                <circle class="text-red-800 dark:text-red-650" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" :stroke-dasharray="163.3" :stroke-dashoffset="163.3 - (163.3 * (summary.utilization_rate || 85) / 100)" stroke-width="5"></circle>
              </svg>
              <span class="absolute text-[10px] font-bold text-gray-700 dark:text-gray-300">%</span>
            </div>
          </div>
        </div>

        <!-- Analytical Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Flow Trend Chart -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm">
            <h3 class="font-bold text-xs uppercase tracking-wider text-gray-850 dark:text-white mb-6">Tren Aliran Kas Bulanan</h3>
            <div class="h-80">
              <canvas id="cashflowChart"></canvas>
            </div>
          </div>

          <!-- Project Comparisons Chart -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm">
            <h3 class="font-bold text-xs uppercase tracking-wider text-gray-850 dark:text-white mb-6">Perbandingan RAB vs Aktual Proyek</h3>
            <div class="h-80">
              <canvas id="projectCompChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Leakage Alerts List & Table -->
        <div class="bg-white dark:bg-gray-850 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h3 class="font-bold text-sm text-gray-900 dark:text-white">Leakage Tracker (Kebocoran Dana Lapangan)</h3>
              <p class="text-[10px] text-gray-400">Rembesan aktual yang melampaui alokasi estimasi anggaran biaya awal proyek.</p>
            </div>
            <span class="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-750 text-[10px] font-bold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">warning</span>
              <span>Waspada Kebocoran</span>
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 text-xxs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                  <th class="py-4 px-6">Nama Proyek</th>
                  <th class="py-4 px-6">Tanggal Pengeluaran</th>
                  <th class="py-4 px-6">Rincian Belanja</th>
                  <th class="py-4 px-6">Anggaran Awal (RAB)</th>
                  <th class="py-4 px-6">Jumlah Aktual</th>
                  <th class="py-4 px-6">Selisih Defisit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <tr v-if="filteredLeakages.length === 0">
                  <td colspan="6" class="py-12 text-center text-gray-400">
                    Tidak ada kebocoran anggaran terdeteksi. Semua pengeluaran aktual berada di bawah atau sama dengan alokasi RAB.
                  </td>
                </tr>
                <tr v-else v-for="(leak, idx) in filteredLeakages" :key="idx" class="hover:bg-red-50/20 dark:hover:bg-red-950/5 transition-colors">
                  <td class="py-4 px-6 font-bold text-gray-800 dark:text-gray-200">{{ leak.project_name }}</td>
                  <td class="py-4 px-6 text-gray-400">{{ formatDate(leak.date) }}</td>
                  <td class="py-4 px-6 font-semibold">{{ leak.description }}</td>
                  <td class="py-4 px-6 font-mono text-gray-500">{{ formatCurrency(leak.rab_amount) }}</td>
                  <td class="py-4 px-6 font-mono text-gray-900 dark:text-white font-semibold">{{ formatCurrency(leak.actual_amount) }}</td>
                  <td class="py-4 px-6 font-mono text-red-750 font-bold">
                    {{ formatCurrency(Math.abs(leak.difference)) }}
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
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { formatCurrency, formatDate } from '../../utils/helpers'
import Chart from 'chart.js/auto'

const api = useApi()

const filterDateStart = ref('')
const filterDateEnd = ref('')

const summary = ref({
  total_revenue: 0,
  total_expenses: 0,
  total_profit: 0,
  utilization_rate: 0
})

const chartDataList = ref([])
const leakages = ref([])
const projectComparisons = ref([])

const filteredLeakages = computed(() => {
  const ds = filterDateStart.value
  const de = filterDateEnd.value
  if (!ds && !de) return leakages.value
  return leakages.value.filter(l => {
    if (!l.date) return false
    const d = new Date(l.date)
    if (ds && d < new Date(ds)) return false
    if (de) {
      const deDate = new Date(de)
      deDate.setHours(23,59,59,999)
      if (d > deDate) return false
    }
    return true
  })
})

function applyDateFilter() {
  // Client-side filtering via computed; no-op needed here
}

function resetDateFilter() {
  filterDateStart.value = ''
  filterDateEnd.value = ''
}

onMounted(async () => {
  try {
    const res = await api.get('/api/financial')
    
    summary.value = res.summary
    chartDataList.value = res.chart_data
    leakages.value = res.leakages
    projectComparisons.value = res.project_comparisons

    // Render Charts
    renderCashflowChart()
    renderProjectCompChart()
  } catch (err) {
    console.error('Failed to load financial reports data:', err)
  }
})

function renderCashflowChart() {
  const ctx = document.getElementById('cashflowChart').getContext('2d')
  
  const labels = chartDataList.value.map(c => c.period)
  const revenues = chartDataList.value.map(c => c.revenue)
  const expenses = chartDataList.value.map(c => c.expenses)

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Pendapatan',
          data: revenues,
          backgroundColor: '#991b1b', // Maroon
          borderRadius: 6
        },
        {
          label: 'Pengeluaran',
          data: expenses,
          backgroundColor: '#B45309', // Gold/Amber
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: 'rgba(156, 163, 175, 0.1)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function renderProjectCompChart() {
  const ctx = document.getElementById('projectCompChart').getContext('2d')

  const labels = projectComparisons.value.map(p => {
    return p.project_name.length > 18 ? p.project_name.substring(0, 15) + '...' : p.project_name
  })
  const budgets = projectComparisons.value.map(p => p.total_budget)
  const actuals = projectComparisons.value.map(p => p.total_actual)

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Alokasi RAB',
          data: budgets,
          backgroundColor: 'rgba(31, 41, 55, 0.4)', // Darker theme
          borderColor: 'rgba(31, 41, 55, 0.8)',
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: 'Biaya Aktual',
          data: actuals,
          backgroundColor: '#991b1b', // Maroon
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          grid: { color: 'rgba(156, 163, 175, 0.1)' }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  })
}
</script>
