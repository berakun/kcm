<template>
  <div class="overflow-x-hidden text-gray-800 antialiased dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col justify-between">
    
    <!-- Navbar Header -->
    <header class="fixed top-0 left-0 w-full z-50 glass-effect border-b border-gray-200/40 dark:border-gray-800/40">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="/logo-transparent.png" alt="KCM Logo" class="w-10 h-10 rounded-lg object-contain shadow-sm">
          <span class="font-bold text-lg text-red-950 dark:text-white">Kurnia Cipta Mandiri</span>
        </router-link>
        
        <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <router-link to="/" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Beranda</router-link>
          <router-link to="/#about" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Tentang Kami</router-link>
          <router-link to="/#services" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Layanan</router-link>
          <router-link to="/portfolio" class="text-red-800 hover:text-red-900">Portfolio</router-link>
          <router-link to="/#contact" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Hubungi Kami</router-link>
        </nav>

        <div class="flex items-center space-x-4">
          <button @click="appStore.toggleTheme" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
            <span class="material-symbols-outlined align-middle">
              {{ appStore.darkMode ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
          <router-link to="/login" class="bg-red-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-red-950 transition-all">
            Masuk Akun
          </router-link>
        </div>
      </div>
    </header>

    <main class="flex-grow pt-32 pb-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-red-800 dark:text-red-500 font-bold text-xs uppercase tracking-widest block">Katalog Proyek</span>
          <h1 class="text-3xl md:text-5xl font-bold mt-2">Karya & Portfolio KCM</h1>
          <div class="w-16 h-1 bg-red-800 mx-auto mt-4 rounded-full"></div>
        </div>

        <!-- Filter pills -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            v-for="cat in categories" 
            :key="cat.value" 
            @click="activeCategory = cat.value"
            :class="[
              activeCategory === cat.value
                ? 'bg-red-800 text-white shadow-sm'
                : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-150 dark:border-gray-700 hover:bg-gray-50',
              'px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="p in filteredProjects" 
            :key="p.id" 
            @click="openProjectModal(p)"
            class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-150 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer"
          >
            <div class="aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
              <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" :src="getImageUrl(p.images?.[0])" :alt="p.title"/>
              <span v-if="p.images?.length > 1" class="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">📷 {{ p.images.length }}</span>
              <div class="absolute inset-0 bg-red-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="bg-white text-red-955 font-bold px-6 py-2.5 rounded-full text-xs shadow-md">Lihat Proyek</span>
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2.5">
                <span class="text-[10px] uppercase tracking-widest font-extrabold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md capitalize">{{ p.category }}</span>
                <span class="flex items-center text-gray-400 text-[10px]">
                  <span class="material-symbols-outlined text-xs mr-1">location_on</span>{{ p.location }}
                </span>
              </div>
              <h3 class="font-bold text-base text-gray-900 dark:text-white group-hover:text-red-800 transition-colors">{{ p.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox Modal -->
    <div v-if="showModal && selectedProject" class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click.self="closeProjectModal">
      <div class="bg-white dark:bg-gray-850 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[85vh]">
        <button class="absolute top-4 right-4 z-[110] bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all" @click="closeProjectModal">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
        <!-- Photo -->
        <div class="md:w-3/5 h-64 md:h-full bg-gray-100 dark:bg-gray-800 relative flex flex-col">
          <div class="flex-1 relative min-h-0">
            <img class="w-full h-full object-cover" :src="getImageUrl(selectedProject.images?.[currentImageIndex])" alt="Project Detail"/>
            <button v-if="selectedProject.images?.length > 1" @click="prevImage" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors">
              <span class="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button v-if="selectedProject.images?.length > 1" @click="nextImage" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors">
              <span class="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
          <div v-if="selectedProject.images?.length > 1" class="flex gap-2 justify-center py-3 bg-gray-100 dark:bg-gray-800">
            <button v-for="(_, i) in selectedProject.images" :key="i" @click="currentImageIndex = i"
              :class="[i === currentImageIndex ? 'bg-red-800' : 'bg-gray-300 dark:bg-gray-600', 'w-2 h-2 rounded-full transition']"
            />
          </div>
        </div>
        <!-- Specs -->
        <div class="md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto">
          <div class="space-y-6">
            <div>
              <span class="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 bg-amber-500/10 px-2.5 py-1.5 rounded-lg capitalize">{{ selectedProject.category }}</span>
              <h3 class="text-xl font-bold mt-3 text-gray-900 dark:text-white leading-tight">{{ selectedProject.title }}</h3>
            </div>
            
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ selectedProject.description || 'Tidak ada deskripsi.' }}
            </p>

            <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3.5">
              <div class="flex items-center text-xs">
                <span class="material-symbols-outlined text-gray-400 mr-3">person</span>
                <span class="text-gray-450 mr-2">Client:</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ selectedProject.client_name || '-' }}</span>
              </div>
              <div class="flex items-center text-xs">
                <span class="material-symbols-outlined text-gray-400 mr-3">location_on</span>
                <span class="text-gray-450 mr-2">Lokasi:</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ selectedProject.location || '-' }}</span>
              </div>
              <div class="flex items-center text-xs">
                <span class="material-symbols-outlined text-gray-400 mr-3">calendar_month</span>
                <span class="text-gray-450 mr-2">Tahun:</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ selectedProject.year || '-' }}</span>
              </div>
            </div>
          </div>

          <a :href="waUrl" target="_blank" class="w-full bg-red-800 hover:bg-red-950 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-6 text-xs">
            Tanya Proyek via WA <span class="material-symbols-outlined text-base">chat</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-red-950 text-white py-12 border-t border-red-900">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center space-x-2">
          <span class="w-8 h-8 rounded-full bg-white text-red-800 flex items-center justify-center font-bold text-sm">K</span>
          <span class="font-bold text-base">Kurnia Cipta Mandiri</span>
        </div>
        <div class="text-[10px] text-gray-405">
          © 2026 Kurnia Cipta Mandiri. All rights reserved.
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../stores/app'
import { useApi } from '../composables/useApi'
import { getImageUrl } from '../utils/helpers'

