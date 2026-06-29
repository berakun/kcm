<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <!-- Topbar -->
      <AppTopbar title="Kelola Portfolio" />

      <!-- Portfolio Body -->
      <div class="p-8 flex-grow space-y-6 overflow-y-auto">
        
        <!-- Filter pills & Add Button -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-2.5">
            <button 
              v-for="cat in categories" 
              :key="cat.value" 
              @click="activeCategory = cat.value"
              :class="[
                activeCategory === cat.value
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'bg-white text-gray-655 dark:bg-gray-850 dark:text-gray-300 border border-gray-150 hover:bg-gray-50',
                'px-5 py-2 rounded-full text-xs font-bold transition-all duration-200'
              ]"
            >
              {{ cat.label }}
            </button>
          </div>
          
          <button @click="openAddModal" class="bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap">
            <span class="material-symbols-outlined text-sm">add_photo_alternate</span>
            Tambah Portfolio
          </button>
        </div>

        <!-- Portfolio Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-if="filteredItems.length === 0" class="col-span-full text-center py-12 text-gray-400">
            Belum ada proyek dalam kategori ini.
          </div>
          <div 
            v-else 
            v-for="p in filteredItems" 
            :key="p.id"
            class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-850 shadow-sm border border-gray-150 dark:border-gray-800/60 transition-all duration-300 hover:shadow-md"
          >
            <div class="aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
              <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" :src="getImageUrl(p.images?.[0])" :alt="p.title"/>
              <span :class="[p.status === 'published' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-gray-500 bg-gray-50 dark:bg-gray-900/40', 'absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-lg']">
                {{ p.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </div>
            <div class="p-5 space-y-3">
              <div>
                <span class="text-[10px] uppercase tracking-widest font-extrabold text-amber-600 capitalize">{{ p.category }}</span>
                <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate mt-1">{{ p.title }}</h3>
              </div>
              <div class="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-3">
                <span class="text-[10px] text-gray-400 flex items-center">
                  <span class="material-symbols-outlined text-xs mr-1">location_on</span>{{ p.location || '-' }}
                </span>
                <div class="space-x-1.5 flex items-center">
                  <button @click="editPortfolio(p)" class="p-1.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-600 hover:text-amber-800">
                    <span class="material-symbols-outlined text-sm align-middle">edit</span>
                  </button>
                  <button @click="deletePortfolio(p.id)" class="p-1.5 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-600 hover:text-red-800">
                    <span class="material-symbols-outlined text-sm align-middle">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Portfolio Form Modal -->
    <BaseModal :show="showModal" :title="modalTitle" @close="closeModal">
      <form @submit.prevent="submitForm" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Judul Proyek</label>
            <input v-model="form.title" type="text" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Kategori Proyek</label>
            <select v-model="form.category" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0">
              <option value="residential">Residential</option>
              <option value="office">Office</option>
              <option value="hotel">Hotel</option>
              <option value="kost">Kost</option>
              <option value="rumah_sakit">Rumah Sakit</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Client</label>
            <input v-model="form.client_name" type="text" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Lokasi</label>
            <input v-model="form.location" type="text" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Tahun Proyek</label>
            <input v-model="form.year" type="number" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Deskripsi Singkat</label>
          <textarea v-model="form.description" rows="3" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"></textarea>
        </div>

        <!-- File Upload dropzone -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Upload Gambar Proyek</label>
          <div class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-red-800 transition-colors relative cursor-pointer group" @click="triggerFileInput">
            <span class="material-symbols-outlined text-4xl text-gray-300 group-hover:text-red-800 transition-colors">cloud_upload</span>
            <p class="text-xs font-semibold text-gray-500 mt-2">Klik atau seret file gambar ke sini</p>
            <p class="text-[10px] text-gray-400 mt-1">Mendukung JPG, PNG, atau WEBP (Maks. 5MB)</p>
            <input type="file" id="portfolio-files" multiple class="hidden" accept="image/*" @change="onFilesSelected"/>
          </div>
          <!-- Previews -->
          <div class="flex flex-wrap gap-3 mt-4">
            <div v-for="(img, idx) in previewUrls" :key="idx" class="w-16 h-16 rounded-xl overflow-hidden relative border border-gray-200 group/img">
              <img class="w-full h-full object-cover" :src="img"/>
              <button
                type="button"
                @click.stop="removeImage(idx)"
                class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-[8px] leading-none"
                title="Hapus gambar"
              >✕</button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Status Publikasi</label>
            <select v-model="form.status" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0">
              <option value="draft">Draft (Disembunyikan)</option>
              <option value="published">Published (Ditampilkan)</option>
            </select>
          </div>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Simpan Proyek
          </button>
        </div>
      </form>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import BaseModal from '../../components/ui/BaseModal.vue'
import { useAuth } from '../../composables/useAuth'
import { useApi } from '../../composables/useApi'
import { getImageUrl } from '../../utils/helpers'

const { user } = useAuth()
const api = useApi()

const activeCategory = ref('all')
const portfolios = ref([])
const showModal = ref(false)
const modalTitle = ref('Tambah Portfolio Baru')

const selectedFiles = ref([])
const previewUrls = ref([])
const deletedImages = ref([])
const existingImages = ref([])

const form = ref({
  id: '',
  title: '',
  category: 'residential',
  client_name: '',
  location: '',
  year: 2026,
  description: '',
  status: 'draft'
})

const categories = [
  { label: 'Semua', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Office', value: 'office' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Kost', value: 'kost' },
  { label: 'Rumah Sakit', value: 'rumah_sakit' }
]

onMounted(async () => {
  await fetchPortfolios()
})

async function fetchPortfolios() {
  try {
    const data = await api.get('/api/portfolio?status=all')
    portfolios.value = data
  } catch (err) {
    console.error(err)
  }
}

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') return portfolios.value
  return portfolios.value.filter(p => p.category === activeCategory.value)
})

