<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h3 class="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-base text-red-600">{{ editingId ? 'edit' : 'add' }}</span>
              {{ editingId ? 'Edit PO' : 'Buat PO Baru' }}
            </h3>
            <div class="flex gap-2">
              <button @click="savePO" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">save</span> Simpan PO
              </button>
              <button @click="closeModal" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
          <!-- Modal Body: PO Form -->
          <div class="p-6">
            <div class="space-y-6">
              <!-- PO Form (screen) -->
              <div class="bg-white dark:bg-gray-850 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">

                <!-- KCM Header -->
                <div class="text-center mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
                  <img src="/logo-transparent.png" alt="KCM Logo" class="w-16 h-16 mx-auto mb-3 object-contain">
                  <h1 class="text-lg font-black text-gray-900 dark:text-white tracking-wide">CV. KURNIA CIPTA MANDIRI</h1>
                  <p class="text-[10px] text-gray-400 mt-1">Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24, Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
                  <p class="text-[10px] text-gray-400">Telp/Wa: 0858.6800.0012 | Email: kcm_production@ymail.com | IG: @pengrajin_interiorkcm</p>
                </div>

                <!-- PO Title -->
                <h2 class="text-center text-sm font-black tracking-widest text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">PURCHASE ORDER</h2>

                <!-- PO Info Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Nomor PO (Bisa Diedit Manual)</label>
                    <input v-model="form.nomorRef" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" :placeholder="'Contoh: ' + generatedPoNumber">
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
                        <tr class="border-b-2 border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase">
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
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Ordered By</label>
                      <input v-model="form.orderedBy" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Nama">
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Purchasing</label>
                      <input v-model="form.purchasing" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Nama">
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
                    <input v-model="form.deliverBy" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Contoh: 3 hari setelah PO / 15 Juli 2026">
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Deliver To</label>
                    <input v-model="form.deliverTo" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Lokasi pengiriman">
                  </div>
                </div>

                <!-- Term of Payment -->
                <div class="mt-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Term of Payment</label>
                  <input v-model="form.termOfPayment" type="text" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" placeholder="Contoh: Transfer / Cash / Tempo 30 Hari">
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
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'
import { formatCurrency } from '../../utils/helpers'

const props = defineProps({
  show: { type: Boolean, default: false },
  editingId: { type: [Number, null], default: null }, // null = create, number = edit
  initialData: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:show', 'saved'])

const api = useApi()
const appStore = useAppStore()

const today = new Date()
const monthRoman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][today.getMonth()]

const form = ref({})
const rabList = ref([])
const selectedRabId = ref('')
const generatedPoNumber = ref('')

// Watch props.show and props.initialData together to populate or reset form
watch([() => props.show, () => props.initialData], ([show, initialData]) => {
  if (show) {
    loadRabList()
    if (initialData && Object.keys(initialData).length > 0) {
      loadPOIntoForm(initialData)
    } else {
      resetForm()
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function closeModal() {
  emit('update:show', false)
  resetForm()
}

const itemTotal = (item) => (item.qty || 0) * (item.unitPrice || 0)
const subtotal = computed(() => form.value.items.reduce((sum, i) => sum + itemTotal(i), 0))
const ppn = computed(() => Math.round(subtotal.value * 0.1))
const grandTotal = computed(() => subtotal.value + ppn.value)

function addItem() {
  form.value.items.push({ description: '', qty: 0, satuan: 'pcs', unitPrice: 0 })
}
function removeItem(idx) {
  if (form.value.items.length > 1) form.value.items.splice(idx, 1)
}

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

async function loadRabList() {
  try {
    const data = await api.get('/api/rab')
    rabList.value = Array.isArray(data) ? data : (data.rab || [])
  } catch (e) { console.error(e) }
}

async function loadRabData() {
  if (!selectedRabId.value) {
    // Clear projectNames and items if no RAB is selected
    form.value.projectNames = ''
    form.value.items = [{ description: '', qty: 0, satuan: 'pcs', unitPrice: 0 }]
    return
  }
  try {
    const rab = await api.get('/api/rab', { id: selectedRabId.value })
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

function resetForm() {
  generatedPoNumber.value = `B.803/KCM/${monthRoman}/${today.getFullYear()}`
  form.value = {
    nomorRef: '',
    tanggal: today.toISOString().split('T')[0],
    to: '', phone: '', attn: '', projectNames: '', materialRef: '', notes: '',
    deliverBy: '', deliverTo: '', orderedBy: '', purchasing: '',
    approvedBy: 'Anriko K, ST.', termOfPayment: 'Anriko K, ST.',
    items: [{ description: '', qty: 0, satuan: 'pcs', unitPrice: 0 }]
  }
  selectedRabId.value = ''
}

function buildPayload() {
  return {
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
    approved_by: form.value.approvedBy,
    term_of_payment: form.value.termOfPayment
  }
}

async function savePO() {
  if (!form.value.nomorRef) {
    form.value.nomorRef = generatedPoNumber.value
  }
  if (!form.value.nomorRef) {
    appStore.showAlert('Nomor PO wajib diisi.', 'error')
    return
  }
  try {
    if (props.editingId) {
      await api.put(`/api/po/${props.editingId}`, buildPayload())
      appStore.showAlert('PO berhasil diupdate.', 'success')
    } else {
      await api.post('/api/po', buildPayload())
      appStore.showAlert('PO berhasil disimpan.', 'success')
    }
    emit('saved')
    closeModal()
  } catch (err) {
    appStore.showAlert('Gagal menyimpan PO: ' + (err.response?.data?.error || err.message), 'error')
  }
}

function loadPOIntoForm(full) {
  form.value.nomorRef = full.po_number || ''
  form.value.tanggal = full.date ? full.date.split('T')[0] : ''
  form.value.to = full.to_supplier || ''
  form.value.phone = full.phone || ''
  form.value.attn = full.attn || ''
  form.value.projectNames = full.projects || ''
  form.value.materialRef = full.material_ref || ''
  form.value.notes = full.note || ''
  form.value.deliverBy = full.deliver_by || ''
  form.value.deliverTo = full.deliver_to || ''
  form.value.orderedBy = full.ordered_by || ''
  form.value.purchasing = full.purchasing || ''
  form.value.approvedBy = full.approved_by || 'Anriko K, ST.'
  form.value.termOfPayment = full.term_of_payment || 'Anriko K, ST.'
  selectedRabId.value = full.rab_id || ''
  if (full.items && Array.isArray(full.items)) {
    form.value.items = full.items.map(i => ({
      description: i.description || '',
      qty: i.qty || 0,
      satuan: i.satuan || 'pcs',
      unitPrice: i.unitPrice || i.unit_price || 0
    }))
  } else {
    form.value.items = [{ description: '', qty: 0, satuan: 'pcs', unitPrice: 0 }]
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