const appStore = useAppStore()
const api = useApi()

const activeCategory = ref('Semua')
const portfolios = ref([])
const showModal = ref(false)
const selectedProject = ref(null)
const currentImageIndex = ref(0)

const categories = [
  { label: 'Semua', value: 'Semua' },
  { label: 'Residential', value: 'residential' },
  { label: 'Office', value: 'office' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Kost', value: 'kost' },
  { label: 'Rumah Sakit', value: 'rumah_sakit' }
]

const mockProjects = [
  { id: 101, title: 'Emerald Residence Living', category: 'residential', client_name: 'Ibu Anita', location: 'Sleman, Yogyakarta', year: '2024', description: 'Desain interior ruang tamu mewah bertema minimalis modern dengan aksen warna maroon hangat.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBT4VqcBNFcxdoSxuqnnYvQ95rnHPbgjiOA1yR_Ay-89ZGjBFOMXlPZfmrrwPpbqYtVSX_ahLsLomQ6-HCGl6YDJyMW5KBp20_mJ3--tdV7TGB0LkiR5UiHvbA0LkRaTkrsXhWpENBFUeyonIS_6_LRtHfwpTuPpfnbOYLoyvbGno5ePLOqCRpsVpwU9BMPA6ShD1oAvqYG6i7-FaA9GSnpdj-QMsYQvtTWAIonmtGtKCQQWnzJSqNkjA'] },
  { id: 102, title: 'Corporate Executive Office', category: 'office', client_name: 'PT Sinergi Mandiri', location: 'BSD City, Tangerang', year: '2025', description: 'Ruang kerja direksi eksekutif dengan panel kayu jati premium, meja kaca modern, dan pencahayaan ambient.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB8ZVi3NOI07bupgKIGTkv1nhDyyQYoUBF4udfJT17-riYCemxJCkqTgpouK_-X2EZ7SV9KGALJzQs7UAmwCO96RfHLqRuTFaZeBtwnLU5BTl8DtQSGr0BWSIgUIJxX9BcNepHoT0HMpq6yhhEy6RQGD6VPdRemlKe9sCzqVKGZEBDY32xKXr_XCVVxUIao9LRGbmEur2Bbl2IPAU1Il9s-EQoTg1BCB_7YBkhQsfgDe5FeaA1mbtls6A'] },
  { id: 103, title: 'Contemporary Luxury Kitchen', category: 'residential', client_name: 'Bapak Rian', location: 'Bandung, Jawa Barat', year: '2024', description: 'Kitchen set berkonsep dapur bersih matte black dengan backsplash marmer putih Carrara.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBIcUDAZC7ZPnxMYzZihUHMdp0IIqGGPBMvCKFgaF4Uh6TUZpvHTNSlCiUh4ZjAv0oswUmNQrtLCJNiIzeFQSfVLi-0tH-B2jkYmnu7R1mwx9ESi_ECVC962deTTxr32NaDK_yu8X29nmWoYsVckDUkrsnA4e8zi9ncL4mAJgzvkNgp1u2SrL9vIroORhaapHqh01J6W-oA-31O0Ed3r9pIGH74vPOM82QNu88ihzjjOeFr1zDRKfTinw'] },
  { id: 104, title: 'Grand Hotel Lobby Suite', category: 'hotel', client_name: 'Hotel Grand Palazzo', location: 'Surabaya, Jawa Timur', year: '2025', description: 'Lobby hotel megah dengan pilar marmer klasik, sofa beludru custom mewah, dan chandelier kristal gantung.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDPbDlo7ojQNXYoAQnAjkqfzBfH3_qrZ869aVwx5DxA29xZYlzK2zwjwz-Oc9GBm1Ds4BJPewdBXc4VtwpwoQ1vHpQVTnqxeGWNRzAzxNiq_thbEWKzu9azEfuelFKNA-HSB8UuKePkaCORjP6W0NeZV7d1uVZMZvOjsAP-9VWjfQgSYnClc6NF350Jjo_zTzQmtyF3xGN6zmGUMkds3j2B0KMaiXH4JAWdkojD6S-C4hN1rI2Xrxc_Kw'] },
  { id: 105, title: 'Kost Eksklusif Candi Winangun', category: 'kost', client_name: 'Bapak Anriko', location: 'Sleman, Yogyakarta', year: '2024', description: 'Pengerjaan interior 12 kamar kost eksklusif dengan built-in bed, meja belajar minimalis, dan kamar mandi dalam.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuApsoAEGLntu70B3_XSH08itu-mNWuceYXNAMkeuNzHpwBTTXNQBzMxk_ukHaD5bpn40Dg-nsFQVr3Z0JDz6fSyIRFRYP0PTc54e5OQ9z2BsA2TOF9YBrMDqzYJKIMv6PbWHK9HSCnt9QvzkvRO6w3y_MyaR_z4voXkuXI_Q4Mk69WPp_0FU4LaJekZR1AeZeJSXfdfa9hp8Y1gClmOTjr-Bo9TL8yLCw2jasf6pKLAv_KxYuK_doOJyA'] },
  { id: 106, title: 'Rumah Sakit Bethesda Suite', category: 'rumah_sakit', client_name: 'Bethesda Care', location: 'Yogyakarta', year: '2023', description: 'Pengerjaan ruang rawat inap VIP berstandar higienis tinggi dengan kabinet penyimpanan antiseptik.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBGk1cDYziuw7Ug0-wmVPs92MIXy6a94zxwV6G3gWjs7EBm3uSXisxxejHWQflLFdOxDYPLsdpWqGL2WH5Te3Pzu26k_kFApgFpzmTqQd3UhDgdAM7KapTkn7XH7Tu27VJmuaSczlO03Lq7Fvzj7YBJtze4TrZSU-7s4xlEJJuW9sh55rUAmiNiln05zCoM9F1JD55oCuu4mvzdQRm3MbIOUX7h2ih5IX7cNsRRCjCMOa6dPLkbGYWHMQ'] }
]

