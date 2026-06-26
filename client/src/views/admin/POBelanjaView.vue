<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <main class="flex-grow flex flex-col min-h-screen">
      <AppTopbar title="PO Belanja" />
      <div class="p-6 md:p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">

        <!-- Tabs -->
        <div class="flex space-x-2 border-b border-gray-200 dark:border-gray-800 pb-px">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            :class="[activeTab === tab.id
              ? 'border-red-800 text-red-800 dark:text-red-500 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700',
              'px-6 py-3 border-b-2 text-xs font-semibold transition-all duration-200 focus:outline-none']"
          >
            <div class="flex items-center space-x-2">
              <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
              <span>{{ tab.name }}</span>
            </div>
          </button>
        </div>

        <!-- ============ TAB: FORM PO ============ -->
        <div v-if="activeTab === 'form'" class="space-y-6">

          <!-- Action Bar -->
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 class="text-lg font-bold text-gray-800 dark:text-white">Purchase Order Belanja</h2>
                <p class="text-xs text-gray-400 mt-1">Buat PO standar KCM.</p>
              </div>
              <div class="flex gap-2">
                <button @click="savePO" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">save</span> Simpan PO
                </button>
                <button @click="downloadPDF" class="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">visibility</span> Download PDF
                </button>
                <button @click="cetakPO" class="px-4 py-2.5 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">print</span> Cetak
                </button>
              </div>
            </div>
          </div>

          <!-- PO Form (screen) -->
          <div class="bg-white dark:bg-gray-850 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">

            <!-- KCM Header -->
            <div class="text-center mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
              <img src="/logo.png" alt="KCM Logo" class="w-16 h-16 mx-auto mb-3 object-contain">
              <h1 class="text-lg font-black text-gray-900 dark:text-white tracking-wide">CV. KURNIA CIPTA MANDIRI</h1>
              <p class="text-[10px] text-gray-400 mt-1">Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24, Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
              <p class="text-[10px] text-gray-400">Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com | IG: @pengrajin_interiorkcm</p>
            </div>

            <!-- PO Title -->
            <h2 class="text-center text-sm font-black tracking-widest text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">PURCHASE ORDER</h2>

            <!-- PO Info Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">No</label>
                <input v-model="form.nomorRef" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="B.803/KCM/VI/2026">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Date</label>
                <input v-model="form.tanggal" type="date" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">To (Supplier)</label>
                <input v-model="form.to" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Nama Supplier / Vendor">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Phone</label>
                <input v-model="form.phone" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="08xxxxxxxxxx">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Attn</label>
                <input v-model="form.attn" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Perhatian / PIC">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Pilih dari RAB</label>
                <select v-model="selectedRabId" @change="loadRabData" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                  <option value="">-- Pilih Proyek RAB --</option>
                  <option v-for="r in rabList" :key="r.id" :value="r.id">[{{ r.code }}] {{ r.project_name }}</option>
                </select>
              </div>
            </div>

            <p class="text-xs text-gray-400 italic mb-4">Please supply the following goods/services as per the terms stated here in:</p>

            <!-- Main content: Items table (left) + Project/Material (right) -->
            <div class="flex flex-col lg:flex-row gap-6 mb-6">
              <!-- LEFT: Items Table -->
              <div class="flex-1 overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b-2 border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-400 uppercase">
                      <th class="py-3 px-2 w-10 text-center">No</th>
                      <th class="py-3 px-2">Description</th>
                      <th class="py-3 px-2 w-16 text-center">Qty</th>
                      <th class="py-3 px-2 w-20 text-center">Satuan</th>
                      <th class="py-3 px-2 w-28 text-right">Unit Price (Rp)</th>
                      <th class="py-3 px-2 w-28 text-right">Total (Rp)</th>
                      <th class="py-3 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="(item, idx) in form.items" :key="idx" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                      <td class="py-2 px-2 text-center text-xs font-bold text-gray-500">{{ idx + 1 }}</td>
                      <td class="py-2 px-2">
                        <input v-model="item.description" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Item description">
                      </td>
                      <td class="py-2 px-2">
                        <input v-model.number="item.qty" type="number" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-center dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="0">
                      </td>
                      <td class="py-2 px-2">
                        <input v-model="item.satuan" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-center dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="pcs">
                      </td>
                      <td class="py-2 px-2">
                        <input v-model.number="item.unitPrice" type="number" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-right font-mono dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="0">
                      </td>
                      <td class="py-2 px-2 text-right text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                        {{ formatCurrency(itemTotal(item)) }}
                      </td>
                      <td class="py-2 px-2 text-center">
                        <button @click="removeItem(idx)" class="text-red-400 hover:text-red-600">
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <td colspan="5" class="py-3 px-2 text-right text-xs font-black text-gray-700 dark:text-gray-300 uppercase">TOTAL</td>
                      <td class="py-3 px-2 text-right text-sm font-black text-red-700 dark:text-red-500 font-mono">{{ formatCurrency(subtotal) }}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
                <button @click="addItem" class="mt-3 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors w-full">
                  <span class="material-symbols-outlined text-sm align-middle mr-1">add</span> Tambah Item
                </button>
              </div>

              <!-- RIGHT: Project & Material Reference -->
              <div class="w-full lg:w-72 flex-shrink-0 space-y-4">
                <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Project</label>
                  <textarea v-model="form.projectNames" rows="3" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Pak Arif, Kost Pogung, Mas Temo"></textarea>
                  <p class="text-[9px] text-gray-400 mt-1">Pisahkan dengan koma</p>
                </div>
                <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Material Reference</label>
                  <textarea v-model="form.materialRef" rows="6" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="multi 15mm polos&#10;blockmin 15mm 1 sisi&#10;hpl 1mm 1 sisi&#10;..."></textarea>
                  <p class="text-[9px] text-gray-400 mt-1">Pisahkan dengan baris baru</p>
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="flex flex-col lg:flex-row gap-6 mb-6">
              <div class="flex-1"></div>
              <div class="w-full lg:w-80">
                <div class="space-y-2">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span class="text-xs font-bold text-gray-500">Total (Rp)</span>
                    <span class="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{{ formatCurrency(subtotal) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span class="text-xs font-bold text-gray-500">PPN 10%</span>
                    <span class="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{{ formatCurrency(ppn) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 bg-red-50 dark:bg-red-900/20 rounded-xl px-3">
                    <span class="text-xs font-black text-red-700 dark:text-red-400 uppercase">Grand Total (Rp)</span>
                    <span class="text-sm font-mono font-black text-red-700 dark:text-red-400">{{ formatCurrency(grandTotal) }}</span>
                  </div>
                </div>
                <div class="mt-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <span class="text-[10px] text-gray-400 uppercase font-bold">Terbilang:</span>
                  <p class="text-xs text-gray-600 dark:text-gray-300 italic mt-1">{{ terbilang(grandTotal) }}</p>
                </div>
              </div>
            </div>

            <!-- Ordered By, Purchasing, Prepared By, Approved By -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Ordered By</label>
                  <input v-model="form.orderedBy" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Nama">
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Purchasing</label>
                  <input v-model="form.purchasing" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Nama">
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Prepared By</label>
                  <input v-model="form.preparedBy" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Nama">
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Approved By</label>
                  <input v-model="form.approvedBy" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Anriko K, ST." readonly>
                </div>
              </div>
            </div>

            <!-- Note, Deliver By, Deliver To -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Note</label>
                <textarea v-model="form.notes" rows="2" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Catatan tambahan..."></textarea>
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Deliver By</label>
                <input v-model="form.deliverBy" type="date" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Deliver To</label>
                <input v-model="form.deliverTo" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Lokasi pengiriman">
              </div>
            </div>

            <!-- Term of Payment -->
            <div class="mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center gap-3">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Term of Payment:</span>
              <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Anriko K, ST.</span>
            </div>

            <!-- Office Footer -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 text-[10px] text-gray-400 text-center">
              <p class="font-bold">OFFICE:</p>
              <p>Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24</p>
              <p>Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
              <p>Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com | IG: @pengrajin_interiorkcm</p>
            </div>
          </div>
        </div>

        <!-- ============ TAB: DAFTAR PO ============ -->
        <div v-if="activeTab === 'list'" class="space-y-6">
          <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 text-xxs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                    <th class="py-4 px-6">No PO</th>
                    <th class="py-4 px-6">Supplier</th>
                    <th class="py-4 px-6">Attn</th>
                    <th class="py-4 px-6">Tanggal</th>
                    <th class="py-4 px-6">Grand Total</th>
                    <th class="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <tr v-if="poList.length === 0">
                    <td colspan="6" class="py-12 text-center text-gray-400">Belum ada PO tersimpan.</td>
                  </tr>
                  <tr v-else v-for="po in poList" :key="po.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td class="py-4 px-6 font-bold text-red-800 dark:text-red-500">{{ po.po_number }}</td>
                    <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white">{{ po.to_supplier || '-' }}</td>
                    <td class="py-4 px-6 text-gray-500 dark:text-gray-400">{{ po.attn || '-' }}</td>
                    <td class="py-4 px-6 text-gray-400">{{ formatDateID(po.date) }}</td>
                    <td class="py-4 px-6 font-mono font-semibold text-gray-900 dark:text-white">{{ formatCurrency(po.grand_total) }}</td>
                    <td class="py-4 px-6 text-center space-x-3">
                      <button @click="viewPO(po)" class="text-blue-600 hover:text-blue-800">
                        <span class="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button @click="deletePO(po.id)" class="text-red-600 hover:text-red-800">
                        <span class="material-symbols-outlined text-base">delete</span>
                      </button>
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
import { ref, reactive, onMounted, computed } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'
import { formatCurrency, formatDate } from '../../utils/helpers'