function triggerFileInput() {
  document.getElementById('portfolio-files').click()
}

function onFilesSelected(e) {
  const files = e.target.files
  if (!files || files.length === 0) return

  if (!form.value.id) {
    previewUrls.value = []
    selectedFiles.value = []
  }

  for (let i = 0; i < files.length; i++) {
    selectedFiles.value.push(files[i])
    const reader = new FileReader()
    reader.onload = (event) => {
      previewUrls.value.push(event.target.result)
    }
    reader.readAsDataURL(files[i])
  }
}

function openAddModal() {
  modalTitle.value = 'Tambah Portfolio Baru'
  form.value = {
    id: '',
    title: '',
    category: 'residential',
    client_name: '',
    location: '',
    year: 2026,
    description: '',
    status: 'draft'
  }
  selectedFiles.value = []
  previewUrls.value = []
  existingImages.value = []
  deletedImages.value = []
  showModal.value = true
}

function editPortfolio(p) {
  modalTitle.value = 'Edit Portfolio Proyek'
  form.value = {
    id: p.id,
    title: p.title,
    category: p.category,
    client_name: p.client_name || '',
    location: p.location || '',
    year: p.year || 2026,
    description: p.description || '',
    status: p.status
  }
  selectedFiles.value = []
  existingImages.value = p.images ? [...p.images] : []
  deletedImages.value = []
  previewUrls.value = p.images ? p.images.map(img => getImageUrl(img)) : []
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function removeImage(idx) {
  // If editing, track original image for deletion
  if (form.value.id && idx < existingImages.value.length) {
    deletedImages.value.push(existingImages.value[idx])
    existingImages.value.splice(idx, 1)
  }
  previewUrls.value.splice(idx, 1)
  if (idx < selectedFiles.value.length) {
    selectedFiles.value.splice(idx, 1)
  }
}

async function submitForm() {
  const formData = new FormData()
  
  // Append fields
  formData.append('title', form.value.title)
  formData.append('category', form.value.category)
  formData.append('client_name', form.value.client_name)
  formData.append('location', form.value.location)
  formData.append('year', form.value.year)
  formData.append('description', form.value.description)
  formData.append('status', form.value.status)

  if (form.value.id) {
    formData.append('id', form.value.id)
    if (deletedImages.value.length > 0) {
      formData.append('deleted_images', deletedImages.value.join(','))
    }
  }

  // Append images
  selectedFiles.value.forEach(file => {
    formData.append('images', file)
  })

  try {
    if (form.value.id) {
      await api.post('/api/portfolio/update', formData, true)
    } else {
      await api.post('/api/portfolio', formData, true)
    }
    closeModal()
    await fetchPortfolios()
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal menyimpan portfolio.')
  }
}

async function deletePortfolio(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return
  try {
    await api.delete('/api/portfolio', { id })
    await fetchPortfolios()
  } catch (err) {
    alert('Gagal menghapus portfolio.')
  }
}
</script>
