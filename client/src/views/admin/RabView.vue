<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <!-- Topbar Navigation -->
      <AppTopbar title="RAB & Anggaran Proyek" />

      <!-- Content Body -->
      <div class="p-8 flex-grow space-y-6 overflow-y-auto">
        <!-- Navigation Tabs -->
        <div class="flex space-x-2 border-b border-gray-200 dark:border-gray-800 pb-2 overflow-x-auto scrollbar-hide">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id 
                ? 'border-red-800 text-red-800 dark:text-red-500 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
              'px-6 py-3 border-b-2 text-xs font-semibold transition-all duration-200 focus:outline-none'
            ]"
          >
            <div class="flex items-center space-x-2">
              <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
              <span>{{ tab.name }}</span>
            </div>
          </button>
        </div>

        <!-- ========================================== -->
        <!-- TAB 1: RAB LIST & BUILDER -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'rab'" class="space-y-6">
          <!-- SUB-VIEW: LIST -->
          <div class="space-y-6">
            <!-- Search & Actions -->
            <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div class="flex items-center gap-3 flex-wrap">
                <div class="relative w-full sm:w-80">
                  <input 
                    v-model="searchQuery" 
                    class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-red-500" 
                    placeholder="Cari nama proyek..." 
                    type="text"
                  />
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                </div>
                <div class="flex items-center gap-3">
                  <DateRangePicker 
                    v-model:startDate="filterDateStart" 
                    v-model:endDate="filterDateEnd" 
                    align="left"
                  />
                </div>
              </div>
              
              <button @click="startNewRab" class="bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap no-print">
                <span class="material-symbols-outlined text-sm">add</span>
                Buat RAB Baru
              </button>
              </div>
            <!-- Stats Counters -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl font-bold">assignment</span>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Proyek</p>
                  <p class="text-xl font-bold text-gray-800 dark:text-white">{{ rabsList.length }} Proyek</p>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl font-bold">engineering</span>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Dikerjakan</p>
                  <p class="text-xl font-bold text-gray-800 dark:text-white">{{ rabsList.filter(r => r.status === 'dikerjakan').length }} Proyek</p>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl font-bold">task_alt</span>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Selesai</p>
                  <p class="text-xl font-bold text-gray-800 dark:text-white">{{ rabsList.filter(r => r.status === 'selesai').length }} Proyek</p>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
              <div class="overflow-x-auto min-h-[220px]">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                      <th class="py-4 px-6">Kode RAB</th>
                      <th class="py-4 px-6">Nama Proyek</th>
                      <th class="py-4 px-6 hidden sm:table-cell">Klien</th>
                      <th class="py-4 px-6 hidden md:table-cell">Tanggal</th>
                      <th class="py-4 px-6">Total Anggaran</th>
                      <th class="py-4 px-6 text-center">Status</th>
                      <th class="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                    <tr v-if="filteredRabs.length === 0">
                      <td colspan="7" class="py-12 text-center text-gray-400">Rancangan RAB tidak ditemukan.</td>
                    </tr>
                    <tr v-else v-for="(r, idx) in filteredRabs" :key="r.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td class="py-4 px-6 font-bold text-red-800 dark:text-red-500">{{ r.code }}</td>
                      <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white">{{ r.project_name }}</td>
                      <td class="py-4 px-6 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{{ r.client || '-' }}</td>
                      <td class="py-4 px-6 text-gray-400 hidden md:table-cell">{{ formatDate(r.date) }}</td>
                      <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(r.total_budget) }}</td>
                      <td class="py-4 px-6 text-center">
                        <span :class="[
                          r.status === 'selesai' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 
                          r.status === 'dikerjakan' ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/20' : 
                          'text-gray-600 bg-gray-50 dark:bg-gray-800/40', 
                          'px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase'
                        ]">
                          {{ r.status }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-center">
                        <button 
                          @click.prevent.stop="toggleDropdown($event, r)" 
                          class="p-2 rounded-xl text-gray-500 hover:bg-gray-150 dark:hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto"
                          title="Aksi"
                        >
                          <span class="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: REMBES (LEAKAGE) -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'rembes'" class="space-y-6">
          <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pemantauan Pengeluaran / Rembesan Lapangan</span>
            <button @click="openRembesModal" class="bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap">
              <span class="material-symbols-outlined text-sm font-semibold">payments</span>
              Catat Rembesan Baru
            </button>
          </div>

          <!-- Rembes Table -->
          <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                    <th class="py-4 px-6">Nama Proyek</th>
                    <th class="py-4 px-6">Tanggal</th>
                    <th class="py-4 px-6">Deskripsi Belanja</th>
                    <th class="py-4 px-6">Nominal Rembes</th>
                    <th class="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <tr v-if="rembesList.length === 0">
                    <td colspan="5" class="py-12 text-center text-gray-400">Data pengeluaran rembes belum ada.</td>
                  </tr>
                  <tr v-else v-for="rem in rembesList" :key="rem.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td class="py-4 px-6 font-bold text-gray-800 dark:text-gray-200">{{ rem.project_name }}</td>
                    <td class="py-4 px-6 text-gray-400">{{ formatDate(rem.date) }}</td>
                    <td class="py-4 px-6 font-semibold">{{ rem.description }}</td>
                    <td class="py-4 px-6 font-mono text-gray-500">{{ formatCurrency(rem.actual_amount) }}</td>
                    <td class="py-4 px-6 text-center">
                      <button @click="deleteRembes(rem.id)" class="text-red-650 hover:text-red-800">
                        <span class="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 3:Persentujuan Cashbon -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'cashbon'" class="space-y-6">
          <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Persetujuan Cashbon</span>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
              <input type="date" v-model="cashbonFilterDateStart" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white" placeholder="Dari tanggal"/>
              <span class="text-gray-400 text-xs">→</span>
              <input type="date" v-model="cashbonFilterDateEnd" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs dark:bg-gray-900 dark:text-white" placeholder="Sampai tanggal"/>
              <button v-if="cashbonFilterDateStart || cashbonFilterDateEnd" @click="cashbonFilterDateStart=''; cashbonFilterDateEnd=''" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-200">
                <span class="material-symbols-outlined text-xs align-middle">restart_alt</span> Reset
              </button>
            </div>
          </div>

          <!-- Cashbon Summary Per User -->
          <div v-if="cashbonUserSummary.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="item in cashbonUserSummary" :key="item.name" class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800">
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{{ item.name }}</p>
              <p class="text-sm font-black text-red-800 dark:text-red-500 font-mono">{{ formatCurrency(item.total) }}</p>
              <p class="text-[10px] text-gray-400 mt-1">{{ item.count }} pengajuan</p>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                    <th class="py-4 px-6">Tanggal</th>
                    <th class="py-4 px-6">Diajukan Oleh</th>
                    <th class="py-4 px-6">Penerima</th>
                    <th class="py-4 px-6">Keperluan</th>
                    <th class="py-4 px-6">Nominal</th>
                    <th class="py-4 px-6">Lampiran Bukti</th>
                    <th class="py-4 px-6">Keterangan Admin</th>
                    <th class="py-4 px-6 text-center">Status</th>
                    <th class="py-4 px-6 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <tr v-if="filteredCashbon.length === 0">
                    <td colspan="9" class="py-12 text-center text-gray-400">Belum ada pengajuan cashbon.</td>
                  </tr>
                  <tr v-else v-for="c in filteredCashbon" :key="c.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td class="py-4 px-6 text-gray-400">{{ formatDate(c.date) }}</td>
                    <td class="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">{{ c.employee_name }}</td>
                    <td class="py-4 px-6">{{ c.recipient }}</td>
                    <td class="py-4 px-6 text-gray-500 dark:text-gray-400">{{ c.description || '-' }}</td>
                    <td class="py-4 px-6 font-bold text-gray-900 dark:text-white font-mono">{{ formatCurrency(c.amount) }}</td>
                    <td class="py-4 px-6">
                      <a v-if="c.proof_file" :href="'/' + c.proof_file" target="_blank" class="text-blue-600 hover:underline flex items-center space-x-1">
                        <span class="material-symbols-outlined text-sm">receipt_long</span>
                        <span>Lihat Bukti</span>
                      </a>
                      <span v-else class="text-gray-400">Tidak ada</span>
                    </td>
                    <td class="py-4 px-6 text-gray-400 italic">{{ c.notes || '-' }}</td>
                    <td class="py-4 px-6 text-center">
                      <span :class="[
                        c.status === 'approved' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' :
                        c.status === 'rejected' ? 'text-red-750 bg-red-50 dark:bg-red-950/20' :
                        'text-amber-700 bg-amber-50 dark:bg-amber-950/20',
                        'px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase'
                      ]">
                        {{ c.status }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-center space-x-2">
                      <div v-if="c.status === 'pending'" class="flex justify-center space-x-2">
                        <button @click="openActionModal('cashbon', c.id, 'approved')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm">
                          Setuju
                        </button>
                        <button @click="openActionModal('cashbon', c.id, 'rejected')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">
                          Tolak
                        </button>
                      </div>
                      <span v-else class="text-gray-400 font-medium text-[10px] uppercase">
                        {{ c.approver_name ? 'Oleh ' + c.approver_name : 'Selesai' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 4: Ongkos Tukang -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'ongkos_tukang'" class="space-y-6">
          <div class="bg-white dark:bg-gray-850 p-4 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Catatan Ongkos Tukang Proyek</span>
            <button @click="openOngkosTukangModal()" class="bg-red-800 hover:bg-red-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap">
              <span class="material-symbols-outlined text-sm font-semibold">add</span>
              Tambah Ongkos Tukang
            </button>
          </div>

          <!-- Ongkos Tukang Table -->
          <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 text-[9px] tracking-wider font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                    <th class="py-4 px-6 w-12 text-center">No</th>
                    <th class="py-4 px-6">Nama Proyek</th>
                    <th class="py-4 px-6">Tanggal</th>
                    <th class="py-4 px-6">Keterangan / Deskripsi</th>
                    <th class="py-4 px-6 text-right">Nominal</th>
                    <th class="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <tr v-if="ongkosTukangList.length === 0">
                    <td colspan="6" class="py-12 text-center text-gray-400">Data ongkos tukang belum ada.</td>
                  </tr>
                  <tr v-else v-for="(ot, idx) in ongkosTukangList" :key="ot.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td class="py-4 px-6 text-center text-gray-400">{{ idx + 1 }}</td>
                    <td class="py-4 px-6 font-bold text-gray-800 dark:text-gray-200">[{{ ot.rab_code }}] {{ ot.project_name }}</td>
                    <td class="py-4 px-6 text-gray-400">{{ formatDate(ot.date) }}</td>
                    <td class="py-4 px-6 font-semibold">{{ ot.description }}</td>
                    <td class="py-4 px-6 text-right font-mono font-bold text-gray-900 dark:text-white">{{ formatCurrency(ot.amount) }}</td>
                    <td class="py-4 px-6 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button @click="openOngkosTukangModal(ot)" class="text-amber-600 hover:text-amber-800" title="Edit">
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button @click="deleteOngkosTukang(ot.id)" class="text-red-650 hover:text-red-800" title="Hapus">
                          <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Modal Form: Rembes Baru -->
    <BaseModal :show="showRembesModal" title="Catat Rembesan Baru" @close="closeRembesModal">
      <form @submit.prevent="submitRembes" class="p-6 space-y-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Pilih Proyek RAB</label>
          <select v-model="rembesForm.rab_id" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0">
            <option value="" disabled>-- Pilih Proyek --</option>
            <option v-for="r in rabsList" :key="r.id" :value="r.id">
              {{ r.code }} - {{ r.project_name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Tanggal Belanja</label>
            <input v-model="rembesForm.date" type="date" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Deskripsi Ringkas</label>
            <input v-model="rembesForm.description" type="text" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Beli baut / paku tambahan"/>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Nominal Rembes</label>
          <input v-model.number="rembesForm.actual_amount" type="number" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Rp"/>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Catatan Keterangan</label>
          <textarea v-model="rembesForm.notes" rows="2" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Alasan mengapa melebihi anggaran..."></textarea>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeRembesModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Simpan Catatan
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Modal Form: Cashbon Actions (Approve / Reject Notes) -->
    <BaseModal :show="showActionModal" :title="actionModalTitle" @close="closeActionModal">
      <div class="p-6 space-y-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Catatan / Komentar Persetujuan</label>
          <textarea v-model="actionNotes" rows="3" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Masukkan instruksi pencairan dana atau alasan penolakan..."></textarea>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button @click="closeActionModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button @click="submitActionForm" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Konfirmasi
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Modal: RAB Detail & Linked POs -->
    <BaseModal :show="showRabDetailModal" title="Detail RAB & PO Terkait" @close="closeRabDetailModal">
      <div class="p-6 space-y-6">
        <div v-if="rabDetail" class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Kode RAB</span>
              <p class="font-bold text-red-800 dark:text-red-500">{{ rabDetail.code }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Status</span>
              <p class="font-bold uppercase">{{ rabDetail.status }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Nama Proyek</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ rabDetail.project_name }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Klien</span>
              <p class="text-gray-600 dark:text-gray-300">{{ rabDetail.client || '-' }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Tanggal</span>
              <p class="text-gray-600 dark:text-gray-300">{{ formatDate(rabDetail.date) }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Total Anggaran</span>
              <p class="font-mono font-bold text-gray-900 dark:text-white">{{ formatCurrency(rabDetail.total_budget) }}</p>
            </div>
          </div>

          <!-- RAB Items -->
          <div>
            <h4 class="text-xs font-bold text-gray-500 uppercase mb-2">Rincian Item RAB</h4>
            <div class="border border-gray-150 dark:border-gray-800 rounded-xl overflow-hidden">
              <table class="w-full text-left border-collapse text-xs">
                <thead class="bg-gray-50/70 dark:bg-gray-900/10 text-[9px] tracking-wider font-bold text-gray-400 uppercase">
                  <tr>
                    <th class="py-3 px-4 w-8 text-center">No</th>
                    <th class="py-3 px-4">Kategori</th>
                    <th class="py-3 px-4">Nama Item</th>
                    <th class="py-3 px-4">Deskripsi</th>
                    <th class="py-3 px-4 w-16 text-center">Satuan</th>
                    <th class="py-3 px-4 w-16 text-center">Qty</th>
                    <th class="py-3 px-4 w-28 text-right">Harga Satuan</th>
                    <th class="py-3 px-4 w-28 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-if="!rabDetail.items || rabDetail.items.length === 0">
                    <td colspan="8" class="py-6 text-center text-gray-400">Tidak ada item</td>
                  </tr>
                  <tr v-for="(item, idx) in (rabDetail.items || [])" :key="idx" :class="{'bg-gray-50/50 dark:bg-gray-800/20 font-bold': item.is_header}">
                    <td class="py-2.5 px-4 text-center">
                      <span v-if="item.is_header">{{ getDetailHeaderLetter(rabDetail.items, idx) }}</span>
                      <span v-else>{{ getDetailItemNumber(rabDetail.items, idx) }}</span>
                    </td>
                    <td class="py-2.5 px-4 uppercase">{{ item.is_header ? '-' : (item.section || '-') }}</td>
                    <td class="py-2.5 px-4 font-semibold" :class="{'text-red-800 dark:text-red-500': item.is_header}">{{ item.item_name || '-' }}</td>
                    <td class="py-2.5 px-4 text-gray-500">{{ item.is_header ? '-' : (item.description || '-') }}</td>
                    <td class="py-2.5 px-4 text-center">{{ item.is_header ? '-' : (item.unit || '-') }}</td>
                    <td class="py-2.5 px-4 text-center">{{ item.is_header ? '-' : item.qty }}</td>
                    <td class="py-2.5 px-4 text-right font-mono">{{ item.is_header ? '-' : formatCurrency(item.unit_price) }}</td>
                    <td class="py-2.5 px-4 text-right font-mono font-semibold">{{ item.is_header ? '-' : formatCurrency((item.qty || 0) * (item.unit_price || 0)) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Linked POs -->
          <div>
            <h4 class="text-xs font-bold text-gray-500 uppercase mb-2">PO Terkait</h4>
            <div v-if="rabDetailPos.length === 0" class="text-xs text-gray-400 italic py-4">Belum ada PO terkait untuk RAB ini.</div>
            <div v-else class="border border-gray-150 dark:border-gray-800 rounded-xl overflow-hidden">
              <table class="w-full text-left border-collapse text-xs">
                <thead class="bg-gray-50/70 dark:bg-gray-900/10 text-[9px] tracking-wider font-bold text-gray-400 uppercase">
                  <tr>
                    <th class="py-3 px-4">No PO</th>
                    <th class="py-3 px-4">Supplier</th>
                    <th class="py-3 px-4">Tanggal</th>
                    <th class="py-3 px-4 text-right">Total</th>
                    <th class="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="po in rabDetailPos" :key="po.id">
                    <td class="py-2.5 px-4 font-bold text-red-800 dark:text-red-500">{{ po.code || po.po_number || '-' }}</td>
                    <td class="py-2.5 px-4">{{ po.supplier_name || '-' }}</td>
                    <td class="py-2.5 px-4 text-gray-400">{{ formatDate(po.date) }}</td>
                    <td class="py-2.5 px-4 text-right font-mono font-semibold">{{ formatCurrency(po.total_amount) }}</td>
                    <td class="py-2.5 px-4 text-center">
                      <span :class="[
                        po.status === 'completed' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' :
                        po.status === 'approved' ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/20' :
                        'text-gray-600 bg-gray-50 dark:bg-gray-800/40',
                        'px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase'
                      ]">{{ po.status || '-' }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end">
          <button @click="closeRabDetailModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">Tutup</button>
        </div>
      </div>
    </BaseModal>

    <!-- Modal Form: Ongkos Tukang -->
    <BaseModal :show="showOngkosTukangModal" :title="ongkosTukangForm.id ? 'Edit Ongkos Tukang' : 'Catat Ongkos Tukang Baru'" @close="closeOngkosTukangModal">
      <form @submit.prevent="submitOngkosTukang" class="p-6 space-y-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Pilih Proyek RAB</label>
          <select v-model="ongkosTukangForm.rab_id" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0">
            <option value="" disabled>-- Pilih Proyek --</option>
            <option v-for="r in rabsList" :key="r.id" :value="r.id">
              [{{ r.code }}] {{ r.project_name }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Tanggal Pembayaran</label>
          <input v-model="ongkosTukangForm.date" type="date" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0"/>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Deskripsi / Keterangan</label>
          <input v-model="ongkosTukangForm.description" type="text" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Contoh: Ongkos pasang plafon gypsum 2 orang"/>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Nominal Ongkos Tukang (Rp)</label>
          <input v-model.number="ongkosTukangForm.amount" type="number" min="1" required class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-xs focus:border-red-500 focus:ring-0" placeholder="Rp"/>
        </div>

        <div class="border-t border-gray-150 dark:border-gray-800 pt-4 flex justify-end space-x-2">
          <button type="button" @click="closeOngkosTukangModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-550 dark:text-gray-400 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Modal Form: RAB Builder (Popup) -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="builderMode" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="cancelBuilder">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="cancelBuilder"></div>
          <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto z-10">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h3 class="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-base text-red-600">{{ builderForm.id ? 'edit_note' : 'add' }}</span>
                  {{ builderForm.id ? 'Edit Rencana Anggaran Biaya' : 'Buat RAB Baru' }}
                </h3>
                <p class="text-[10px] text-gray-400 mt-0.5">Atur kode proyek, detail klien, dan rincian material/pekerjaan.</p>
              </div>
              <button @click="cancelBuilder" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <!-- Modal Body: RAB Form -->
            <div class="p-6 space-y-6">
              <!-- Meta Data Fields -->
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="md:col-span-1">
                  <label class="text-[10px] font-bold text-gray-400 block mb-1">Kode RAB</label>
                  <input v-model="builderForm.code" type="text" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs py-2.5 px-4 focus:border-red-500 focus:ring-0" :placeholder="'Contoh: ' + generatedRabCode"/>
                </div>
                <div class="md:col-span-2">
                  <label class="text-[10px] font-bold text-gray-400 block mb-1">Nama Proyek</label>
                  <input v-model="builderForm.project_name" type="text" required class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs py-2.5 px-4 focus:border-red-500 focus:ring-0" placeholder="Contoh: Renovasi Dapur Modern Sleman"/>
                </div>
                <div class="md:col-span-1">
                  <label class="text-[10px] font-bold text-gray-400 block mb-1">Klien</label>
                  <input v-model="builderForm.client" type="text" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs py-2.5 px-4 focus:border-red-500 focus:ring-0" placeholder="Contoh: Ibu Rina"/>
                </div>
                <div class="md:col-span-1">
                  <label class="text-[10px] font-bold text-gray-400 block mb-1">Status Proyek</label>
                  <select v-model="builderForm.status" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs py-2.5 px-4 focus:border-red-500 focus:ring-0">
                    <option value="draft">Draft</option>
                    <option value="dikerjakan">Dikerjakan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <!-- Items list table -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-gray-700 dark:text-gray-200">Daftar Item Rincian Biaya</span>
                  <button @click="addBuilderRow" type="button" class="border border-red-800 text-red-800 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <span class="material-symbols-outlined text-sm font-semibold">add</span>
                    Tambah Pekerjaan Utama
                  </button>
                </div>

                <div class="border border-gray-150 dark:border-gray-800 rounded-xl overflow-hidden">
                  <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50/70 dark:bg-gray-900/10 text-[9px] tracking-wider font-bold text-gray-400 uppercase border-b border-gray-150 dark:border-gray-800">
                      <tr>
                        <th class="py-3 px-2 w-12 text-center">NO</th>
                        <th class="py-3 px-3">Item Pekerjaan / Sub-Pekerjaan</th>
                        <th class="py-3 px-3 w-1/4">Material</th>
                        <th class="py-3 px-2 w-16 text-center">P</th>
                        <th class="py-3 px-2 w-16 text-center">L</th>
                        <th class="py-3 px-3 w-28 text-right">Harga</th>
                        <th class="py-3 px-3 w-20 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                       <tr v-if="builderForm.items.length === 0">
                        <td colspan="7" class="py-8 text-center text-gray-400 font-medium">Belum ada pekerjaan ditambahkan. Silakan klik "+ Tambah Pekerjaan Utama".</td>
                      </tr>
                      <tr v-else v-for="(item, idx) in builderForm.items" :key="idx" class="align-middle hover:bg-gray-50/50 dark:hover:bg-gray-800/10" :class="{'bg-red-50/20 dark:bg-red-955/5': item.is_header}">
                        <!-- NO Column -->
                        <td class="py-2.5 px-2 text-center text-gray-400 font-bold">
                          <span v-if="item.is_header" class="text-red-800 dark:text-red-500 text-xs">{{ getHeaderLetter(idx) }}</span>
                          <span v-else class="pl-3 text-[10px]">{{ getItemNumber(idx) }}</span>
                        </td>
                        <!-- Item Pekerjaan Column -->
                        <td class="py-2.5 px-2">
                          <div :class="{'pl-6': !item.is_header}" class="flex items-center">
                            <span v-if="!item.is_header" class="text-gray-400 mr-1.5 font-bold">↳</span>
                            <input 
                              v-model="item.item_name" 
                              type="text" 
                              class="w-full border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-1.5 text-xs focus:ring-0" 
                              :class="{'font-bold text-red-800 dark:text-red-500 bg-red-50/10': item.is_header}" 
                              :placeholder="item.is_header ? 'Nama Pekerjaan Utama (misal: Pekerjaan Kitchen)' : 'Nama Sub-Pekerjaan'"
                            />
                          </div>
                        </td>
                        <!-- Description Column -->
                        <td class="py-2.5 px-2">
                          <input v-model="item.description" :disabled="!!item.is_header" type="text" class="w-full border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-1.5 text-xs focus:ring-0 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:opacity-50" placeholder="Material / deskripsi"/>
                        </td>
                        <!-- Qty P Column -->
                        <td class="py-2.5 px-1 text-center">
                          <input v-model.number="item.qty" :disabled="!!item.is_header" type="number" step="any" min="0" class="w-full border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-1.5 text-xs focus:ring-0 text-center disabled:opacity-50" placeholder="0"/>
                        </td>
                        <!-- Unit L Column -->
                        <td class="py-2.5 px-1 text-center">
                          <input v-model="item.unit" :disabled="!!item.is_header" type="text" class="w-full border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-1.5 text-xs focus:ring-0 text-center disabled:opacity-50" placeholder="1"/>
                        </td>
                        <!-- Unit Price Column -->
                        <td class="py-2.5 px-2">
                          <input v-model.number="item.unit_price" :disabled="!!item.is_header" type="number" min="0" class="w-full border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-1.5 text-xs focus:ring-0 text-right disabled:opacity-50" placeholder="0"/>
                        </td>
                        <!-- Actions Column -->
                        <td class="py-2.5 px-2 text-center">
                          <div class="flex items-center justify-center space-x-1">
                            <button 
                              v-if="item.is_header" 
                              @click="addSubItem(idx)" 
                              type="button" 
                              class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors flex items-center justify-center" 
                              title="Tambah Sub-Item Pekerjaan"
                            >
                              <span class="material-symbols-outlined text-lg">add_circle</span>
                            </button>
                            <button 
                              @click="removeBuilderRow(idx)" 
                              type="button" 
                              class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 transition-colors flex items-center justify-center"
                              title="Hapus"
                            >
                              <span class="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Summary Total -->
              <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl">
                <span class="text-xs font-bold text-gray-500">Estimasi Total Anggaran</span>
                <span class="text-lg font-black text-red-800 dark:text-red-500 font-mono">{{ formatCurrency(builderTotalBudget) }}</span>
              </div>

              <!-- Save / Cancel button actions -->
              <div class="flex justify-end space-x-3">
                <button @click="cancelBuilder" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 dark:text-gray-400 font-semibold text-xs hover:bg-gray-50 dark:hover:bg-gray-800">
                  Batal
                </button>
                <button @click="submitRabForm" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
                  Simpan RAB Proyek
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Action Dropdown Teleport -->
    <teleport to="body">
      <div 
        v-if="activeDropdown && selectedRab" 
        :style="dropdownStyle"
        class="fixed w-40 bg-white dark:bg-gray-850 rounded-2xl shadow-xl border border-gray-150 dark:border-gray-800 py-2 z-[9999] animate-fade-in"
      >
        <button 
          @click="viewRabDetail(selectedRab); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-blue-600">visibility</span>
          <span>Detail & PO</span>
        </button>
        <button 
          @click="printRabRow(selectedRab); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-gray-500">print</span>
          <span>Cetak RAB</span>
        </button>
        <button 
          @click="downloadRabRow(selectedRab); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-emerald-600">download</span>
          <span>Unduh PDF</span>
        </button>
        <button 
          @click="editRab(selectedRab.id); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm text-amber-600">edit_note</span>
          <span>Ubah / Edit</span>
        </button>
        <hr class="my-1 border-gray-100 dark:border-gray-800" />
        <button 
          @click="deleteRab(selectedRab.id); closeAllDropdowns()" 
          class="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center space-x-2.5 transition-colors"
        >
          <span class="material-symbols-outlined text-sm">delete</span>
          <span>Hapus RAB</span>
        </button>
      </div>
    </teleport>

  </div>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import BaseModal from '../../components/ui/BaseModal.vue'
import DateRangePicker from '../../components/ui/DateRangePicker.vue'
import { useApi } from '../../composables/useApi'
import { useAppStore } from '../../stores/app'
import { formatCurrency, formatDate } from '../../utils/helpers'
import html2pdf from 'html2pdf.js'

const api = useApi()
const appStore = useAppStore()

const activeDropdown = ref(null)
const selectedRab = ref(null)
const dropdownStyle = ref({})
const generatedRabCode = ref('')

function toggleDropdown(event, r) {
  if (activeDropdown.value === r.id) {
    closeAllDropdowns()
    return
  }
  activeDropdown.value = r.id
  selectedRab.value = r
  
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
  selectedRab.value = null
  window.removeEventListener('click', closeAllDropdowns)
  window.removeEventListener('scroll', closeAllDropdowns, { capture: true })
}

function toLocalDateString(dateInput) {
  if (!dateInput) return ''
  let standardized = dateInput
  if (typeof standardized === 'string' && standardized.includes(' ') && !standardized.includes('T')) {
    standardized = standardized.replace(' ', 'T')
  }
  const date = new Date(standardized)
  if (isNaN(date.getTime())) return ''
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const parts = formatter.formatToParts(date)
  const year = parts.find(p => p.type === 'year').value
  const month = parts.find(p => p.type === 'month').value
  const day = parts.find(p => p.type === 'day').value
  return `${year}-${month}-${day}`
}

const activeTab = ref('rab')

const tabs = [
  { id: 'rab', name: 'RAB Builder', icon: 'calculate' },
  { id: 'rembes', name: 'Rembes Lapangan', icon: 'trending_down' },
  { id: 'cashbon', name: 'Persetujuan Cashbon', icon: 'payments' },
  { id: 'ongkos_tukang', name: 'Ongkos Tukang', icon: 'construction' }
]

// RAB List states
const rabsList = ref([])
const searchQuery = ref('')
const builderMode = ref(false)
const filterDateStart = ref('')
const filterDateEnd = ref('')

// Builder Form states
const builderForm = ref({
  id: '',
  code: '',
  project_name: '',
  client: '',
  status: 'draft',
  items: []
})

// RAB Detail modal states
const showRabDetailModal = ref(false)
const rabDetail = ref(null)
const rabDetailPos = ref([])

// Rembes states
const rembesList = ref([])
const showRembesModal = ref(false)
const rembesForm = ref({
  rab_id: '',
  date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
  description: '',
  rab_amount: 0,
  actual_amount: 0,
  notes: ''
})

// Cashbon states
const cashbonList = ref([])
const showActionModal = ref(false)
const cashbonFilterDateStart = ref('')
const cashbonFilterDateEnd = ref('')

// Ongkos Tukang states
const ongkosTukangList = ref([])
const showOngkosTukangModal = ref(false)
const ongkosTukangForm = ref({
  id: '',
  rab_id: '',
  date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
  description: '',
  amount: 0
})
const actionModalTitle = ref('Tindakan Persetujuan')
const actionTargetType = ref('') // 'cashbon'
const actionTargetId = ref(null)
const actionTargetStatus = ref('') // 'approved', 'rejected'
const actionNotes = ref('')

onMounted(async () => {
  await loadAllData()
  window.addEventListener('click', closeAllDropdowns)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeAllDropdowns)
})

async function loadAllData() {
  try {
    const rabsData = await api.get('/api/rab')
    rabsList.value = rabsData

    const rembesData = await api.get('/api/rab/rembes')
    rembesList.value = rembesData

    const cashbonData = await api.get('/api/rab/cashbon')
    cashbonList.value = cashbonData

    const otData = await api.get('/api/rab/ongkos-tukang')
    ongkosTukangList.value = otData
  } catch (err) {
    appStore.showAlert('Gagal memuat data dari server.', 'error')
  }
}


// ==========================================
// RAB ACTIONS
// ==========================================
const filteredRabs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const ds = filterDateStart.value
  const de = filterDateEnd.value
  return rabsList.value.filter(r => {
    if (ds || de) {
      if (!r.date) return false
      const dStr = toLocalDateString(r.date)
      if (ds && dStr < ds) return false
      if (de && dStr > de) return false
    }
    return r.project_name.toLowerCase().includes(q) || 
      r.code.toLowerCase().includes(q) ||
      (r.client && r.client.toLowerCase().includes(q))
  })
})

function startNewRab() {
  generatedRabCode.value = 'KCM-RAB-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900)
  builderForm.value = {
    id: '',
    code: '',
    project_name: '',
    client: '',
    status: 'draft',
    items: []
  }
  builderMode.value = true
}

async function editRab(id) {
  try {
    const rab = await api.get('/api/rab', { id })
    builderForm.value = {
      id: rab.id,
      code: rab.code,
      project_name: rab.project_name,
      client: rab.client || '',
      status: rab.status,
      items: rab.items || []
    }
    builderMode.value = true
  } catch (err) {
    appStore.showAlert('Gagal mengambil detail RAB.', 'error')
  }
}

async function deleteRab(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus rancangan RAB ini?')) return
  try {
    await api.delete('/api/rab', { id })
    appStore.showAlert('RAB berhasil dihapus.', 'success')
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal menghapus RAB.', 'error')
  }
}

const builderTotalBudget = computed(() => {
  return builderForm.value.items.reduce((sum, item) => {
    if (item.is_header) return sum
    return sum + (parseFloat(item.unit_price) || 0)
  }, 0)
})

function getHeaderLetter(idx) {
  let count = 0
  for (let i = 0; i <= idx; i++) {
    if (builderForm.value.items[i]?.is_header) {
      count++
    }
  }
  return String.fromCharCode(64 + count) // 65 is 'A'
}

function getItemNumber(idx) {
  let num = 0
  for (let i = 0; i <= idx; i++) {
    if (builderForm.value.items[i]?.is_header) {
      num = 0
    } else {
      num++
    }
  }
  return num
}

function addSubItem(parentIdx) {
  builderForm.value.items.splice(parentIdx + 1, 0, {
    section: 'bahan',
    item_name: '',
    description: '',
    unit: '1',
    qty: 1,
    unit_price: 0,
    is_header: 0
  })
}

function addBuilderRow() {
  builderForm.value.items.push({
    section: 'bahan',
    item_name: '',
    description: '',
    unit: '',
    qty: 0,
    unit_price: 0,
    is_header: 1
  })
}

function getDetailHeaderLetter(items, idx) {
  let count = 0
  for (let i = 0; i <= idx; i++) {
    if (items[i]?.is_header) count++
  }
  return String.fromCharCode(64 + count)
}

function getDetailItemNumber(items, idx) {
  let num = 0
  for (let i = 0; i <= idx; i++) {
    if (items[i]?.is_header) num = 0
    else num++
  }
  return num
}

function removeBuilderRow(idx) {
  builderForm.value.items.splice(idx, 1)
}

function cancelBuilder() {
  builderMode.value = false
}

async function submitRabForm() {
  if (!builderForm.value.code) {
    builderForm.value.code = generatedRabCode.value
  }
  if (!builderForm.value.code || !builderForm.value.project_name) {
    appStore.showAlert('Kode RAB dan Nama Proyek wajib diisi.', 'error')
    return
  }
  try {
    await api.post('/api/rab', builderForm.value)
    appStore.showAlert('RAB proyek berhasil disimpan.', 'success')
    builderMode.value = false
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal menyimpan RAB: ' + (err.response?.data?.error || err.message), 'error')
  }
}

// ==========================================
// REMBES ACTIONS
// ==========================================
function openRembesModal() {
  rembesForm.value = {
    rab_id: '',
    date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
    description: '',
    rab_amount: 0,
    actual_amount: 0,
    notes: ''
  }
  showRembesModal.value = true
}

function closeRembesModal() {
  showRembesModal.value = false
}

async function submitRembes() {
  if (!rembesForm.value.rab_id || !rembesForm.value.description) {
    appStore.showAlert('Mohon lengkapi proyek dan deskripsi rembesan.', 'error')
    return
  }
  try {
    rembesForm.value.rab_amount = rembesForm.value.actual_amount
    await api.post('/api/rab/rembes', rembesForm.value)
    appStore.showAlert('Rembes lapangan berhasil disimpan.', 'success')
    closeRembesModal()
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal mencatat rembes: ' + (err.response?.data?.error || err.message), 'error')
  }
}

async function deleteRembes(id) {
  if (!confirm('Hapus catatan rembesan ini?')) return
  try {
    await api.delete('/api/rab/rembes', { id })
    appStore.showAlert('Catatan rembesan terhapus.', 'success')
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal menghapus rembesan.', 'error')
  }
}

// ==========================================
// PERSETUJUAN CASHBON
// ==========================================
const filteredCashbon = computed(() => {
  const ds = cashbonFilterDateStart.value
  const de = cashbonFilterDateEnd.value
  return cashbonList.value.filter(c => {
    if (ds || de) {
      if (!c.date) return false
      const dStr = toLocalDateString(c.date)
      if (ds && dStr < ds) return false
      if (de && dStr > de) return false
    }
    return true
  })
})

const cashbonUserSummary = computed(() => {
  const map = {}
  filteredCashbon.value.forEach(c => {
    const name = c.employee_name || 'Tidak Diketahui'
    if (!map[name]) map[name] = { name, total: 0, count: 0 }
    map[name].total += parseFloat(c.amount) || 0
    map[name].count++
  })
  return Object.values(map).sort((a, b) => b.total - a.total)
})

function generateRabPrintHTML(rabData) {
  const r = rabData || builderForm.value
  const rabDate = r.date || new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' })
  let rabRows = ''
  let totalHarga = 0
  const items = r.items || []
  let no = 1
  let headerCount = 0
  let itemCount = 0

  // Build rows: qty=P, unit=L, unit_price=Harga
  items.forEach(item => {
    if (item.is_header) {
      headerCount++
      itemCount = 0 // reset item counter for new category
      const letter = String.fromCharCode(64 + headerCount) // A, B, C...
      let displayName = item.item_name || ''
      
      // Ensure the display name starts with standard 'A. ', 'B. ' style matching current sequence
      const pattern = new RegExp(`^${letter}\\s*\\.?\\s*`, 'i')
      if (!pattern.test(displayName)) {
        displayName = displayName.replace(/^[A-Z]\s*\.?\s*/i, '') // remove old letter prefix
        displayName = `${letter}. ${displayName}`
      }
      
      rabRows += `<tr style="background-color: #f9f9f9; font-weight: bold;">
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;"><strong>${letter}</strong></td>
        <td style="border:1px solid #333;padding:6px 8px;font-size:12px;text-align:left;" colspan="2"><strong>${displayName}</strong></td>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">-</td>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">-</td>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">-</td>
        <td style="text-align:right;border:1px solid #333;padding:6px 8px;font-size:12px;">-</td>
      </tr>`
    } else {
      itemCount++
      const p = parseFloat(item.qty) || 0
      const l = parseFloat(item.unit) || 0
      const v = p * l
      const harga = parseFloat(item.unit_price) || 0
      totalHarga += harga
      rabRows += `<tr>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">${itemCount}</td>
        <td style="border:1px solid #333;padding:6px 8px;font-size:12px;text-align:left;">${item.item_name || '-'}</td>
        <td style="border:1px solid #333;padding:6px 8px;font-size:12px;text-align:left;">${item.description || '-'}</td>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">${p ? p.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2}) : '-'}</td>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">${l ? l.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2}) : '-'}</td>
        <td style="text-align:center;border:1px solid #333;padding:6px 8px;font-size:12px;">${v ? v.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2}) : '-'}</td>
        <td style="text-align:right;border:1px solid #333;padding:6px 8px;font-size:12px;font-family:monospace;">${Number(harga).toLocaleString('id-ID')}</td>
      </tr>`
    }
  })

  const officeFooter = `<div style="margin-top:36px;text-align:center;font-size:10px;color:#666;border-top:2px double #333;padding-top:12px;clear:both;">
    <p><strong>OFFICE:</strong></p>
    <p>Jl. Kaliurang Km. 12, Candiwinangun RT 6/ RW 13 No. 24</p>
    <p>Sardonoharjo, Ngaglik, Sleman, Yogyakarta</p>
    <p>Telp/Wa: 0858.6800.0012</p>
    <p>Email: kcm_production@ymail.com | IG: @pengrajin_interiorkcm</p>
  </div>`

  if (items.length === 0) {
    rabRows = `<tr><td colspan="7" style="text-align:center;border:1px solid #333;padding:8px;font-size:12px;">-</td></tr>`
  }
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Surat Penawaran - ${r.project_name || 'KCM'}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; padding:12mm; color:#333; font-size:13px; line-height: 1.5; }
  @media print { @media page { size:A4; margin:10mm; } .page-break{page-break-before:always;} }
  table.rab{width:100%;border-collapse:collapse;margin-top:10px;}
  table.rab th,table.rab td{border:1px solid #333;padding:6px 8px;font-size:12px;}
  table.rab th{background:#f5f5f5;font-weight:bold;text-transform:uppercase;font-size:11px;}
  .footer{margin-top:24px;text-align:center;font-size:10px;color:#666;border-top:2px double #333;padding-top:10px;}
</style>
</head>
<body>

<!-- HEADER WITH BRAND LOGO -->
<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #333; padding-bottom:12px; margin-bottom:16px;">
  <div>
    <img src="/logo_no_background.png" style="height:120px; max-width:340px; object-fit:contain;" alt="CV. KURNIA CIPTA MANDIRI Logo" />
  </div>
  <div style="text-align:right;">
    <h1 style="font-size:18px; font-weight:bold; color:#991B1B; margin-bottom:2px;">SURAT PENAWARAN HARGA (RAB)</h1>
    <p style="font-size:10px; color:#555; font-weight:600;">CV. KURNIA CIPTA MANDIRI</p>
  </div>
</div>

<!-- METADATA INFORMATION TABLE (ALIGNED COLONS) -->
<table style="width:auto; border-collapse:collapse; margin-bottom:16px; font-size:12px; border:none;">
  <tr style="border:none;">
    <td style="padding:2px 0; border:none; width:120px; font-weight:bold; text-align:left;">Nomor Ref</td>
    <td style="padding:2px 4px; border:none; width:10px; text-align:center;">:</td>
    <td style="padding:2px 0; border:none; text-align:left;">${r.code || '-'}</td>
  </tr>
  <tr style="border:none;">
    <td style="padding:2px 0; border:none; font-weight:bold; text-align:left;">Pekerjaan</td>
    <td style="padding:2px 4px; border:none; text-align:center;">:</td>
    <td style="padding:2px 0; border:none; text-align:left;">${r.project_name || '-'}</td>
  </tr>
  <tr style="border:none;">
    <td style="padding:2px 0; border:none; font-weight:bold; text-align:left;">Lokasi</td>
    <td style="padding:2px 4px; border:none; text-align:center;">:</td>
    <td style="padding:2px 0; border:none; text-align:left;">${r.client || 'Yogyakarta'}</td>
  </tr>
  <tr style="border:none;">
    <td style="padding:2px 0; border:none; font-weight:bold; text-align:left;">Nama Customer</td>
    <td style="padding:2px 4px; border:none; text-align:center;">:</td>
    <td style="padding:2px 0; border:none; text-align:left;">${r.client || '-'}</td>
  </tr>
</table>

<table class="rab">
  <thead>
    <tr>
      <th style="width:30px;text-align:center;">NO</th>
      <th style="text-align:left;">ITEM PEKERJAAN</th>
      <th style="text-align:left;">Material</th>
      <th style="width:50px;text-align:center;">P</th>
      <th style="width:50px;text-align:center;">L</th>
      <th style="width:55px;text-align:center;">V</th>
      <th style="width:100px;text-align:right;">HARGA</th>
    </tr>
  </thead>
  <tbody>
    ${rabRows}
  </tbody>
</table>

<div style="margin-top:10px;text-align:right;font-size:13px;margin-bottom:20px;">
  <strong>TOTAL &nbsp;&nbsp; Rp ${Number(totalHarga).toLocaleString('id-ID')}</strong>
</div>

<!-- PAGE 1 SIGNATURES -->
<div style="margin-top:24px; display:flex; justify-content:space-between; font-size:12px;">
  <div style="text-align:center; width:200px;">
    <p>Menyetujui,</p>
    <p style="margin-top:5px; margin-bottom:55px;"><strong>Customer</strong></p>
    <p>_______________________</p>
  </div>
  <div style="text-align:center; width:220px;">
    <p>Yogyakarta, ${new Date(rabDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })}</p>
    <p style="margin-top:5px; margin-bottom:5px;"><strong>CV. KURNIA CIPTA MANDIRI</strong></p>
    <div style="height:60px;margin:5px 0;display:flex;align-items:center;justify-content:center;">
      <img src="/ttd-direktur.jpeg" style="max-height:60px; max-width:145px; object-fit:contain;" alt="(Tanda Tangan)" onerror="this.style.display='none'" />
    </div>
    <p><u><strong>Anriko K., ST.</strong></u></p>
    <p style="font-size:10px;color:#555;">Pemilik / Direktur</p>
  </div>
</div>
<div style="clear:both;"></div>

${officeFooter}

<!-- PAGE 2: SURAT PENAWARAN -->
<div class="page-break"></div>

<!-- PAGE 2 HEADER WITH BRAND LOGO -->
<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #333; padding-bottom:12px; margin-bottom:16px;">
  <div>
    <img src="/logo_no_background.png" style="height:120px; max-width:340px; object-fit:contain;" alt="CV. KURNIA CIPTA MANDIRI Logo" />
  </div>
  <div style="text-align:right;">
    <h1 style="font-size:18px; font-weight:bold; color:#991B1B; margin-bottom:2px;">SURAT PENAWARAN HARGA (RAB)</h1>
    <p style="font-size:10px; color:#555; font-weight:600;">CV. KURNIA CIPTA MANDIRI</p>
  </div>
</div>

<div style="text-align:right;font-size:12px;margin-bottom:16px;">
  <p><strong>Yogyakarta, ${new Date(rabDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })}</strong></p>
  <p>Ref.No: ${r.code || '-'}</p>
</div>

<p style="font-size:12px;margin-bottom:8px;"><strong>Perihal : Penawaran ${r.project_name || '-'}</strong></p>

<div style="font-size:12px;line-height:1.6;margin-top:10px;">
  <p>Kepada Yth.</p>
  <p><strong>${r.client || '_________________'}</strong></p>
  <p>di ${r.client || 'Yogyakarta'}</p>

  <p style="margin-top:14px;">Dengan hormat,</p>
  <p>Bersama ini kami sampaikan penawaran untuk Pekerjaan <strong>${r.project_name || '-'}</strong> dengan penawaran sebagai berikut (rincian terlampir),</p>

  <div style="margin:12px 0;padding:8px 12px;border:1px solid #ddd;background:#f9f9f9;font-size:12px;">
    <strong>${r.project_name || '-'}</strong> &nbsp;&nbsp; <span style="float:right;font-family:monospace;font-weight:bold;">Rp ${Number(totalHarga).toLocaleString('id-ID')}</span>
  </div>

  <div style="background:#f9f9f9;padding:8px 12px;font-size:11px;margin-bottom:12px;font-style:italic;border:1px solid #ddd;">
    Terbilang: <strong>${terbilang(totalHarga)}</strong>
  </div>

  <p><strong>Sistem Pembayaran :</strong></p>
  <p style="padding-left:20px;">DP 50% sebelum pekerjaan dimulai.</p>
  <p style="padding-left:20px;">Pelunasan 100% setelah pekerjaan selesai.</p>

  <p style="margin-top:14px;"><strong>Masa berlaku penawaran ini adalah 21 hari sejak tanggal surat.</strong></p>
  <p style="padding-left:20px;font-size:11px;color:#666;">Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</p>

  <div style="border:1px solid #999;padding:10px 14px;margin:12px 0;font-size:11px;width:fit-content;">
    <p><strong>No. Rekening Pembayaran:</strong></p>
    <p>Bank BCA &nbsp; a.n. <strong>Anriko K</strong> &nbsp; No. <strong>0151 343 642</strong></p>
  </div>

  <p>Demikian surat penawaran ini kami buat dengan sebenar-benarnya. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>

  <!-- PAGE 2 SIGNATURES -->
  <div style="margin-top:32px; display:flex; justify-content:space-between; font-size:12px;">
    <div style="text-align:center; width:200px;">
      <p style="visibility:hidden;">Tanggal</p>
      <p style="margin-top:5px; margin-bottom:55px;">Menyetujui,</p>
      <p><strong>Customer</strong></p>
    </div>
    <div style="text-align:center; width:220px; float:right;">
      <p>Yogyakarta, ${new Date(rabDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })}</p>
      <p style="margin-top:5px; margin-bottom:5px;"><strong>CV. KURNIA CIPTA MANDIRI</strong></p>
      <div style="height:60px;margin:5px 0;display:flex;align-items:center;justify-content:center;">
        <img src="/ttd-direktur.jpeg" style="max-height:60px; max-width:145px; object-fit:contain;" alt="(Tanda Tangan)" onerror="this.style.display='none'" />
      </div>
      <p><u><strong>Anriko K., ST.</strong></u></p>
      <p style="font-size:10px;color:#555;">Pemilik / Direktur</p>
    </div>
  </div>
  <div style="clear:both;"></div>
</div>

${officeFooter}

</body>
</html>`
}


// Load a RAB from the list into builderForm for print/download operations
async function loadRabIntoBuilder(rab) {
  // If builderForm already has this RAB loaded, skip
  if (builderForm.value.id === rab.id && builderForm.value.items.length > 0) return
  try {
    const full = await api.get('/api/rab', { id: rab.id })
    builderForm.value = {
      id: full.id,
      code: full.code,
      project_name: full.project_name,
      client: full.client || '',
      status: full.status,
      items: full.items || []
    }
  } catch (err) {
    appStore.showAlert('Gagal memuat data RAB.', 'error')
    throw err
  }
}

async function printRabRow(rab) {
  await loadRabIntoBuilder(rab)
  const w = window.open('', '_blank')
  w.document.write(generateRabPrintHTML(builderForm.value))
  w.document.close()
  setTimeout(() => { w.print() }, 500)
}

async function downloadRabRow(rab) {
  await loadRabIntoBuilder(rab)
  
  const element = document.createElement('div')
  element.innerHTML = generateRabPrintHTML(builderForm.value)
  
  const filename = `RAB_${rab.project_name.replace(/\s+/g, '_')}_${rab.code}.pdf`
  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  
  html2pdf().from(element).set(opt).save()
}

async function viewRabDetail(rab) {
  rabDetail.value = rab
  rabDetailPos.value = []
  showRabDetailModal.value = true
  try {
    const pos = await api.get('/api/po', { rab_id: rab.id })
    rabDetailPos.value = Array.isArray(pos) ? pos : (pos.data || [])
  } catch (err) {
    // PO endpoint might not exist yet — show empty list silently
    rabDetailPos.value = []
  }
}

function closeRabDetailModal() {
  showRabDetailModal.value = false
  rabDetail.value = null
  rabDetailPos.value = []
}

// Terbilang: number to Indonesian words
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

function openActionModal(type, id, status) {
  actionTargetType.value = type
  actionTargetId.value = id
  actionTargetStatus.value = status
  actionNotes.value = ''
  
  if (status === 'approved') {
    actionModalTitle.value = 'Setujui Pengajuan Cashbon'
  } else {
    actionModalTitle.value = 'Tolak Pengajuan Cashbon'
  }
  showActionModal.value = true
}

function closeActionModal() {
  showActionModal.value = false
}

async function submitActionForm() {
  try {
    if (actionTargetType.value === 'cashbon') {
      await api.put('/api/rab/cashbon/status', {
        id: actionTargetId.value,
        status: actionTargetStatus.value,
        notes: actionNotes.value
      })
      appStore.showAlert('Tindakan cashbon berhasil dikonfirmasi.', 'success')
    }
    closeActionModal()
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal mengkonfirmasi persetujuan.', 'error')
  }
}

// ==========================================
// ONGKOS TUKANG ACTIONS
// ==========================================
function openOngkosTukangModal(ot = null) {
  if (ot) {
    ongkosTukangForm.value = {
      id: ot.id,
      rab_id: ot.rab_id,
      date: ot.date ? ot.date.split('T')[0] : new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
      description: ot.description,
      amount: ot.amount
    }
  } else {
    ongkosTukangForm.value = {
      id: '',
      rab_id: '',
      date: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }),
      description: '',
      amount: 0
    }
  }
  showOngkosTukangModal.value = true
}

function closeOngkosTukangModal() {
  showOngkosTukangModal.value = false
}

async function submitOngkosTukang() {
  if (!ongkosTukangForm.value.rab_id || !ongkosTukangForm.value.description || !ongkosTukangForm.value.amount) {
    appStore.showAlert('Mohon lengkapi seluruh formulir.', 'error')
    return
  }
  try {
    await api.post('/api/rab/ongkos-tukang', ongkosTukangForm.value)
    appStore.showAlert('Data ongkos tukang berhasil disimpan.', 'success')
    closeOngkosTukangModal()
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal menyimpan ongkos tukang: ' + (err.response?.data?.error || err.message), 'error')
  }
}

async function deleteOngkosTukang(id) {
  if (!confirm('Hapus data ongkos tukang ini?')) return
  try {
    await api.delete('/api/rab/ongkos-tukang', { id })
    appStore.showAlert('Data ongkos tukang berhasil dihapus.', 'success')
    await loadAllData()
  } catch (err) {
    appStore.showAlert('Gagal menghapus ongkos tukang.', 'error')
  }
}

</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
