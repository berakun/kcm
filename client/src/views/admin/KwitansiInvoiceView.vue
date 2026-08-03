<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <AppTopbar title="Kwitansi & Invoice" />
      <div class="p-6 md:p-8 flex-grow space-y-6 overflow-y-auto">

        <!-- Header Bar -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">Kwitansi & Invoice</h2>
              <p class="text-xs text-gray-400 mt-1">Upload bukti kwitansi / invoice per project</p>
            </div>
            <button
              @click="openUploadModal()"
              class="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors bg-red-800 hover:bg-red-900 text-white"
            >
              <span class="material-symbols-outlined text-sm">add</span> Upload File
            </button>
          </div>
        </div>

        <!-- Filter by Project -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-3 flex-wrap">
              <select v-model="filterRabId" @change="loadList" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                <option value="">Semua Project</option>
                <option v-for="r in rabList" :key="r.id" :value="r.id">[{{ r.code }}] {{ r.project_name }}</option>
              </select>
              <select v-model="filterType" @change="loadList" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                <option value="">Semua Jenis</option>
                <option value="kwitansi">Kwitansi</option>
                <option value="invoice">Invoice</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Grouped by Project -->
        <div v-if="loading" class="text-center py-16 text-gray-400 text-xs">Memuat data...</div>
        <div v-else-if="groupedData.length === 0" class="text-center py-16 text-gray-400 text-xs">Belum ada kwitansi/invoice diupload.</div>

        <template v-else>
          <div v-for="group in groupedData" :key="group.rab_id" class="space-y-3">
            <!-- Project Header -->
            <div class="flex items-center gap-3 bg-white dark:bg-gray-850 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <span class="material-symbols-outlined text-red-700 text-lg">folder_open</span>
              <div>
                <span class="font-bold text-sm text-gray-800 dark:text-white">{{ group.project_name }}</span>
                <span class="text-[10px] text-gray-400 ml-2">{{ group.rab_code }}</span>
              </div>
              <span class="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{{ group.items.length }} file</span>
            </div>

            <!-- Table -->
            <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ml-2">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                    <th class="py-3 px-5 w-10 text-center">No</th>
                    <th class="py-3 px-5">Jenis</th>
                    <th class="py-3 px-5">Tanggal</th>
                    <th class="py-3 px-5">Nama File</th>
                    <th class="py-3 px-5 hidden sm:table-cell">Deskripsi</th>
                    <th class="py-3 px-5 text-center">Preview</th>
                    <th class="py-3 px-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <tr v-for="(item, idx) in group.items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td class="py-3 px-5 text-center text-gray-400">{{ idx + 1 }}</td>
                    <td class="py-3 px-5">
                      <span :class="item.type === 'kwitansi' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{{ item.type }}</span>
                    </td>
                    <td class="py-3 px-5 text-gray-500">{{ formatDateID(item.date) }}</td>
                    <td class="py-3 px-5 font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{{ item.original_name }}</td>
                    <td class="py-3 px-5 text-gray-400 hidden sm:table-cell truncate max-w-[200px]">{{ item.description || '-' }}</td>
                    <td class="py-3 px-5 text-center">
                      <button @click="openPreview(item)" class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Lihat">
                        <span class="material-symbols-outlined text-sm">visibility</span>
                      </button>
                    </td>
                    <td class="py-3 px-5 text-center">
                      <button @click="deleteItem(item)" class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Hapus">
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Upload Modal -->
    <teleport to="body">
      <div v-if="showUpload" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showUpload = false">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showUpload = false"></div>
        <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-lg z-10">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-2xl">
            <h3 class="text-sm font-bold text-gray-800 dark:text-white">Upload Kwitansi / Invoice</h3>
            <button @click="showUpload = false" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Project (RAB) *</label>
              <select v-model="form.rab_id" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                <option value="">Pilih Project</option>
                <option v-for="r in rabList" :key="r.id" :value="r.id">[{{ r.code }}] {{ r.project_name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Jenis *</label>
                <select v-model="form.type" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
                  <option value="kwitansi">Kwitansi</option>
                  <option value="invoice">Invoice</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tanggal</label>
                <input type="date" v-model="form.date" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0" />
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Deskripsi</label>
              <textarea v-model="form.description" rows="2" class="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0 resize-none" placeholder="Catatan opsional..."></textarea>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">File (Gambar / PDF / Excel) *</label>
              <div
                @dragover.prevent="dragActive = true"
                @dragleave="dragActive = false"
                @drop.prevent="handleDrop"
                :class="[dragActive ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700']"
                class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
                @click="$refs.fileInput.click()"
              >
                <input ref="fileInput" type="file" accept="image/*,.pdf,.xls,.xlsx,.csv" class="hidden" @change="handleFile" />
                <span class="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-600">cloud_upload</span>
                <p class="text-xs text-gray-400 mt-2" v-if="!form.file">Klik atau drag & drop file di sini</p>
                <p class="text-xs text-green-600 font-semibold mt-2" v-else>{{ form.file.name }}</p>
                <p class="text-[10px] text-gray-400 mt-1">Maks 10MB — JPG, PNG, PDF, XLS, XLSX, CSV</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
            <button @click="showUpload = false" class="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Batal</button>
            <button @click="submitUpload" :disabled="!form.rab_id || !form.file || uploading" class="px-5 py-2 bg-red-800 hover:bg-red-900 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5">
              <span v-if="uploading" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              {{ uploading ? 'Mengupload...' : 'Upload' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Preview Modal -->
    <teleport to="body">
      <div v-if="previewItem" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="previewItem = null">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="previewItem = null"></div>
        <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-10 w-full" :class="previewItem.file_type === 'image' ? 'max-w-3xl' : 'max-w-4xl'">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-2xl">
            <h3 class="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span :class="previewItem.type === 'kwitansi' ? 'text-amber-600' : 'text-blue-600'" class="material-symbols-outlined text-base">{{ previewItem.type === 'kwitansi' ? 'receipt' : 'invoice' }}</span>
              {{ previewItem.original_name }}
            </h3>
            <div class="flex items-center gap-2">
              <a :href="previewItem.file_path" target="_blank" download class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">download</span> Unduh
              </a>
              <button @click="previewItem = null" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
          <div class="p-6 flex justify-center items-center min-h-[300px] max-h-[70vh] overflow-auto bg-gray-50 dark:bg-gray-900/30">
            <img v-if="previewItem.file_type === 'image'" :src="previewItem.file_path" :alt="previewItem.original_name" class="max-w-full max-h-[65vh] rounded-lg shadow" />
            <iframe v-else-if="previewItem.file_type === 'pdf'" :src="previewItem.file_path" class="w-full h-[65vh] rounded-lg border-0"></iframe>
            <div v-else class="text-center py-10">
              <span class="material-symbols-outlined text-5xl text-gray-300">table_chart</span>
              <p class="text-xs text-gray-400 mt-3">File Excel — klik unduh untuk membuka</p>
              <a :href="previewItem.file_path" target="_blank" download class="mt-4 inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl">Download File</a>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'

const api = useApi()
const appStore = useAppStore()

const rabList = ref([])
const allItems = ref([])
const loading = ref(true)
const filterRabId = ref('')
const filterType = ref('')

// Upload
const showUpload = ref(false)
const uploading = ref(false)
const dragActive = ref(false)
const form = reactive({ rab_id: '', type: 'kwitansi', date: '', description: '', file: null })

// Preview
const previewItem = ref(null)

const groupedData = computed(() => {
  const groups = {}
  for (const item of allItems.value) {
    if (!groups[item.rab_id]) {
      groups[item.rab_id] = { rab_id: item.rab_id, rab_code: item.rab_code, project_name: item.project_name, items: [] }
    }
    groups[item.rab_id].items.push(item)
  }
  return Object.values(groups)
})

function formatDateID(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
}

function openUploadModal() {
  form.rab_id = filterRabId.value || ''
  form.type = 'kwitansi'
  form.date = new Date().toISOString().slice(0, 10)
  form.description = ''
  form.file = null
  showUpload.value = true
}

function handleFile(e) {
  const f = e.target.files?.[0]
  if (f) form.file = f
}

function handleDrop(e) {
  dragActive.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) form.file = f
}

async function submitUpload() {
  if (!form.rab_id || !form.file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('rab_id', form.rab_id)
    fd.append('type', form.type)
    fd.append('date', form.date)
    fd.append('description', form.description)
    fd.append('file', form.file)
    await api.post('/api/kwitansi', fd, true)
    appStore.showAlert('File berhasil diupload!', 'success')
    showUpload.value = false
    await loadList()
  } catch (err) {
    appStore.showAlert(err.response?.data?.error || 'Gagal upload.', 'error')
  } finally {
    uploading.value = false
  }
}

function openPreview(item) {
  previewItem.value = item
}

async function deleteItem(item) {
  if (!confirm(`Hapus file "${item.original_name}"?`)) return
  try {
    await api.delete(`/api/kwitansi/${item.id}`)
    appStore.showAlert('Berhasil dihapus.', 'success')
    await loadList()
  } catch (err) {
    appStore.showAlert('Gagal menghapus.', 'error')
  }
}

async function loadList() {
  loading.value = true
  try {
    const params = {}
    if (filterRabId.value) params.rab_id = filterRabId.value
    allItems.value = await api.get('/api/kwitansi', params)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadRabList() {
  try {
    const data = await api.get('/api/rab')
    rabList.value = Array.isArray(data) ? data : (data.rab || [])
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await Promise.all([loadRabList(), loadList()])
})
</script>
