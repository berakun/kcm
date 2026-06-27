<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <main class="flex-grow flex flex-col min-h-screen">
      <AppTopbar title="PO Belanja" />
      <div class="p-6 md:p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">

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
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 text-xxs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
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
                  <td class="py-4 px-6 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button @click="viewPO(po)" title="Lihat" class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <span class="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button @click="editPO(po)" title="Edit" class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button @click="deletePO(po.id)" title="Hapus" class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <span class="material-symbols-outlined text-base">delete</span>
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
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-2 py-1.5 text-center">No</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-left">Description</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-center">Qty</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-center">Sat</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-right">Unit Price</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-right">Total</th>
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
              <div class="grid grid-cols-3 gap-4 mt-4 text-center text-[10px]">
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
                <p><span class="font-bold">Deliver by:</span> {{ formatDateID(viewModal.po?.deliver_by) }}</p>
                <p><span class="font-bold">Deliver to:</span> {{ viewModal.po?.deliver_to || '-' }}</p>
                <p><span class="font-bold">Term of Payment:</span> {{ viewModal.po?.term_of_payment || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PoFormModal from '../../components/rab/PoFormModal.vue'
import DateRangePicker from '../../components/ui/DateRangePicker.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'
import { formatCurrency, formatDate } from '../../utils/helpers'

const api = useApi()
const appStore = useAppStore()

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
const todayFormatted = today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

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
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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

onMounted(() => { loadRabList(); loadPOList() })
</script>
