<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col min-h-screen">
      <!-- Topbar Navigation -->
      <AppTopbar title="Pengaturan Sistem" />

      <!-- Content Body -->
      <div class="p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] max-w-xl">
        <div class="bg-white dark:bg-gray-850 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-6">
          <div>
            <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-red-800 dark:text-red-500">location_on</span>
              <span>Setelan Geofencing Kehadiran (GPS)</span>
            </h3>
            <p class="text-[10px] text-gray-400 mt-1 leading-relaxed">
              Atur koordinat GPS kantor Kurnia Cipta Mandiri dan radius toleransi jarak (dalam meter) agar sistem secara otomatis memvalidasi apakah karyawan benar-benar berada di lokasi kerja saat melakukan absensi.
            </p>
          </div>

          <form @submit.prevent="submitSettings" class="space-y-4 pt-2">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">Latitude Kantor</label>
                <input 
                  v-model="settings.office_latitude" 
                  type="text" 
                  required 
                  class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"
                  placeholder="-7.7326"
                />
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">Longitude Kantor</label>
                <input 
                  v-model="settings.office_longitude" 
                  type="text" 
                  required 
                  class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"
                  placeholder="110.3988"
                />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-bold text-gray-400 block mb-1">Radius Toleransi Kantor (Meter)</label>
              <input 
                v-model.number="settings.office_radius" 
                type="number" 
                required 
                class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" 
                placeholder="20"
              />
            </div>

            <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
              <button 
                type="submit" 
                :disabled="saving"
                class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan Setelan GPS' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'

const api = useApi()
const appStore = useAppStore()

const settings = ref({
  office_latitude: '-7.7326',
  office_longitude: '110.3988',
  office_radius: 20
})
const saving = ref(false)

onMounted(async () => {
  await fetchSettings()
})

async function fetchSettings() {
  try {
    const data = await api.get('/api/attendance/settings')
    settings.value = {
      office_latitude: data.office_latitude,
      office_longitude: data.office_longitude,
      office_radius: parseInt(data.office_radius)
    }
  } catch (err) {
    appStore.showAlert('Gagal mengambil setelan GPS dari server.', 'error')
  }
}

async function submitSettings() {
  saving.value = true
  try {
    await api.post('/api/attendance/settings', settings.value)
    appStore.showAlert('Setelan geofence kantor berhasil diperbarui.', 'success')
  } catch (err) {
    appStore.showAlert('Gagal menyimpan setelan GPS.', 'error')
  } finally {
    saving.value = false
  }
}
</script>