const api = useApi()
const appStore = useAppStore()

const activeTab = ref('form')
const tabs = [
  { id: 'form', name: 'Form PO', icon: 'edit_note' },
  { id: 'list', name: 'Daftar PO', icon: 'list' }
]

const today = new Date()
const monthRoman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][today.getMonth()]

const form = ref({
  nomorRef: `B.803/KCM/${monthRoman}/${today.getFullYear()}`,
  tanggal: today.toISOString().split('T')[0],
  to: '',
  phone: '',
  attn: '',
  projectNames: '',
  materialRef: '',
  notes: '',
  deliverBy: '',
  deliverTo: '',
  orderedBy: '',
  purchasing: '',
  preparedBy: '',
  approvedBy: 'Anriko K, ST.',
  items: [{ description: '', qty: 0, satuan: 'pcs', unitPrice: 0 }]
})

const rabList = ref([])
const selectedRabId = ref('')
const poList = ref([])

function itemTotal(item) {
  return (item.qty || 0) * (item.unitPrice || 0)
}

const subtotal = computed(() => form.value.items.reduce((sum, i) => sum + itemTotal(i), 0))
const ppn = computed(() => Math.round(subtotal.value * 0.1))
const grandTotal = computed(() => subtotal.value + ppn.value)

function addItem() {
  form.value.items.push({ description: '', qty: 0, satuan: 'pcs', unitPrice: 0 })
}
function removeItem(idx) {
  if (form.value.items.length > 1) form.value.items.splice(idx, 1)
}