onMounted(async () => {
  try {
    const data = await api.get('/api/portfolio')
    if (data && data.length > 0) {
      portfolios.value = data
    } else {
      portfolios.value = mockProjects
    }
  } catch (err) {
    portfolios.value = mockProjects
  }
})

const filteredProjects = computed(() => {
  if (activeCategory.value === 'Semua') return portfolios.value
  return portfolios.value.filter(p => p.category === activeCategory.value)
})

const waUrl = computed(() => {
  if (!selectedProject.value) return ''
  const msg = `Halo KCM, saya ingin berkonsultasi mengenai proyek: ${selectedProject.value.title}`
  return `https://wa.me/6285868000012?text=${encodeURIComponent(msg)}`
})

function openProjectModal(project) {
  selectedProject.value = project
  currentImageIndex.value = 0
  showModal.value = true
}

function closeProjectModal() {
  showModal.value = false
  selectedProject.value = null
}

function prevImage() {
  if (!selectedProject.value) return
  const len = selectedProject.value.images?.length || 0
  currentImageIndex.value = (currentImageIndex.value - 1 + len) % len
}
function nextImage() {
  if (!selectedProject.value) return
  const len = selectedProject.value.images?.length || 0
  currentImageIndex.value = (currentImageIndex.value + 1) % len
}
</script>
