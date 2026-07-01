<template>
  <div class="overflow-x-hidden text-gray-800 antialiased dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col justify-between">
    
    <!-- Navbar Header -->
    <header class="fixed top-0 left-0 w-full z-50 glass-effect border-b border-gray-200/40 dark:border-gray-800/40 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="/logo-transparent.png" alt="KCM Logo" class="w-10 h-10 rounded-lg object-contain shadow-sm" loading="lazy">
          <span class="font-bold text-lg text-red-950 dark:text-white">Kurnia Cipta Mandiri</span>
        </router-link>
        
        <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <a href="#hero" class="text-red-800 hover:text-red-900 transition-colors">Beranda</a>
          <a href="#about" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Tentang Kami</a>
          <a href="#services" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Layanan</a>
          <router-link to="/portfolio" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Portfolio</router-link>
          <a href="#contact" class="text-gray-600 hover:text-red-800 dark:text-gray-300 dark:hover:text-red-400">Hubungi Kami</a>
        </nav>

        <div class="flex items-center space-x-2 md:space-x-4">
          <button @click="appStore.toggleTheme" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" min-h-11>
            <span class="material-symbols-outlined align-middle">
              {{ appStore.darkMode ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
          <router-link to="/login" class="bg-red-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-red-950 transition-all min-h-11 flex items-center">
            Masuk Akun
          </router-link>
          <!-- Hamburger Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" min-h-11>
            <span class="material-symbols-outlined align-middle">
              {{ mobileMenuOpen ? 'close' : 'menu' }}
            </span>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu drawer -->
      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 top-20 z-40 bg-black/40 backdrop-blur-sm" @click="mobileMenuOpen = false"></div>
      <div 
        :class="[
          'md:hidden fixed top-20 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-50 shadow-xl flex flex-col gap-4 font-semibold transition-all duration-300',
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        ]"
      >
        <a href="#hero" @click="mobileMenuOpen = false" class="text-gray-600 dark:text-gray-300 hover:text-red-800 py-2 border-b border-gray-100 dark:border-gray-800 text-sm">Beranda</a>
        <a href="#about" @click="mobileMenuOpen = false" class="text-gray-600 dark:text-gray-300 hover:text-red-800 py-2 border-b border-gray-100 dark:border-gray-800 text-sm">Tentang Kami</a>
        <a href="#services" @click="mobileMenuOpen = false" class="text-gray-600 dark:text-gray-300 hover:text-red-800 py-2 border-b border-gray-100 dark:border-gray-800 text-sm">Layanan</a>
        <router-link to="/portfolio" @click="mobileMenuOpen = false" class="text-gray-600 dark:text-gray-300 hover:text-red-800 py-2 border-b border-gray-100 dark:border-gray-800 text-sm">Portfolio</router-link>
        <a href="#contact" @click="mobileMenuOpen = false" class="text-gray-600 dark:text-gray-300 hover:text-red-800 py-2 text-sm">Hubungi Kami</a>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="relative pt-20 pb-12 md:pt-48 md:pb-32 min-h-screen flex items-center bg-cover bg-center hero-bg">
      <div class="max-w-7xl mx-auto px-6 w-full text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <span class="inline-block px-3 py-1.5 rounded-full bg-amber-600/20 text-amber-500 border border-amber-600/30 text-xs font-bold uppercase tracking-wider">Interior & Renovasi</span>
          <h1 class="text-4xl md:text-6xl font-bold leading-tight">Ingin Interior Murah? <br/><span class="text-amber-500">KCM Solusinya</span></h1>
          <p class="text-base md:text-lg text-gray-200/90 leading-relaxed max-w-xl">
            Kurnia Cipta Mandiri (KCM) mewujudkan hunian impian Anda dengan desain premium, hasil pengerjaan rapi, bergaransi, namun tetap dengan budget yang terjangkau.
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <a href="#contact" class="bg-red-800 hover:bg-red-950 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2">
              Konsultasi Gratis <span class="material-symbols-outlined text-sm">chat</span>
            </a>
            <router-link to="/portfolio" class="border border-white hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold transition-all">
              Lihat Karya Kami
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="relative z-10 -mt-12 max-w-5xl mx-auto px-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <h3 class="text-3xl font-extrabold text-red-800 dark:text-red-500">20+ Tahun</h3>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-1">Pengalaman</p>
        </div>
        <div>
          <h3 class="text-3xl font-extrabold text-red-800 dark:text-red-500">500+</h3>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-1">Proyek Selesai</p>
        </div>
        <div>
          <h3 class="text-3xl font-extrabold text-red-800 dark:text-red-500">98%</h3>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-1">Kepuasan Client</p>
        </div>
        <div>
          <h3 class="text-3xl font-extrabold text-red-800 dark:text-red-500">3 Bulan</h3>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase mt-1">Garansi Pengerjaan</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-12 md:py-24">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="relative group">
          <div class="absolute -top-6 -left-6 w-32 h-32 bg-amber-500/10 rounded-full -z-10 animate-pulse"></div>
          <div class="relative overflow-hidden rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-800/50">
            <img 
              src="/assets/images/about-kcm.jpg" 
              alt="Tim KCM Interior Studio sedang bekerja di workshop produksi mebel" 
              loading="lazy"
              class="w-full h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </div>
        <div class="space-y-6">
          <span class="text-red-800 dark:text-red-500 font-bold text-xs uppercase tracking-widest block">Tentang KCM</span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">Membawa Kemewahan Desain Interior dengan Budget Efisien</h2>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            Kurnia Cipta Mandiri (KCM) didirikan untuk mewujudkan mimpi hunian berkualitas tinggi dengan harga produsen langsung. Kami mengintegrasikan seluruh tahapan mulai dari konsultasi desain, pembuatan RAB transparan, produksi workshop internal, hingga pengerjaan konstruksi akhir.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">engineering</span>
              <span class="text-xs font-semibold">Tukang Ahli</span>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">payments</span>
              <span class="text-xs font-semibold">RAB Terjangkau</span>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">verified</span>
              <span class="text-xs font-semibold">Kualitas Awet</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-12 md:py-24 bg-gray-50 dark:bg-gray-800/40 border-y border-gray-100 dark:border-gray-800/60">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-red-800 dark:text-red-500 font-bold text-xs uppercase tracking-widest block">Layanan Kami</span>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">Solusi Interior & Konstruksi Terpadu</h2>
          <div class="w-16 h-1 bg-red-800 mx-auto mt-4 rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all-custom card-shadow group" v-for="s in servicesList" :key="s.title">
            <div class="w-12 h-12 bg-red-50 dark:bg-red-950/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-800 group-hover:text-white transition-colors duration-300">
              <span class="material-symbols-outlined text-2xl text-red-800 dark:text-red-500 group-hover:text-white">{{ s.icon }}</span>
            </div>
            <h3 class="text-lg font-bold mb-3">{{ s.title }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio Section Preview -->
    <section class="py-12 md:py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div class="max-w-xl">
            <span class="text-red-800 dark:text-red-500 font-bold text-xs uppercase tracking-widest block">Portfolio Utama</span>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">Inspirasi Karya Terbaik KCM</h2>
          </div>
          <router-link to="/portfolio" class="text-red-800 hover:text-red-900 font-semibold text-sm flex items-center gap-1 group">
            Lihat Semua Portfolio <span class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">east</span>
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md cursor-pointer" v-for="p in portfolioProjects" :key="p.id" @click="$router.push('/portfolio')">
            <img :alt="p.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" :src="getImageUrl(p.images?.[0])"/>
            <span v-if="p.images?.length > 1" class="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full z-10">📷 {{ p.images.length }}</span>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="text-amber-500 text-[10px] font-bold uppercase tracking-wider">{{ formatCategory(p.category) }}</span>
              <h4 class="text-white font-bold text-base mt-1">{{ p.title }}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Keunggulan Section -->
    <section class="py-12 md:py-24 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800/60">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Mengapa Memilih KCM?</h2>
          <div class="w-16 h-1 bg-red-800 mx-auto mt-4 rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60">
            <span class="material-symbols-outlined text-4xl text-red-800 mb-4">verified_user</span>
            <h4 class="font-bold text-base mb-2">Garansi 3 Bulan</h4>
            <p class="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">Jaminan garansi perbaikan pengerjaan selama 3 bulan setelah proyek selesai.</p>
          </div>
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60">
            <span class="material-symbols-outlined text-4xl text-red-800 mb-4">groups</span>
            <h4 class="font-bold text-base mb-2">Tim Internal Ahli</h4>
            <p class="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">Seluruh pengerjaan dikerjakan oleh tukang KCM terpercaya tanpa sistem sub-kontraktor lepas.</p>
          </div>
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60">
            <span class="material-symbols-outlined text-4xl text-red-800 mb-4">fact_check</span>
            <h4 class="font-bold text-base mb-2">Berpengalaman</h4>
            <p class="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">Kami berpengalaman menangani proyek skala ruko, kos-kosan, villa, resort, dan residensial.</p>
          </div>
          <div class="bg-white dark:bg-gray-855 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60">
            <span class="material-symbols-outlined text-4xl text-red-800 mb-4">travel_explore</span>
            <h4 class="font-bold text-base mb-2">Jangkauan Nasional</h4>
            <p class="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">Siap melayani pengerjaan proyek interior dan furniture custom ke seluruh wilayah Indonesia.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Maps Section -->
    <section id="contact" class="py-12 md:py-24 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800/60">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div class="space-y-8">
          <div>
            <span class="text-red-800 dark:text-red-500 font-bold text-xs uppercase tracking-widest block">Hubungi Kami</span>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">Hubungi KCM Sekarang</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Konsultasikan kebutuhan interior, mebel custom, dan bangun renovasi Anda secara gratis.</p>
          </div>

          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <span class="material-symbols-outlined text-red-800 mt-1">pin_drop</span>
              <div>
                <h5 class="font-bold text-sm">Alamat Kantor KCM</h5>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Jl. Kaliurang Jl. Candi Winangun km 12 No.24, Turen, Sardonoharjo, Kec. Ngaglik, Sleman, D.I. Yogyakarta 55581
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <span class="material-symbols-outlined text-red-800 mt-1">call</span>
              <div>
                <h5 class="font-bold text-sm">Telepon / WhatsApp</h5>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">085868000012</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <span class="material-symbols-outlined text-red-800 mt-1">schedule</span>
              <div>
                <h5 class="font-bold text-sm">Jam Kerja</h5>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Senin - Sabtu, 08:00 - 17:00 (Minggu Libur)</p>
              </div>
            </div>
          </div>

          <div class="w-full h-64 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
            <iframe class="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.123456789!2d110.405383!3d-7.6982573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5f4a84f4b169%3A0xf95f12767979571!2sKCM%20interior%20design!5e0!3m2!1sid!2sid!4v1719640000000!5m2!1sid!2sid" allowfullscreen="" loading="lazy"></iframe>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 dark:border-gray-700 shadow-md">
          <h4 class="text-lg font-bold mb-6 text-gray-900 dark:text-white">Kirim Pesan Langsung</h4>
          <form @submit.prevent="sendWhatsappMessage" class="space-y-4">
            <div>
              <label class="text-xxs font-bold text-gray-400 block mb-1">Nama Lengkap</label>
              <input type="text" name="nama" v-model="contactName" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-red-800 focus:ring focus:ring-red-200 text-xs" placeholder="Nama Anda..."/>
            </div>
            <div>
              <label class="text-xxs font-bold text-gray-400 block mb-1">Nomor WhatsApp</label>
              <input type="tel" name="telepon" v-model="contactPhone" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-red-800 focus:ring focus:ring-red-200 text-xs" placeholder="0812xxxx..."/>
            </div>
            <div>
              <label class="text-xxs font-bold text-gray-400 block mb-1">Pesan / Rencana Proyek</label>
              <textarea name="pesan" rows="4" v-model="contactMessage" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-red-800 focus:ring focus:ring-red-200 text-xs" placeholder="Tulis rencana kebutuhan renovasi/interior Anda di sini..."></textarea>
            </div>
            <button type="submit" class="w-full bg-red-800 hover:bg-red-950 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs">
              Hubungi via WhatsApp <span class="material-symbols-outlined text-sm">chat</span>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-red-950 text-white py-16 border-t border-red-900">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-full bg-white text-red-800 flex items-center justify-center font-bold text-sm">K</span>
            <span class="font-bold text-base">Kurnia Cipta Mandiri</span>
          </div>
          <p class="text-xs text-gray-300 leading-relaxed">
            "Ingin interior murah? KCM solusinya." Kami siap membantu mewujudkan hunian idaman berkualitas tinggi secara hemat dan cepat.
          </p>
        </div>
        <div>
          <h5 class="font-bold text-xs mb-4 text-amber-500 uppercase tracking-widest">Layanan</h5>
          <ul class="space-y-2.5 text-xs text-gray-300">
            <li><a href="#services" class="hover:underline">Interior Design</a></li>
            <li><a href="#services" class="hover:underline">Mebel Custom</a></li>
            <li><a href="#services" class="hover:underline">Bangun Rumah Baru</a></li>
            <li><a href="#services" class="hover:underline">Renovasi Bangunan</a></li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold text-xs mb-4 text-amber-500 uppercase tracking-widest">Navigasi</h5>
          <ul class="space-y-2.5 text-xs text-gray-300">
            <li><a href="#about" class="hover:underline">Tentang Kami</a></li>
            <li><router-link to="/portfolio" class="hover:underline">Katalog Portfolio</router-link></li>
            <li><a href="#contact" class="hover:underline">Kontak & Lokasi</a></li>
            <li><router-link to="/login" class="hover:underline">Login Karyawan</router-link></li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold text-xs mb-4 text-amber-500 uppercase tracking-widest">Media Sosial</h5>
          <div class="flex space-x-4">
            <a href="https://www.instagram.com/pengrajin_interiorkcm" target="_blank" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <span class="material-symbols-outlined text-sm">photo_camera</span>
            </a>
            <a href="https://www.facebook.com/anriko.kurniawan" target="_blank" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <span class="material-symbols-outlined text-sm">public</span>
            </a>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 border-t border-red-900/60 mt-12 pt-6 text-center text-xs text-gray-400">
        © 2026 Kurnia Cipta Mandiri. All rights reserved. Sleman, D.I. Yogyakarta.
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useApi } from '../composables/useApi'
import { getImageUrl } from '../utils/helpers'

const appStore = useAppStore()
const api = useApi()

const contactName = ref('')
const contactPhone = ref('')
const contactMessage = ref('')
const portfolioProjects = ref([])
const mobileMenuOpen = ref(false)

function formatCategory(cat) {
  if (!cat) return ''
  return cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

onMounted(async () => {
  try {
    const data = await api.get('/api/portfolio?status=published')
    portfolioProjects.value = (data || []).slice(0, 6)
  } catch (e) {}
})

const servicesList = [
  { icon: 'chair', title: 'Interior Design', desc: 'Desain interior hunian & kantor mewah dengan pemanfaatan ruang yang sangat efisien.' },
  { icon: 'architecture', title: 'Arsitektur', desc: 'Perencanaan gambar IMB, visualisasi eksterior 3D, dan detail struktural bangunan.' },
  { icon: 'countertops', title: 'Custom Furniture', desc: 'Kitchen set, wardrobe, kabinet, diproduksi langsung dari workshop KCM sendiri.' },
  { icon: 'construction', title: 'Renovasi Rumah', desc: 'Perbaikan atap, facelift fasad luar, pengecatan, hingga penambahan lantai.' },
  { icon: 'foundation', title: 'Konstruksi Bangun Baru', desc: 'Pembangunan rumah tinggal, villa, ruko dari nol dengan pengawasan teratur.' },
  { icon: 'forum', title: 'Konsultasi & RAB', desc: 'Survey lokasi gratis serta estimasi anggaran RAB transparan sejak awal.' }
]

function sendWhatsappMessage() {
  const waUrl = `https://wa.me/6285868000012?text=Halo%20KCM%2C%20saya%20${encodeURIComponent(contactName.value)}%20(${encodeURIComponent(contactPhone.value)})%20ingin%20berkonsultasi%20mengenai%20proyek%3A%20${encodeURIComponent(contactMessage.value)}`
  window.open(waUrl, '_blank')
}
</script>

<style scoped>
.hero-bg {
  background-image: linear-gradient(to right, rgba(26, 0, 0, 0.9) 0%, rgba(153, 27, 27, 0.4) 60%, rgba(26, 0, 0, 0.8) 100%), url('/assets/images/hero-interior.jpg');
}
</style>