function formatDateID(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadRabList() {
  try {
    const data = await api.get('/api/rab')
    rabList.value = data.filter ? (data.rab || data) : data
    if (Array.isArray(data)) rabList.value = data
  } catch (e) { console.error(e) }
}

async function loadRabData() {
  if (!selectedRabId.value) return
  try {
    const rab = await api.get(`/api/rab/${selectedRabId.value}`)
    form.value.projectNames = rab.project_name || ''
    if (rab.items && rab.items.length > 0) {
      form.value.items = rab.items.map(i => ({
        description: i.description || i.item_name || '',
        qty: i.qty || 0,
        satuan: i.satuan || i.unit || 'pcs',
        unitPrice: i.unit_price || 0
      }))
    }
  } catch (e) { console.error(e) }
}

async function loadPOList() {
  try {
    poList.value = await api.get('/api/po')
  } catch (e) { console.error(e) }
}

async function savePO() {
  if (!form.value.nomorRef) {
    appStore.showAlert('Nomor PO wajib diisi.', 'error')
    return
  }
  try {
    await api.post('/api/po', {
      po_number: form.value.nomorRef,
      to_supplier: form.value.to,
      date: form.value.tanggal,
      phone: form.value.phone,
      attn: form.value.attn,
      rab_id: selectedRabId.value || null,
      items: form.value.items,
      projects: form.value.projectNames,
      material_ref: form.value.materialRef,
      total: subtotal.value,
      ppn: ppn.value,
      grand_total: grandTotal.value,
      in_words: terbilang(grandTotal.value),
      note: form.value.notes,
      deliver_by: form.value.deliverBy,
      deliver_to: form.value.deliverTo,
      ordered_by: form.value.orderedBy,
      purchasing: form.value.purchasing,
      prepared_by: form.value.preparedBy,
      approved_by: form.value.approvedBy,
      term_of_payment: 'Anriko K, ST.'
    })
    appStore.showAlert('PO berhasil disimpan.', 'success')
    await loadPOList()
  } catch (err) {
    appStore.showAlert('Gagal menyimpan PO: ' + (err.response?.data?.error || err.message), 'error')
  }
}

async function viewPO(po) {
  try {
    const full = await api.get(`/api/po/${po.id}`)
    form.value.nomorRef = full.po_number || ''
    form.value.tanggal = full.date ? full.date.split('T')[0] : ''
    form.value.to = full.to_supplier || ''
    form.value.phone = full.phone || ''
    form.value.attn = full.attn || ''
    form.value.projectNames = full.projects || ''
    form.value.materialRef = full.material_ref || ''
    form.value.notes = full.note || ''
    form.value.deliverBy = full.deliver_by ? full.deliver_by.split('T')[0] : ''
    form.value.deliverTo = full.deliver_to || ''
    form.value.orderedBy = full.ordered_by || ''
    form.value.purchasing = full.purchasing || ''
    form.value.preparedBy = full.prepared_by || ''
    form.value.approvedBy = full.approved_by || 'Anriko K, ST.'
    if (full.items && Array.isArray(full.items)) {
      form.value.items = full.items.map(i => ({
        description: i.description || '',
        qty: i.qty || 0,
        satuan: i.satuan || 'pcs',
        unitPrice: i.unitPrice || i.unit_price || 0
      }))
    }
    activeTab.value = 'form'
  } catch (err) {
    appStore.showAlert('Gagal memuat PO.', 'error')
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

// ─── Terbilang ───
function terbilang(num) {
  if (!num || num === 0) return 'Nol Rupiah'
  const ones = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan']
  const teens = ['Sepuluh','Sebelas','Dua Belas','Tiga Belas','Empat Belas','Lima Belas','Enam Belas','Tujuh Belas','Delapan Belas','Sembilan Belas']
  const tens = ['','','Dua Puluh','Tiga Puluh','Empat Puluh','Lima Puluh','Enam Puluh','Tujuh Puluh','Delapan Puluh','Sembilan Puluh']
  function convertGroup(n) {
    if (n === 0) return ''
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    const h = Math.floor(n / 100), rest = n % 100
    return (h === 1 ? 'Seratus' : ones[h] + ' Ratus') + (rest ? ' ' + convertGroup(rest) : '')
  }
  const groups = []
  let r = Math.floor(num)
  while (r > 0) { groups.unshift(r % 1000); r = Math.floor(r / 1000) }
  const suffixes = ['','Ribu','Juta','Milyar','Triliun']
  let result = ''
  for (let i = 0; i < groups.length; i++) {
    const idx = groups.length - 1 - i
    if (groups[i] === 0) continue
    let part = convertGroup(groups[i])
    if (idx === 1 && groups[i] === 1) part = 'Se'
    result += (result ? ' ' : '') + part + ' ' + suffixes[idx]
  }
  return result.trim() + ' Rupiah'
}

// ─── Print / PDF ───
function generatePrintHTML() {
  const d = form.value
  const projectList = d.projectNames ? d.projectNames.split(',').map(s => s.trim()).filter(Boolean) : []
  const materialLines = d.materialRef ? d.materialRef.split('\n').map(s => s.trim()).filter(Boolean) : []

  const itemsRows = d.items.map((item, idx) => `
    <tr>
      <td style="text-align:center; padding:6px 8px; border:1px solid #333; font-size:11px;">${idx + 1}</td>
      <td style="padding:6px 8px; border:1px solid #333; font-size:11px;">${item.description || ''}</td>
      <td style="text-align:center; padding:6px 8px; border:1px solid #333; font-size:11px;">${item.qty || 0}</td>
      <td style="text-align:center; padding:6px 8px; border:1px solid #333; font-size:11px;">${item.satuan || ''}</td>
      <td style="text-align:right; padding:6px 8px; border:1px solid #333; font-size:11px; font-family:monospace;">Rp ${Number(item.unitPrice || 0).toLocaleString('id-ID')}</td>
      <td style="text-align:right; padding:6px 8px; border:1px solid #333; font-size:11px; font-family:monospace;">Rp ${Number(itemTotal(item)).toLocaleString('id-ID')}</td>
    </tr>
  `).join('')

  const projectItems = projectList.map(p => `<div style="padding:2px 0; font-size:11px;">&bull; ${p}</div>`).join('')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>PO ${d.nomorRef}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; padding: 20mm 15mm; color:#333; font-size:12px; }
  @media print {
    body { padding: 10mm 12mm; }
    @page { size: A4; margin: 10mm; }
  }
  .header { text-align:center; border-bottom:3px double #333; padding-bottom:12px; margin-bottom:16px; }
  .header h1 { font-size:18px; margin:0 0 4px; letter-spacing:2px; font-weight:900; }
  .header p { font-size:9px; color:#666; margin:2px 0; }
  .title { text-align:center; font-size:14px; font-weight:900; letter-spacing:4px; border-bottom:2px solid #333; padding-bottom:8px; margin-bottom:16px; text-transform:uppercase; }
  .info-table { width:100%; margin-bottom:12px; font-size:11px; }
  .info-table td { padding:3px 0; vertical-align:top; }
  .info-table .lbl { font-weight:bold; width:55px; color:#555; }
  .supply-text { font-size:11px; font-style:italic; margin:10px 0 14px; color:#555; }
  table.items { width:100%; border-collapse:collapse; margin-bottom:0; }
  table.items th, table.items td { border:1px solid #333; padding:5px 7px; font-size:11px; }
  table.items th { background:#f0f0f0; font-weight:bold; text-transform:uppercase; font-size:10px; }
  .total-row td { font-weight:bold; background:#fef2f2; font-size:12px; border:1px solid #333; }
  .right-section { width:100%; text-align:right; margin-top:10px; }
  .right-section .project-box { display:inline-block; text-align:left; border:1px solid #999; padding:8px 12px; margin-bottom:8px; font-size:11px; }
  .right-section .project-box h4 { font-size:9px; font-weight:bold; text-transform:uppercase; color:#888; margin-bottom:4px; }
  .sig-grid { display:flex; justify-content:flex-end; gap:40px; margin-top:16px; }
  .sig-item { text-align:center; width:120px; }
  .sig-item .sig-label { font-size:9px; font-weight:bold; text-transform:uppercase; color:#888; margin-bottom:4px; }
  .sig-item .sig-line { border-bottom:1px solid #333; height:40px; margin-bottom:2px; }
  .sig-item .sig-name { font-size:10px; }
  .summary { display:flex; justify-content:flex-end; margin:16px 0 6px; }
  .summary-box { width:280px; }
  .summary-box .row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #eee; font-size:11px; }
  .summary-box .grand { background:#fef2f2; padding:6px 10px; font-weight:900; font-size:12px; color:#991b1b; border:1px solid #fecaca; }
  .terbilang { font-size:10px; color:#555; font-style:italic; margin:8px 0 14px; padding:6px 10px; background:#f9f9f9; }
  .bottom-section { margin-top:16px; }
  .note-section { padding:8px 10px; background:#f9f9f9; font-size:10px; margin-top:8px; }
  .note-section p { margin:3px 0; }
  .footer { margin-top:20px; text-align:center; font-size:9px; color:#888; border-top:2px double #333; padding-top:10px; }
</style>
</head>
<body>

<div class="header">
  <h1>CV. KURNIA CIPTA MANDIRI</h1>
  <p>Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24, Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
  <p>Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com | IG: @pengrajin_interiorkcm</p>
</div>

<div class="title">PURCHASE ORDER</div>

<table class="info-table">
  <tr><td class="lbl">No.</td><td>${d.nomorRef}</td><td class="lbl" style="width:55px;">Date</td><td>${d.tanggal || '-'}</td></tr>
  <tr><td class="lbl">To :</td><td>${d.to || '-'}</td><td class="lbl">Phone</td><td>${d.phone || '-'}</td></tr>
  <tr><td class="lbl">Attn</td><td colspan="3">${d.attn || '-'}</td></tr>
</table>

<p class="supply-text">Please supply the following goods/services as per the terms stated here in:</p>

<table class="items">
  <thead>
    <tr>
      <th style="width:35px; text-align:center;">No</th>
      <th>Description</th>
      <th style="width:50px; text-align:center;">Qty</th>
      <th style="width:60px; text-align:center;">Sat</th>
      <th style="width:120px; text-align:right;">Unit Price (Rp)</th>
      <th style="width:120px; text-align:right;">Total (Rp)</th>
    </tr>
  </thead>
  <tbody>
    ${itemsRows}
  </tbody>
  <tfoot>
    <tr class="total-row">
      <td colspan="5" style="text-align:right;">TOTAL</td>
      <td style="text-align:right; font-family:monospace; color:#991b1b;">Rp ${Number(subtotal.value).toLocaleString('id-ID')}</td>
    </tr>
  </tfoot>
</table>

<div class="right-section">
  ${projectList.length ? `<div class="project-box"><h4>PROJECT:</h4>${projectItems}</div>` : ''}
</div>

<div class="sig-grid">
  <div class="sig-item">
    <div class="sig-label">Ordered By</div>
    <div class="sig-line"></div>
    <div class="sig-name">${d.orderedBy || ''}</div>
  </div>
  <div class="sig-item">
    <div class="sig-label">Purchased By</div>
    <div class="sig-line"></div>
    <div class="sig-name">${d.purchasing || ''}</div>
  </div>
</div>

<div class="summary">
  <div class="summary-box">
    <div class="row"><span>Total (Rp)</span><span style="font-family:monospace; font-weight:bold;">Rp ${Number(subtotal.value).toLocaleString('id-ID')}</span></div>
    <div class="row"><span>PPN 10%</span><span style="font-family:monospace; font-weight:bold;">Rp ${Number(ppn.value).toLocaleString('id-ID')}</span></div>
    <div class="row grand"><span>Grand Total (Rp)</span><span style="font-family:monospace;">Rp ${Number(grandTotal.value).toLocaleString('id-ID')}</span></div>
  </div>
</div>

<div class="terbilang">In Words : <strong>${terbilang(grandTotal.value)}</strong></div>

<div class="sig-grid" style="margin-top:20px;">
  <div class="sig-item">
    <div class="sig-label">Approved By</div>
    <div class="sig-line"></div>
    <div class="sig-name">${d.approvedBy || 'Anriko K, ST.'}</div>
  </div>
</div>

<div class="bottom-section">
  <div class="note-section">
    <p><strong>Note:</strong> ${d.notes || '-'}</p>
    <p><strong>Deliver by:</strong> ${d.deliverBy || '-'}</p>
    <p><strong>Deliver to:</strong> ${d.deliverTo || '-'}</p>
  </div>
  <div style="margin-top:8px; font-size:10px; padding:6px 10px; background:#f9f9f9;">
    <strong>Term of Payment:</strong> Anriko K, ST.
  </div>
</div>

<div class="footer">
  <p><strong>OFFICE:</strong></p>
  <p>Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24</p>
  <p>Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
  <p>Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com | IG: @pengrajin_interiorkcm</p>
</div>

</body>
</html>`
}

function downloadPDF() {
  const win = window.open('', '_blank')
  win.document.write(generatePrintHTML())
  win.document.close()
}

function cetakPO() {
  const win = window.open('', '_blank')
  win.document.write(generatePrintHTML())
  win.document.close()
  setTimeout(() => { win.print() }, 500)
}

onMounted(() => { loadRabList(); loadPOList() })
</script>
