<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <AppTopbar title="PO Belanja" />
      <div class="p-6 md:p-8 flex-grow space-y-6 overflow-y-auto">

        <!-- Header Bar -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">PO Belanja</h2>
              <p class="text-xs text-gray-400 mt-1">{{ todayFormatted }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="openFormModal()"
                class="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors bg-red-800 hover:bg-red-900 text-white"
              >
                <span class="material-symbols-outlined text-sm">add</span> Buat PO Baru
              </button>
            </div>
          </div>
        </div>

        <!-- Add PoFormModal component here -->
        <PoFormModal 
          v-model:show="showPoFormModal" 
          :editingId="editingPoId" 
          :initialData="poToEdit"
          @saved="handlePoSaved"
        />

        <!-- Collapsible PO Form (Removed, moved to modal) -->

        <!-- Filters Card -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-3 flex-wrap">
              <select v-model="filters.rab_id" @change="loadPOList" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                <option value="">Semua Project</option>
                <option v-for="r in rabList" :key="r.id" :value="r.id">[{{ r.code }}] {{ r.project_name }}</option>
              </select>
              <div class="flex items-center gap-3">
                <DateRangePicker 
                  v-model:startDate="filters.date_from" 
                  v-model:endDate="filters.date_to" 
                  @change="loadPOList"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto min-h-[220px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                  <th class="py-4 px-6 w-12 text-center hidden sm:table-cell">No</th>
                  <th class="py-4 px-6">No PO</th>
                  <th class="py-4 px-6">Supplier</th>
                  <th class="py-4 px-6 hidden sm:table-cell">Tanggal</th>
                  <th class="py-4 px-6 hidden md:table-cell">Project</th>
                  <th class="py-4 px-6 text-right">Total</th>
                  <th class="py-4 px-6 text-center">Status</th>
                  <th class="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <tr v-if="paginatedPoList.length === 0">
                  <td colspan="8" class="py-12 text-center text-gray-400">Belum ada PO tersimpan.</td>
                </tr>
                <tr v-else v-for="(po, idx) in paginatedPoList" :key="po.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td class="py-4 px-6 text-center text-gray-400 hidden sm:table-cell">{{ (currentPage - 1) * perPage + idx + 1 }}</td>
                  <td class="py-4 px-6 font-bold text-red-800 dark:text-red-500">{{ po.po_number }}</td>
                  <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white">{{ po.to_supplier || '-' }}</td>
                  <td class="py-4 px-6 text-gray-400 hidden sm:table-cell">{{ formatDateID(po.date) }}</td>
                  <td class="py-4 px-6 text-gray-500 dark:text-gray-400 max-w-[180px] truncate hidden md:table-cell">{{ po.projects || '-' }}</td>
                  <td class="py-4 px-6 text-right font-mono font-semibold text-gray-900 dark:text-white">{{ formatCurrency(po.grand_total) }}</td>
                  <td class="py-4 px-6 text-center">
                    <span :class="statusBadgeClass(po.status)" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">{{ po.status || 'draft' }}</span>
                  </td>
                  <td class="py-4 px-6 text-center relative">
                    <div class="inline-block text-left">
                      <button 
                        @click.prevent.stop="toggleDropdown($event, po)" 
                        class="p-2 rounded-xl text-gray-500 hover:bg-gray-150 dark:hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto"
                        title="Aksi"
                      >
                        <span class="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredPoList.length > perPage" class="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <span class="text-[10px] text-gray-400">Menampilkan {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredPoList.length) }} dari {{ filteredPoList.length }} PO</span>
            <div class="flex items-center gap-1">
              <button @click="currentPage--" :disabled="currentPage <= 1" class="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-symbols-outlined text-sm align-middle">chevron_left</span>
              </button>
              <template v-for="p in visiblePages" :key="p">
                <button v-if="p === '...'" disabled class="px-2 py-1.5 text-xs text-gray-400">...</button>
                <button v-else @click="currentPage = p" :class="[p === currentPage ? 'bg-red-800 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800', 'px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 transition-colors']">{{ p }}</button>
              </template>
              <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-symbols-outlined text-sm align-middle">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- View PO Modal -->
    <teleport to="body">
      <div v-if="viewModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="viewModal.show = false">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="viewModal.show = false"></div>
        <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h3 class="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-base text-blue-600">visibility</span>
              Detail PO — {{ viewModal.po?.po_number || '' }}
            </h3>
            <div class="flex gap-2">
              <button @click="viewCetak(viewModal.po)" class="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">print</span> Cetak
              </button>
              <button @click="viewModal.show = false" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
          <!-- Modal Body: Print format preview -->
          <div class="p-6">
            <div class="bg-white border border-gray-200 rounded-xl p-6 text-xs text-gray-800 space-y-4">
              <div class="text-center border-b-2 border-gray-300 pb-3">
                <img src="/logo-transparent.png" alt="KCM Logo" class="w-12 h-12 mx-auto mb-2 object-contain">
                <h1 class="text-sm font-black tracking-wide">CV. KURNIA CIPTA MANDIRI</h1>
                <p class="text-[9px] text-gray-400 mt-1">Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24, Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
                <p class="text-[9px] text-gray-400">Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com</p>
              </div>
              <h2 class="text-center text-xs font-black tracking-widest uppercase border-b border-gray-200 pb-2">PURCHASE ORDER</h2>
              <div class="grid grid-cols-2 gap-2 text-[10px]">
                <div><span class="font-bold text-gray-400">No:</span> {{ viewModal.po?.po_number || '-' }}</div>
                <div><span class="font-bold text-gray-400">Date:</span> {{ formatDateID(viewModal.po?.date) }}</div>
                <div><span class="font-bold text-gray-400">To:</span> {{ viewModal.po?.to_supplier || '-' }}</div>
                <div><span class="font-bold text-gray-400">Phone:</span> {{ viewModal.po?.phone || '-' }}</div>
                <div><span class="font-bold text-gray-400">Attn:</span> {{ viewModal.po?.attn || '-' }}</div>
                <div><span class="font-bold text-gray-400">Status:</span> <span :class="statusBadgeClass(viewModal.po?.status)" class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">{{ viewModal.po?.status || 'draft' }}</span></div>
              </div>
              <!-- Items -->
              <table class="w-full border-collapse text-[10px] mt-2">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-800 text-[9px] uppercase tracking-wider text-gray-550 dark:text-gray-400 font-bold">
                    <th class="border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-center">No</th>
                    <th class="border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-left">Description</th>
                    <th class="border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-center">Qty</th>
                    <th class="border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-center">Sat</th>
                    <th class="border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-right">Unit Price</th>
                    <th class="border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in (viewModal.po?.items || [])" :key="i" class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
                    <td class="border border-gray-300 px-2 py-1.5">{{ item.description || '' }}</td>
                    <td class="border border-gray-300 px-2 py-1.5 text-center">{{ item.qty || 0 }}</td>
                    <td class="border border-gray-300 px-2 py-1.5 text-center">{{ item.satuan || '' }}</td>
                    <td class="border border-gray-300 px-2 py-1.5 text-right font-mono">{{ formatCurrency(item.unitPrice || item.unit_price || 0) }}</td>
                    <td class="border border-gray-300 px-2 py-1.5 text-right font-mono">{{ formatCurrency((item.qty || 0) * (item.unitPrice || item.unit_price || 0)) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-red-50 font-bold">
                    <td colspan="5" class="border border-gray-300 px-2 py-1.5 text-right uppercase text-[9px]">TOTAL</td>
                    <td class="border border-gray-300 px-2 py-1.5 text-right font-mono text-red-700">{{ formatCurrency(viewModal.po?.total) }}</td>
                  </tr>
                </tfoot>
              </table>
              <!-- Summary -->
              <div class="flex justify-end">
                <div class="w-56 space-y-1 text-[10px]">
                  <div class="flex justify-between"><span>Total</span><span class="font-mono font-bold">{{ formatCurrency(viewModal.po?.total) }}</span></div>
                  <div class="flex justify-between"><span>PPN 10%</span><span class="font-mono font-bold">{{ formatCurrency(viewModal.po?.ppn) }}</span></div>
                  <div class="flex justify-between bg-red-50 px-2 py-1 rounded font-black text-red-700"><span>Grand Total</span><span class="font-mono">{{ formatCurrency(viewModal.po?.grand_total) }}</span></div>
                </div>
              </div>
              <div class="text-[10px] text-gray-500 italic bg-gray-50 px-3 py-2 rounded">In Words: <strong>{{ viewModal.po?.in_words || '-' }}</strong></div>
              <!-- Signatures -->
              <div class="flex justify-end gap-6 mt-4 text-center text-[10px]">
                <div>
                  <p class="font-bold text-gray-400 uppercase mb-1">Ordered By</p>
                  <div class="border-b border-gray-400 h-8 mb-1"></div>
                  <p>{{ viewModal.po?.ordered_by || '-' }}</p>
                </div>
                <div>
                  <p class="font-bold text-gray-400 uppercase mb-1">Purchasing</p>
                  <div class="border-b border-gray-400 h-8 mb-1"></div>
                  <p>{{ viewModal.po?.purchasing || '-' }}</p>
                </div>
                <div>
                  <p class="font-bold text-gray-400 uppercase mb-1">Approved By</p>
                  <div class="border-b border-gray-400 h-8 mb-1"></div>
                  <p>{{ viewModal.po?.approved_by || '-' }}</p>
                </div>
              </div>
              <!-- Notes -->
              <div class="bg-gray-50 px-3 py-2 rounded text-[10px] space-y-1 mt-2">
                <p><span class="font-bold">Note:</span> {{ viewModal.po?.note || '-' }}</p>
                <p><span class="font-bold">Deliver by:</span> {{ viewModal.po?.deliver_by || '-' }}</p>
                <p><span class="font-bold">Deliver to:</span> {{ viewModal.po?.deliver_to || '-' }}</p>
                <p><span class="font-bold">Term of Payment:</span> {{ viewModal.po?.term_of_payment || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Action Dropdown Teleport -->
    <teleport to="body">
      <div 
        v-if="activeDropdown && selectedPo" 
        :style="dropdownStyle"
        class="fixed w-40 bg-white dark:bg-gray-850 rounded-2xl shadow-xl border border-gray-150 dark:border-gray-800 py-2 z-[9999] animate-fade-in"
      >
        <button 
          @click="viewPO(selectedPo); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-blue-600">visibility</span>
          <span>Lihat Detail</span>
        </button>
        <button 
          @click="downloadPoPDF(selectedPo); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-emerald-600">download</span>
          <span>Unduh PDF</span>
        </button>
        <button 
          @click="viewCetak(selectedPo); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-gray-500">print</span>
          <span>Cetak PO</span>
        </button>
        <hr class="my-1 border-gray-100 dark:border-gray-800" />
        <button 
          @click="editPO(selectedPo); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-amber-600">edit</span>
          <span>Ubah / Edit</span>
        </button>
        <hr class="my-1 border-gray-100 dark:border-gray-800" />
        <button 
          @click="deletePO(selectedPo.id); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-955/20 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm">delete</span>
          <span>Hapus PO</span>
        </button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PoFormModal from '../../components/rab/PoFormModal.vue'
import DateRangePicker from '../../components/ui/DateRangePicker.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'
import { formatCurrency, formatDate } from '../../utils/helpers'
import html2pdf from 'html2pdf.js'

const api = useApi()
const appStore = useAppStore()

const activeDropdown = ref(null)
const selectedPo = ref(null)
const dropdownStyle = ref({})

function toggleDropdown(event, po) {
  if (activeDropdown.value === po.id) {
    closeAllDropdowns()
    return
  }
  activeDropdown.value = po.id
  selectedPo.value = po
  
  const rect = event.currentTarget.getBoundingClientRect()
  const DW = 160, DH = 220
  
  let left = rect.right - DW
  if (left < 8) left = 8
  if (left + DW > window.innerWidth - 8) left = window.innerWidth - DW - 8
  
  let top = rect.bottom + 4
  if (top + DH > window.innerHeight - 8) top = rect.top - DH - 4
  
  dropdownStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999
  }
  
  setTimeout(() => {
    window.addEventListener('click', closeAllDropdowns)
    window.addEventListener('scroll', closeAllDropdowns, { capture: true, passive: true })
  }, 0)
}


function closeAllDropdowns() {
  activeDropdown.value = null
  selectedPo.value = null
  window.removeEventListener('click', closeAllDropdowns)
  window.removeEventListener('scroll', closeAllDropdowns, { capture: true })
}

// ─── Modal State ───
const showPoFormModal = ref(false)
const editingPoId = ref(null)
const poToEdit = ref(null)

function openFormModal(poData = null) {
  editingPoId.value = poData ? poData.id : null
  poToEdit.value = poData
  showPoFormModal.value = true
}

function handlePoSaved() {
  loadPOList()
}

const today = new Date()
const todayFormatted = today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })

const rabList = ref([])
const poList = ref([])

// ─── View Modal ───
const viewModal = reactive({ show: false, po: null })

// ─── Filter & Pagination ───
const currentPage = ref(1)
const perPage = 10

const filters = ref({ rab_id: '', date_from: '', date_to: '' })

const filteredPoList = computed(() => poList.value) // filtering done server-side

const totalPages = computed(() => Math.ceil(filteredPoList.value.length / perPage) || 1)

const paginatedPoList = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredPoList.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function resetFilters() {
  filters.value = { rab_id: '', date_from: '', date_to: '' }
  currentPage.value = 1
  loadPOList()
}

function statusBadgeClass(status) {
  const s = (status || 'draft').toLowerCase()
  if (s === 'approved') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (s === 'rejected') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (s === 'completed') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
}

function formatDateID(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
}

async function loadRabList() {
  try {
    const data = await api.get('/api/rab')
    rabList.value = Array.isArray(data) ? data : (data.rab || [])
  } catch (e) { console.error(e) }
}

async function loadPOList() {
try {
  const params = {}
  if (filters.value.rab_id) params.rab_id = filters.value.rab_id
  if (filters.value.date_from) params.date_from = filters.value.date_from
  if (filters.value.date_to) params.date_to = filters.value.date_to
  poList.value = await api.get('/api/po', params)
  currentPage.value = 1
} catch (e) { console.error(e) }
}

async function viewPO(po) {
try {
  const full = await api.get(`/api/po/${po.id}`)
  viewModal.po = full
  viewModal.show = true
} catch (err) {
  appStore.showAlert('Gagal memuat PO.', 'error')
}
}

async function editPO(po) {
try {
  const full = await api.get(`/api/po/${po.id}`)
  openFormModal(full)
  appStore.showAlert('Mode edit: ubah data lalu klik Simpan PO.', 'info')
} catch (err) {
  appStore.showAlert('Gagal memuat PO untuk edit.', 'error')
}
}

async function deletePO(id) {
  if (!confirm('Hapus PO ini?')) return
  try {
    await api.delete(`/api/po/${id}`)
    appStore.showAlert('PO berhasil dihapus.', 'success')
    await loadPOList()
  } catch (err) {
    appStore.showAlert('Gagal menghapus PO.', 'error')
  }
}

function generatePoPrintHTML(po) {
  let itemsRows = ''
  const items = po.items || []
  items.forEach((item, i) => {
    itemsRows += `<tr>
      <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid #ddd; padding: 6px;">${item.description || ''}</td>
      <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${item.qty || 0}</td>
      <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${item.satuan || ''}</td>
      <td style="border: 1px solid #ddd; padding: 6px; text-align: right; font-family: monospace;">${formatCurrency(item.unitPrice || item.unit_price || 0)}</td>
      <td style="border: 1px solid #ddd; padding: 6px; text-align: right; font-family: monospace;">${formatCurrency((item.qty || 0) * (item.unitPrice || item.unit_price || 0))}</td>
    </tr>`
  })

  return `
    <html>
      <head>
        <title>Purchase Order - ${po.po_number}</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #333; padding: 20px; font-size: 11px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
          .header h1 { font-size: 16px; margin: 0; font-weight: bold; }
          .header p { margin: 2px 0; font-size: 9px; color: #666; }
          .title { text-align: center; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 15px 0; letter-spacing: 2px; }
          .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 8px; margin-bottom: 15px; }
          .info-grid div { margin-bottom: 4px; }
          .info-grid span { font-weight: bold; color: #555; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; }
          th { background: #f3f4f6; border: 1px solid #ccc; padding: 6px; font-weight: bold; }
          td { border: 1px solid #ddd; padding: 6px; }
          .summary-container { display: flex; justify-content: flex-end; margin-top: 10px; }
          .summary-table { width: 220px; border-collapse: collapse; }
          .summary-table td { border: none; padding: 4px; }
          .summary-table tr.grand-total { font-weight: bold; background: #fee2e2; color: #991b1b; }
          .in-words { background: #f9fafb; padding: 8px; border-radius: 4px; font-style: italic; margin: 10px 0; }
          .signatures { display: flex; justify-content: flex-end; gap: 30px; margin-top: 30px; text-align: center; }
          .signatures p { margin: 0; }
          .sig-line { border-bottom: 1px solid #888; height: 40px; margin-bottom: 5px; }
          .notes { background: #f9fafb; padding: 8px; border-radius: 4px; margin-top: 15px; }
          .notes p { margin: 3px 0; }
          @media print {
            @page { size: A4; margin: 15mm; }
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo_no_background.png" alt="KCM Logo" style="height: 110px; max-width: 320px; object-fit: contain; margin-bottom: 8px;">
          <h1>CV. KURNIA CIPTA MANDIRI</h1>
          <p>Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24, Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
          <p>Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com</p>
        </div>
        
        <div class="title">PURCHASE ORDER</div>
        
        <div class="info-grid">
          <div><span>No:</span> ${po.po_number || '-'}</div>
          <div><span>Date:</span> ${formatDateID(po.date)}</div>
          <div><span>To:</span> ${po.to_supplier || '-'}</div>
          <div><span>Phone:</span> ${po.phone || '-'}</div>
          <div><span>Attn:</span> ${po.attn || '-'}</div>
          <div><span>Status:</span> ${po.status || 'draft'}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%">No</th>
              <th style="width: 50%">Description</th>
              <th style="width: 10%">Qty</th>
              <th style="width: 10%">Sat</th>
              <th style="width: 12%">Unit Price</th>
              <th style="width: 13%">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="summary-container">
          <table class="summary-table">
            <tr>
              <td>Total</td>
              <td style="text-align: right; font-family: monospace;">${formatCurrency(po.total)}</td>
            </tr>
            <tr>
              <td>PPN 10%</td>
              <td style="text-align: right; font-family: monospace;">${formatCurrency(po.ppn)}</td>
            </tr>
            <tr class="grand-total">
              <td style="padding: 6px;">Grand Total</td>
              <td style="text-align: right; font-family: monospace; padding: 6px;">${formatCurrency(po.grand_total)}</td>
            </tr>
          </table>
        </div>

        <div class="in-words">In Words: <strong>${po.in_words || '-'}</strong></div>

        <div class="signatures">
          <div>
            <p style="font-weight: bold; color: #555; text-transform: uppercase;">Ordered By</p>
            <div class="sig-line"></div>
            <p>${po.ordered_by || '-'}</p>
          </div>
          <div>
            <p style="font-weight: bold; color: #555; text-transform: uppercase;">Purchasing</p>
            <div class="sig-line"></div>
            <p>${po.purchasing || '-'}</p>
          </div>
          <div>
            <p style="font-weight: bold; color: #555; text-transform: uppercase;">Approved By</p>
            <div class="sig-line"></div>
            <p>${po.approved_by || '-'}</p>
          </div>
        </div>

        <div class="notes">
          <p><strong>Note:</strong> ${po.note || '-'}</p>
          <p><strong>Deliver by:</strong> ${po.deliver_by || '-'}</p>
          <p><strong>Deliver to:</strong> ${po.deliver_to || '-'}</p>
          <p><strong>Term of Payment:</strong> ${po.term_of_payment || '-'}</p>
        </div>
      </body>
    </html>
  `
}

function viewCetak(po) {
  const w = window.open('', '_blank')
  w.document.write(generatePoPrintHTML(po))
  w.document.close()
  setTimeout(() => { w.print() }, 500)
}

function downloadPoPDF(po) {
  const element = document.createElement('div')
  element.innerHTML = generatePoPrintHTML(po)
  const filename = `PO_${po.po_number.replace(/\s+/g, '_')}.pdf`
  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().from(element).set(opt).save()
}

onMounted(() => { 
  loadRabList()
  loadPOList() 
  window.addEventListener('click', closeAllDropdowns)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeAllDropdowns)
})
</script>
