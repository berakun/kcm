<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col min-h-screen">
      <!-- Topbar Navigation -->
      <AppTopbar title="Kelola Karyawan" />

      <!-- Users Content Body -->
      <div class="p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        
        <!-- Search & Filters -->
        <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative w-full sm:w-80">
            <input 
              v-model="searchQuery" 
              class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-red-500" 
              placeholder="Cari nama atau username..." 
              type="text"
            />
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
          </div>
          
          <div class="flex items-center space-x-4 w-full sm:w-auto justify-end">
            <select v-model="roleFilter" class="rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs px-4 py-2 focus:border-red-500 focus:ring-0">
              <option value="all">Semua Role</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff / Karyawan</option>
            </select>
            <button @click="openAddModal" class="bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap">
              <span class="material-symbols-outlined text-sm">person_add</span>
              Tambah Karyawan
            </button>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 text-xxs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                  <th class="py-4 px-6">Nama</th>
                  <th class="py-4 px-6">Username</th>
                  <th class="py-4 px-6">Departemen</th>
                  <th class="py-4 px-6">Role</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6">Terakhir Aktif</th>
                  <th class="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="7" class="py-12 text-center text-gray-400">Data karyawan tidak ditemukan.</td>
                </tr>
                <tr v-else v-for="u in filteredUsers" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-red-900/10 text-red-800 font-bold flex items-center justify-center text-sm uppercase">
                      {{ u.name.charAt(0) }}
                    </div>
                    <span>{{ u.name }}</span>
                  </td>
                  <td class="py-4 px-6 text-gray-500 dark:text-gray-400">{{ u.username }}</td>
                  <td class="py-4 px-6 font-medium">{{ u.department || '-' }}</td>
                  <td class="py-4 px-6">
                    <span :class="[roleColors[u.role], 'px-2.5 py-1 text-[10px] font-bold rounded-lg']">
                      {{ roleLabels[u.role] }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <span :class="[u.status === 'active' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-red-750 bg-red-50 dark:bg-red-950/20', 'px-2.5 py-1 text-[10px] font-bold rounded-lg']">
                      {{ u.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-gray-400">{{ u.last_active ? formatDate(u.last_active, true) : 'Belum login' }}</td>
                  <td class="py-4 px-6 text-center space-x-2">
                    <button @click="editUser(u)" class="text-amber-600 hover:text-amber-800">
                      <span class="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button v-if="u.id !== user?.id" @click="deleteUser(u.id)" class="text-red-600 hover:text-red-800">
                      <span class="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- User Modal (Form Add/Edit) -->
    <BaseModal :show="showModal" :title="modalTitle" @close="closeModal">
      <form @submit.prevent="submitForm" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Nama Lengkap</label>
            <input v-model="form.name" type="text" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Username</label>
            <input v-model="form.username" type="text" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Password</label>
            <input v-model="form.password" type="password" :required="!form.id" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Min. 6 karakter"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">No. Telepon / WA</label>
            <input v-model="form.phone" type="tel" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Role</label>
            <select v-model="form.role" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0">
              <option value="staff">Staff / Karyawan</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Departemen</label>
            <input v-model="form.department" type="text" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Contoh: Produksi"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Status Keaktifan</label>
            <select v-model="form.status" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0">
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Simpan Karyawan
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
import { formatDate } from '../../utils/helpers'

const { user } = useAuth()
const api = useApi()

const usersList = ref([])
const searchQuery = ref('')
const roleFilter = ref('all')

const showModal = ref(false)
const modalTitle = ref('Tambah Karyawan Baru')

const form = ref({
  id: '',
  name: '',
  username: '',
  password: '',
  phone: '',
  role: 'staff',
  department: '',
  status: 'active'
})

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin Proyek',
  staff: 'Karyawan / Staff'
}

const roleColors = {
  super_admin: 'text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400',
  admin: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
  staff: 'text-gray-700 bg-gray-50 dark:bg-gray-900/40 dark:text-gray-400'
}

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  try {
    const data = await api.get('/api/users')
    usersList.value = data
  } catch (err) {
    console.error(err)
  }
}

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return usersList.value.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    const matchesRole = roleFilter.value === 'all' || u.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

function openAddModal() {
  modalTitle.value = 'Tambah Karyawan Baru'
  form.value = {
    id: '',
    name: '',
    username: '',
    password: '',
    phone: '',
    role: 'staff',
    department: '',
    status: 'active'
  }
  showModal.value = true
}

function editUser(u) {
  modalTitle.value = 'Edit Data Karyawan'
  form.value = {
    id: u.id,
    name: u.name,
    username: u.username,
    password: '',
    phone: u.phone || '',
    role: u.role,
    department: u.department || '',
    status: u.status
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  try {
    if (form.value.id) {
      // Edit
      await api.put('/api/users', form.value)
    } else {
      // Add
      await api.post('/api/users', form.value)
    }
    closeModal()
    await fetchUsers()
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal menyimpan data karyawan.')
  }
}

async function deleteUser(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) return
  try {
    await api.delete('/api/users', { id })
    await fetchUsers()
  } catch (err) {
    alert('Gagal menghapus user.')
  }
}
</script>
