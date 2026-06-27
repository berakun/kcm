<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <main class="flex-grow flex flex-col min-h-screen">
      <AppTopbar title="Slip Gaji Karyawan" />
      <div class="p-6 md:p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">

        <!-- Premium Filter & Overview Header -->
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-850 dark:to-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-fade-in">
          <!-- Month Selector -->
          <div class="w-full lg:max-w-xs space-y-2">
            <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">PILIH PERIODE GAJI</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">calendar_month</span>
              <select 
                v-model="selectedMonth" 
                @change="loadData" 
                class="w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-850 dark:text-white shadow-sm hover:border-red-500 dark:hover:border-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none"
              >
                <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">expand_more</span>
            </div>
          </div>

          <!-- Quick Stats Cards in Filter Area -->
          <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <!-- Stat 1: Periode -->
            <div class="bg-white/80 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/60 flex items-center gap-3">
              <div class="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-500 rounded-xl">
                <span class="material-symbols-outlined text-xl">date_range</span>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">PERIODE GAJI</p>
                <p class="text-xs font-black text-gray-850 dark:text-white mt-0.5">{{ calcMonthLabel }}</p>
              </div>
            </div>

            <!-- Stat 2: Total Pengeluaran -->
            <div class="bg-white/80 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/60 flex items-center gap-3">
              <div class="p-2.5 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-500 rounded-xl">
                <span class="material-symbols-outlined text-xl">payments</span>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">ESTIMASI TOTAL GAJI</p>
                <p class="text-xs font-mono font-black text-emerald-700 dark:text-emerald-500 mt-0.5">{{ formatCurrency(totalDiterima) }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="w-full lg:w-auto flex justify-end gap-2">
            <button 
              @click="cetakSemua" 
              :disabled="tableRows.length === 0" 
              class="w-full lg:w-auto px-6 py-3.5 bg-red-800 hover:bg-red-900 disabled:opacity-40 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-base">print</span> Cetak Semua Slip
            </button>
            <button 
              @click="downloadSemuaPDF" 
              :disabled="tableRows.length === 0" 
              class="w-full lg:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-base">download</span> Download Semua PDF
            </button>
          </div>
        </div>

        <!-- Pengaturan Gaji Toggle (superadmin only) -->
        <div v-if="isSuperAdmin">
          <button @click="showSettings = !showSettings" class="px-4 py-2 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="material-symbols-outlined text-sm">settings</span>
            {{ showSettings ? 'Tutup Pengaturan' : 'Pengaturan Gaji' }}
          </button>
        </div>

        <!-- Pengaturan Gaji Panel -->
        <div v-if="isSuperAdmin && showSettings" class="bg-white dark:bg-gray-850 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <h3 class="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-base">payments</span> Pengaturan Gaji Per Role
          </h3>

          <div v-for="role in availableRoles" :key="role.key" class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-gray-500 uppercase">{{ role.label }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Gaji Pokok</label>
                <input type="number" v-model.number="salarySettings[role.key].gajiPokok" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Makan & Transport</label>
                <input type="number" v-model.number="salarySettings[role.key].makanTransport" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Kesehatan</label>
                <input type="number" v-model.number="salarySettings[role.key].tunjanganKesehatan" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Jabatan</label>
                <input type="number" v-model.number="salarySettings[role.key].tunjanganJabatan" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Hari Raya</label>
                <input type="number" v-model.number="salarySettings[role.key].tunjanganHariRaya" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
            </div>
          </div>

          <!-- Rates Section -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-gray-500 uppercase">Rate Lembur & Potongan</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Lembur per Jam</label>
                <input type="number" v-model.number="salarySettings._rates.lemburJam" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Lembur per Hari</label>
                <input type="number" v-model.number="salarySettings._rates.lemburHari" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Libur per Hari</label>
                <input type="number" v-model.number="salarySettings._rates.libur" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Terlambat (10 menit)</label>
                <input type="number" v-model.number="salarySettings._rates.terlambat" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Absen Setengah Hari</label>
                <input type="number" v-model.number="salarySettings._rates.absenSetengah" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tidak Hadir (1 Hari)</label>
                <input type="number" v-model.number="salarySettings._rates.tidakHadir" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="saveSettings" class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">save</span> Simpan Pengaturan
            </button>
            <button @click="resetSettings" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">restart_alt</span> Reset Default
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">
          <span class="material-symbols-outlined animate-spin text-lg mb-2 block">progress_activity</span> Memuat data...
        </div>

        <!-- Employee Table -->
        <div v-if="!loading && tableRows.length > 0" class="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px] font-bold">
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Jabatan</th>
                  <th class="px-4 py-3 text-right">Gaji Pokok</th>
                  <th class="px-4 py-3 text-right">Makan & Transport</th>
                  <th class="px-4 py-3 text-right">Tunjangan</th>
                  <th class="px-4 py-3 text-right">Potongan</th>
                  <th class="px-4 py-3 text-right">Total Diterima</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-for="(row, idx) in tableRows" :key="row.userId" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="px-4 py-3 text-center font-bold text-gray-600 dark:text-gray-400">{{ idx + 1 }}</td>
                  <td class="px-4 py-3 font-bold text-red-800 dark:text-red-500 cursor-pointer hover:underline" @click="openDeductionsModal(row)">{{ row.name }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ row.roleLabel }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(row.gajiPokok) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(row.makanTransport) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(row.tunjangan) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-red-600">-{{ formatCurrency(row.potongan) }}</td>
                  <td class="px-4 py-3 text-right font-mono font-bold text-red-700 dark:text-red-500">{{ formatCurrency(row.totalDiterima) }}</td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button @click="cetakSlip(row)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-700" title="Cetak Slip">
                        <span class="material-symbols-outlined text-base">print</span>
                      </button>
                      <button @click="downloadSlipPDF(row)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-700" title="Download PDF">
                        <span class="material-symbols-outlined text-base">download</span>
                      </button>
                      <button @click="openEditModal(row)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-700" title="Edit Data">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-50 dark:bg-gray-800 font-bold text-xs">
                  <td class="px-4 py-3 text-center text-gray-500" colspan="3">TOTAL</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(totalGajiPokok) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(totalMakanTransport) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(totalTunjangan) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-red-600">-{{ formatCurrency(totalPotongan) }}</td>
                  <td class="px-4 py-3 text-right font-mono text-red-700 dark:text-red-500">{{ formatCurrency(totalDiterima) }}</td>
                  <td class="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && tableRows.length === 0 && users.length > 0" class="text-center py-12 text-gray-400 text-sm">
          Tidak ada data gaji untuk periode {{ calcMonthLabel }} (absensi bulan tersebut kosong).
        </div>

      </div>
    </main>

    <!-- Edit Modal -->
    <div v-if="editModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="editModal.show = false"></div>
      <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6 space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black text-gray-800 dark:text-white">Edit Data Karyawan</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ editModal.name }} — {{ editModal.roleLabel }}</p>
          </div>
          <button @click="editModal.show = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Gaji Pokok</label>
              <input type="number" v-model.number="editModal.gajiPokok" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Makan & Transport</label>
              <input type="number" v-model.number="editModal.makanTransport" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white focus:border-red-500 focus:ring-0">
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Jumlah Cuti (hari)</label>
            <input type="number" v-model.number="editModal.cuti" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Libur Tahunan (hari)</label>
            <input type="number" v-model.number="editModal.liburTahunan" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Kesehatan</label>
            <input type="number" v-model.number="editModal.tunjanganKesehatan" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Jabatan</label>
            <input type="number" v-model.number="editModal.tunjanganJabatan" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tunjangan Hari Raya</label>
            <input type="number" v-model.number="editModal.tunjanganHariRaya" min="0" class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:text-white">
          </div>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="editModal.show = false" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold">Batal</button>
          <button @click="saveEditModal" class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">save</span> Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Deductions Breakdown Modal -->
    <div v-if="deductionsModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="deductionsModal.show = false"></div>
      <div class="relative bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-3">
          <div>
            <h3 class="text-sm font-black text-gray-800 dark:text-white">Rincian Potongan Kehadiran</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ deductionsModal.name }} — {{ deductionsModal.roleLabel }}</p>
          </div>
          <button @click="deductionsModal.show = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-700 dark:text-gray-300">POTONGAN ABSENSI (TABEL):</span>
              <span class="font-mono font-bold text-red-700 dark:text-red-500">-{{ formatCurrency(deductionsModal.totalPotongan) }}</span>
            </div>
            <div v-if="deductionsModal.potonganMakanTransport > 0" class="flex justify-between items-center border-t border-red-100 dark:border-red-900/20 pt-2">
              <span class="font-bold text-gray-700 dark:text-gray-300">POTONGAN UANG MAKAN & TRANS:</span>
              <span class="font-mono font-bold text-red-700 dark:text-red-500">-{{ formatCurrency(deductionsModal.potonganMakanTransport) }}</span>
            </div>
          </div>

          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <!-- 1. Terlambat -->
            <div class="py-3 flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-800 dark:text-gray-200">Terlambat Hadir (10+ menit)</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Jumlah: {{ deductionsModal.potonganTerlambatCount }} kali</p>
              </div>
              <div class="text-right">
                <p class="font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(deductionsModal.potonganTerlambatCount * deductionsModal.terlambatRate) }}</p>
                <p class="text-[9px] text-gray-400 mt-0.5">Rate: {{ formatCurrency(deductionsModal.terlambatRate) }}/kali</p>
              </div>
            </div>

            <!-- 2. Absen Setengah Hari -->
            <div class="py-3 flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-800 dark:text-gray-200">Absen Setengah Hari</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Jumlah: {{ deductionsModal.potonganAbsenCount }} kali (Tanpa Check-Out)</p>
              </div>
              <div class="text-right">
                <p class="font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(deductionsModal.potonganAbsenCount * deductionsModal.absenSetengahRate) }}</p>
                <p class="text-[9px] text-gray-400 mt-0.5">Rate: {{ formatCurrency(deductionsModal.absenSetengahRate) }}/hari</p>
              </div>
            </div>

            <!-- 3. Tidak Hadir (Mangkir) -->
            <div class="py-3 flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-800 dark:text-gray-200">Tidak Hadir (Mangkir)</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Jumlah: {{ deductionsModal.potonganTidakHadirCount }} hari</p>
              </div>
              <div class="text-right">
                <p class="font-mono text-gray-700 dark:text-gray-300">{{ formatCurrency(deductionsModal.potonganTidakHadirCount * deductionsModal.tidakHadirRate) }}</p>
                <p class="text-[9px] text-gray-400 mt-0.5">Rate: {{ formatCurrency(deductionsModal.tidakHadirRate) }}/hari</p>
              </div>
            </div>

            <!-- 4. Penyesuaian Makan & Transport (Cuti) -->
            <div v-if="deductionsModal.cuti > 0" class="py-3 flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-800 dark:text-gray-200">Penyesuaian Makan & Transport (Cuti)</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Jumlah: {{ deductionsModal.cuti }} hari cuti</p>
              </div>
              <div class="text-right">
                <p class="font-mono text-red-650 dark:text-red-500">-{{ formatCurrency(deductionsModal.cuti * deductionsModal.dailyMakanTransport) }}</p>
                <p class="text-[9px] text-gray-400 mt-0.5">Rate: {{ formatCurrency(deductionsModal.dailyMakanTransport) }}/hari</p>
              </div>
            </div>

            <!-- 5. Penyesuaian Makan & Transport (Libur Tahunan) -->
            <div v-if="deductionsModal.liburTahunan > 0" class="py-3 flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-800 dark:text-gray-200">Penyesuaian Makan & Transport (Libur Tahunan)</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Jumlah: {{ deductionsModal.liburTahunan }} hari libur tahunan</p>
              </div>
              <div class="text-right">
                <p class="font-mono text-red-650 dark:text-red-500">-{{ formatCurrency(deductionsModal.liburTahunan * deductionsModal.dailyMakanTransport) }}</p>
                <p class="text-[9px] text-gray-400 mt-0.5">Rate: {{ formatCurrency(deductionsModal.dailyMakanTransport) }}/hari</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-[10px] text-gray-500 space-y-1">
            <p class="font-bold">Info Perhitungan Kehadiran:</p>
            <p>• Total Hari Kerja Bulan Ini: <span class="font-bold text-gray-700 dark:text-gray-300">{{ deductionsModal.totalWorkingDays }} hari</span> (Senin - Sabtu)</p>
            <p>• Hari Hadir Lengkap (Check-In & Out): <span class="font-bold text-gray-700 dark:text-gray-300">{{ deductionsModal.hadirLengkap }} hari</span></p>
            <p>• Cuti & Libur Resmi tidak dihitung sebagai potongan.</p>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button @click="deductionsModal.show = false" class="px-5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold">
            Tutup
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { useApi } from '../../composables/useApi'
import { formatCurrency } from '../../utils/helpers'

const api = useApi()
const loading = ref(false)
const showSettings = ref(false)

const now = new Date()
const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const monthNamesShort = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']

// Generate months list for last year and current year (up to current month for the current year)
const monthsList = []
const curYear = now.getFullYear()
const curMonthIdx = now.getMonth() // 0-indexed

// Last Year (All 12 months)
monthNames.forEach((m, i) => {
  monthsList.push({
    value: `${curYear - 1}-${String(i+1).padStart(2,'0')}`,
    label: `${m} ${curYear - 1}`
  })
})

// Current Year (Only up to current month)
for (let i = 0; i <= curMonthIdx; i++) {
  monthsList.push({
    value: `${curYear}-${String(i+1).padStart(2,'0')}`,
    label: `${monthNames[i]} ${curYear}`
  })
}

const months = ref(monthsList)
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`)
const users = ref([])
const currentUser = ref(null)
const tableRows = ref([]) // computed rows for the table

const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin')

const monthLabel = computed(() => {
  const [y, m] = selectedMonth.value.split('-')
  return `${monthNames[parseInt(m)-1]} ${y}`
})

const calcMonthLabel = computed(() => {
  const [y, m] = selectedMonth.value.split('-')
  const year = parseInt(y)
  const month = parseInt(m)
  let calcYear = year
  let calcMonth = month - 1
  if (calcMonth === 0) {
    calcMonth = 12
    calcYear = year - 1
  }
  return `${monthNames[calcMonth-1]} ${calcYear}`
})

// Table totals
const totalGajiPokok = computed(() => tableRows.value.reduce((s, r) => s + r.gajiPokok, 0))
const totalMakanTransport = computed(() => tableRows.value.reduce((s, r) => s + r.makanTransport, 0))
const totalTunjangan = computed(() => tableRows.value.reduce((s, r) => s + r.tunjangan, 0))
const totalPotongan = computed(() => tableRows.value.reduce((s, r) => s + r.potongan, 0))
const totalDiterima = computed(() => tableRows.value.reduce((s, r) => s + r.totalDiterima, 0))

// Roles
const availableRoles = [
  { key: 'super_admin', label: 'Super Admin' },
  { key: 'admin', label: 'Admin' },
  { key: 'staff', label: 'Staff' }
]

// Default salary settings
const defaultSettings = () => ({
  super_admin: { gajiPokok: 4500000, makanTransport: 800000, tunjanganKesehatan: 0, tunjanganJabatan: 0, tunjanganHariRaya: 0 },
  admin: { gajiPokok: 3500000, makanTransport: 700000, tunjanganKesehatan: 0, tunjanganJabatan: 0, tunjanganHariRaya: 0 },
  staff: { gajiPokok: 2500000, makanTransport: 625000, tunjanganKesehatan: 0, tunjanganJabatan: 0, tunjanganHariRaya: 0 },
  _rates: { lemburJam: 0, lemburHari: 0, libur: 25000, terlambat: 5000, absenSetengah: 40000, tidakHadir: 80000 }
})

// Load settings from localStorage
function loadSettings() {
  try {
    const raw = localStorage.getItem('kcm_salary_settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      const def = defaultSettings()
      for (const role of ['super_admin', 'admin', 'staff']) {
        def[role] = { ...def[role], ...(parsed[role] || {}) }
      }
      def._rates = { ...def._rates, ...(parsed._rates || {}) }
      return def
    }
  } catch (e) { console.error('Failed to load salary settings', e) }
  return defaultSettings()
}

const salarySettings = reactive(loadSettings())

// Employee overrides from localStorage
function loadOverrides() {
  try {
    const raw = localStorage.getItem('kcm_employee_overrides')
    return raw ? JSON.parse(raw) : {}
  } catch (e) { return {} }
}

function saveOverrides(data) {
  localStorage.setItem('kcm_employee_overrides', JSON.stringify(data))
}

// Edit modal state
const editModal = reactive({
  show: false,
  userId: null,
  name: '',
  roleLabel: '',
  gajiPokok: 0,
  makanTransport: 0,
  cuti: 0,
  liburTahunan: 0,
  tunjanganKesehatan: 0,
  tunjanganJabatan: 0,
  tunjanganHariRaya: 0
})

const deductionsModal = reactive({
  show: false,
  name: '',
  roleLabel: '',
  totalPotongan: 0,
  potonganTerlambatCount: 0,
  potonganAbsenCount: 0,
  potonganTidakHadirCount: 0,
  terlambatRate: 0,
  absenSetengahRate: 0,
  tidakHadirRate: 0,
  totalWorkingDays: 0,
  hadirLengkap: 0,
  cuti: 0,
  liburTahunan: 0,
  dailyMakanTransport: 0,
  potonganMakanTransport: 0
})

function openDeductionsModal(row) {
  deductionsModal.name = row.name
  deductionsModal.roleLabel = row.roleLabel
  deductionsModal.totalPotongan = row.potongan
  deductionsModal.potonganTerlambatCount = row.potonganTerlambatCount
  deductionsModal.potonganAbsenCount = row.potonganAbsenCount
  deductionsModal.potonganTidakHadirCount = row.potonganTidakHadirCount
  deductionsModal.terlambatRate = row.terlambatRate
  deductionsModal.absenSetengahRate = row.absenSetengahRate
  deductionsModal.tidakHadirRate = row.tidakHadirRate
  deductionsModal.totalWorkingDays = row.totalWorkingDays
  deductionsModal.hadirLengkap = row.hadirLengkap
  
  deductionsModal.cuti = row.cuti || 0
  deductionsModal.liburTahunan = row.liburTahunan || 0
  const daily = row.totalWorkingDays > 0 ? (row.baseMakanTransport / row.totalWorkingDays) : 0
  deductionsModal.dailyMakanTransport = Math.round(daily)
  deductionsModal.potonganMakanTransport = Math.round((deductionsModal.cuti + deductionsModal.liburTahunan) * daily)
  
  deductionsModal.show = true
}

function saveSettings() {
  localStorage.setItem('kcm_salary_settings', JSON.stringify(salarySettings))
  showSettings.value = false
  loadData()
}

function resetSettings() {
  const def = defaultSettings()
  for (const role of ['super_admin', 'admin', 'staff']) {
    Object.assign(salarySettings[role], def[role])
  }
  Object.assign(salarySettings._rates, def._rates)
}

function getConfig(roleKey) {
  return salarySettings[roleKey] || salarySettings.staff
}

function getRates() {
  return salarySettings._rates
}

function formatNumber(val) {
  if (!val && val !== 0) return '0'
  return parseFloat(val).toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

function roleLabel(role) {
  if (role === 'super_admin') return 'Super Admin'
  if (role === 'admin') return 'Admin'
  return 'Staff'
}

// Terbilang function - works up to triliun
function terbilang(num) {
  if (num === 0 || !num) return 'NOL RUPIAH'
  const satuan = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas']
  const ribuan = ['','Ribu','Juta','Miliar','Triliun']

  let result = ''
  let n = Math.abs(Math.round(num))
  let i = 0

  while (n > 0) {
    const bagian = n % 1000
    if (bagian > 0) {
      let str = ''
      const ratusan = Math.floor(bagian / 100)
      const puluhan = bagian % 100
      if (ratusan > 0) {
        str += (ratusan === 1 ? 'Seratus' : satuan[ratusan] + ' Ratus')
      }
      if (puluhan > 0) {
        if (str) str += ' '
        if (puluhan < 12) {
          str += satuan[puluhan]
        } else {
          const puluh = Math.floor(puluhan / 10)
          const sisa = puluhan % 10
          str += satuan[puluh] + ' Puluh'
          if (sisa > 0) str += ' ' + satuan[sisa]
        }
      }
      const suffix = ribuan[i]
      if (i === 1 && bagian < 100) {
        result = 'Se' + suffix + (result ? ' ' + result : '')
      } else {
        result = str + ' ' + suffix + (result ? ' ' + result : '')
      }
    }
    n = Math.floor(n / 1000)
    i++
  }

  return result.trim() + ' RUPIAH'
}

async function loadUsers() {
  try {
    const data = await api.get('/api/users')
    if (Array.isArray(data)) users.value = data
    else if (data && data.filter) users.value = data
    else users.value = []
    try {
      const me = await api.get('/api/auth/me')
      currentUser.value = me
    } catch (e) { /* ignore */ }
  } catch (e) { console.error(e) }
}



// Count working days (Mon-Sat) between two date strings
function countWorkingDays(start, end) {
  let count = 0
  const d = new Date(start)
  const endD = new Date(end)
  while (d <= endD) {
    const dow = d.getDay()
    if (dow >= 1 && dow <= 6) count++ // Mon-Sat
    d.setDate(d.getDate() + 1)
  }
  return count
}

async function loadData() {
  if (!selectedMonth.value) return
  loading.value = true
  tableRows.value = []

  const targetUsers = users.value.filter(u => ['admin', 'staff'].includes(u.role))
  const rates = getRates()
  const overrides = loadOverrides()

  const [yearStr, monthStr] = selectedMonth.value.split('-')
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)

  let calcYear = year
  let calcMonth = month - 1
  if (calcMonth === 0) {
    calcMonth = 12
    calcYear = year - 1
  }

  const startDate = `${calcYear}-${String(calcMonth).padStart(2, '0')}-01`
  const lastDay = new Date(calcYear, calcMonth, 0).getDate()
  const endDate = `${calcYear}-${String(calcMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const totalWorkingDays = countWorkingDays(startDate, endDate)

  for (const u of targetUsers) {
    try {
      const res = await api.get('/api/attendance/rekap', { user_id: u.id, start: startDate, end: endDate })
      const logs = res.records || res || [] // API returns { records: [...] }

      // Skip users if they have no attendance logs in the calculated period
      if (logs.length === 0) {
        continue
      }

      // Separate: normal attendance (check_in type or no type) vs izin/cuti/libur
      const normalLogs = logs.filter(l => !l.type || l.type === 'check_in')

      // Hari hadir lengkap: check_in + check_out
      const hadirLengkap = normalLogs.filter(l => l.check_in && l.check_out).length

      // Absen setengah: check_in tapi tidak check_out
      const absenSetengah = normalLogs.filter(l => l.check_in && !l.check_out).length

      // Hari dengan any record (including izin/cuti/libur — these are NOT counted as absent)
      const daysWithAnyRecord = new Set(logs.map(l => l.date)).size

      // Tidak hadir = totalWorkingDays - days with any attendance record
      // Hanya potong jika staf memiliki riwayat absen di bulan tersebut, mencegah penalty penuh bulan kosong
      const tidakHadir = logs.length > 0 ? Math.max(0, totalWorkingDays - daysWithAnyRecord) : 0

      // Terlambat: check_in after 08:15 (hour > 8 or hour === 8 && minute > 15)
      const terlambat = normalLogs.filter(l => {
        if (!l.check_in) return false
        const t = l.check_in.includes(' ') ? l.check_in.split(' ')[1] : l.check_in
        const parts = t.split(':')
        const h = parseInt(parts[0])
        const m = parseInt(parts[1])
        return h > 8 || (h === 8 && m > 15)
      }).length

      const config = getConfig(u.role)
      const ov = overrides[u.id] || {}
      const gajiPokok = ov.gajiPokok ?? config.gajiPokok ?? 0
      const baseMakanTransport = ov.makanTransport ?? config.makanTransport ?? 0
      
      const cuti = ov.cuti || 0
      const liburTahunan = ov.liburTahunan || 0

      // Calculate adjusted makan & transport:
      // Deduct daily rate for cuti & liburTahunan
      const dailyMakanTransport = totalWorkingDays > 0 ? (baseMakanTransport / totalWorkingDays) : 0
      const potonganMakanTransport = (cuti + liburTahunan) * dailyMakanTransport

      const tunjanganKesehatan = ov.tunjanganKesehatan ?? config.tunjanganKesehatan ?? 0
      const tunjanganJabatan = ov.tunjanganJabatan ?? config.tunjanganJabatan ?? 0
      const tunjanganHariRaya = ov.tunjanganHariRaya ?? config.tunjanganHariRaya ?? 0
      const tunjangan = tunjanganKesehatan + tunjanganJabatan + tunjanganHariRaya
      
      // Potongan
      const terlambatRate = rates.terlambat || 5000
      const tidakHadirRate = rates.tidakHadir || 80000
      const absenSetengahRate = rates.absenSetengah || 40000
      const potonganTerlambat = terlambat * terlambatRate
      const potonganTidakHadir = tidakHadir * tidakHadirRate
      const potonganAbsen = absenSetengah * absenSetengahRate
      const totalPotongan = potonganTerlambat + potonganTidakHadir + potonganAbsen + Math.round(potonganMakanTransport)
 
      // Total Diterima = Pokok + Makan (full base) + Tunjangan - Potongan (including Makan deduction)
      const totalDiterima = gajiPokok + baseMakanTransport + tunjangan - totalPotongan
 
      tableRows.value.push({
        userId: u.id,
        name: u.name,
        role: u.role,
        roleLabel: roleLabel(u.role),
        gajiPokok,
        baseMakanTransport,
        makanTransport: baseMakanTransport, // Show full base Makan & Transport
        tunjanganKesehatan,
        tunjanganJabatan,
        tunjanganHariRaya,
        tunjangan,
        // Attendance breakdown
        totalWorkingDays,
        hadirLengkap,
        potonganTerlambatCount: terlambat,
        potonganTidakHadirCount: tidakHadir,
        potonganAbsenCount: absenSetengah,
        potongan: totalPotongan,
        totalPotongan,
        // Overrides & calculations for slip
        cuti,
        liburTahunan,
        dailyMakanTransport: Math.round(dailyMakanTransport),
        potonganMakanTransport: Math.round(potonganMakanTransport),
        terlambatRate,
        tidakHadirRate,
        absenSetengahRate,
        totalDiterima
      })
    } catch (e) {
      console.error('Error loading data for', u.name, e)
    }
  }
  loading.value = false
}

// Open edit modal for a row
function openEditModal(row) {
  editModal.show = true
  editModal.userId = row.userId
  editModal.name = row.name
  editModal.roleLabel = row.roleLabel
  editModal.gajiPokok = row.gajiPokok
  editModal.makanTransport = row.baseMakanTransport
  editModal.cuti = row.cuti
  editModal.liburTahunan = row.liburTahunan
  editModal.tunjanganKesehatan = row.tunjanganKesehatan
  editModal.tunjanganJabatan = row.tunjanganJabatan
  editModal.tunjanganHariRaya = row.tunjanganHariRaya
}

function saveEditModal() {
  const overrides = loadOverrides()
  overrides[editModal.userId] = {
    gajiPokok: editModal.gajiPokok || 0,
    makanTransport: editModal.makanTransport || 0,
    cuti: editModal.cuti || 0,
    liburTahunan: editModal.liburTahunan || 0,
    tunjanganKesehatan: editModal.tunjanganKesehatan || 0,
    tunjanganJabatan: editModal.tunjanganJabatan || 0,
    tunjanganHariRaya: editModal.tunjanganHariRaya || 0
  }
  saveOverrides(overrides)
  editModal.show = false
  loadData()
}

// Build a single slip's HTML for print window
function buildSlipHTML(slip) {
  return `
    <div class="slip-page">
      <div class="text-center mb-4" style="border-bottom: 2px double #111; padding-bottom: 10px;">
        <h1 style="font-size: 16px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 4px;">cv. KURNIA CIPTA MANDIRI</h1>
        <p style="font-size: 9px; color: #666; margin-top: 2px;">Jl Kaliurang Km 12. Griya Penen Asri Blok D-12</p>
        <p style="font-size: 9px; color: #666;">Harjobinangun Pakem Sleman. Yogyakarta.</p>
        <p style="font-size: 9px; color: #666;">Telp. +62 85 100 80 5285. | Fax. | E-mail: kcm_production@ymail.com</p>
        <div style="margin-top: 10px; font-size: 13px; font-weight: 900; letter-spacing: 2px; display: inline-block; border-bottom: 1px solid #888; padding-bottom: 3px;">SLIP GAJI KARYAWAN</div>
        <div style="font-size: 11px; font-weight: 700; color: #c0392b; margin-top: 4px; text-transform: uppercase;">BULAN ${calcMonthLabel.value}</div>
      </div>
 
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 12px; font-size: 11px;">
        <div>NO URUT <b>: ${slip.no}</b></div>
        <div>TANGGAL <b>: ${slip.tanggal}</b></div>
        <div>NAMA <b>: ${slip.name.toUpperCase()}</b></div>
        <div>JABATAN <b>: ${slip.roleLabel.toUpperCase()}</b></div>
      </div>
 
      <div class="bg-section">PENDAPATAN</div>
      <table style="margin-bottom: 10px;">
        <tr><td style="width:60%">GAJI POKOK</td><td class="text-right font-bold" style="width:40%">: Rp ${formatNumber(slip.gajiPokok)}</td></tr>
        <tr><td>MAKAN & TRANSPORT</td><td class="text-right font-bold">: Rp ${formatNumber(slip.makanTransport)}</td></tr>
        <tr><td>TUNJANGAN KESEHATAN</td><td class="text-right font-bold">: Rp ${formatNumber(slip.tunjanganKesehatan)}</td></tr>
        <tr><td>TUNJANGAN JABATAN</td><td class="text-right font-bold">: Rp ${formatNumber(slip.tunjanganJabatan)}</td></tr>
        <tr><td>TUNJANGAN HARI RAYA</td><td class="text-right font-bold">: Rp ${formatNumber(slip.tunjanganHariRaya)}</td></tr>
        <tr>
          <td></td>
          <td class="text-right" style="padding-top:10px; font-size:11px;">
            <div style="display:inline-block; width:180px;">
              <div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
                <span>Pokok</span>
                <span>Rp ${formatNumber(slip.gajiPokok)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
                <span>makan dan trans</span>
                <span>Rp ${formatNumber(slip.makanTransport)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-top:1px solid #333; padding-top:2px; font-weight:bold;">
                <span></span>
                <span>Rp ${formatNumber(slip.pokokMakanTrans)}</span>
              </div>
            </div>
          </td>
        </tr>
      </table>
 
      <div class="bg-section">LEMBUR KERJA & POTONGAN</div>
      <table style="margin-bottom: 10px;">
        <tr><td style="width:45%">HARI</td><td class="text-right" style="color:#888; width:30%">${slip.lemburHariCount} X Rp ${formatNumber(slip.lemburHariRate)} =</td><td class="text-right font-bold" style="width:25%">${slip.lemburHari > 0 ? formatNumber(slip.lemburHari) : '-'}</td></tr>
        <tr><td>JAM</td><td class="text-right" style="color:#888">${slip.lemburJamCount} X Rp ${formatNumber(slip.lemburJamRate)} =</td><td class="text-right font-bold">${slip.lemburJam > 0 ? formatNumber(slip.lemburJam) : '-'}</td></tr>
        <tr><td>LIBUR</td><td class="text-right" style="color:#888">${slip.liburCount} X Rp ${formatNumber(slip.liburRate)} =</td><td class="text-right font-bold">${slip.libur > 0 ? formatNumber(slip.libur) : '-'}</td></tr>
        <tr><td>Absen 1x (1/2hari)</td><td class="text-right" style="color:#888">${slip.potonganAbsenCount} X Rp ${formatNumber(slip.absenSetengahRate)} =</td><td class="text-right font-bold">${slip.potonganAbsen > 0 ? formatNumber(slip.potonganAbsen) : '-'}</td></tr>
        <tr><td>Tidak Hadir (1hari)</td><td class="text-right" style="color:#888">${slip.potonganTidakHadirCount} X Rp ${formatNumber(slip.tidakHadirRate)} =</td><td class="text-right font-bold">${slip.potonganTidakHadir > 0 ? formatNumber(slip.potonganTidakHadir) : '-'}</td></tr>
        <tr><td>Terlambat Hadir (10menit)</td><td class="text-right" style="color:#888">${slip.potonganTerlambatCount} X Rp ${formatNumber(slip.terlambatRate)} =</td><td class="text-right font-bold">${slip.potonganTerlambat > 0 ? formatNumber(slip.potonganTerlambat) : '-'}</td></tr>
        <tr class="border-t"><td colspan="2" class="font-bold" style="padding-top:4px;">POTONGAN TERLAMBAT TIDAK HADIR DAN UANG MAKAN :</td><td class="text-right font-bold text-red" style="padding-top:4px;">Rp ${formatNumber(slip.totalPotongan)}</td></tr>
      </table>
 
      <div class="bg-section">POTONGAN KAS BON</div>
      <table style="margin-bottom: 15px;">
        <tr><td style="width:60%">JUMLAH PINJAMAN</td><td class="text-right" style="width:40%">: Rp ${slip.jumlahPinjaman > 0 ? formatNumber(slip.jumlahPinjaman) : '-'}</td></tr>
        <tr><td>PEMOTONGAN CICILAN S/D KE-</td><td class="text-right">: Rp ${slip.pemotonganCicilanKe > 0 ? slip.pemotonganCicilanKe : '-'}</td></tr>
        <tr><td>JUMLAH POTONGAN CICILAN KE-</td><td class="text-right">: Rp ${slip.jumlahPotonganCicilan > 0 ? formatNumber(slip.jumlahPotonganCicilan) : '-'}</td></tr>
        <tr><td>LEMBUR KERJA</td><td class="text-right">: Rp ${slip.totalLembur > 0 ? formatNumber(slip.totalLembur) : '-'}</td></tr>
        <tr class="border-t"><td class="font-bold" style="padding-top:4px;">SISA PINJAMAN KAS BON</td><td class="text-right font-bold" style="padding-top:4px;">: Rp ${slip.sisaPinjaman > 0 ? formatNumber(slip.sisaPinjaman) : '-'}</td></tr>
      </table>
 
      <div class="flex-between border-double-top mt-4 pt-3">
        <span style="font-size:13px; font-weight:900;">TOTAL DITERIMA</span>
        <span style="font-size:16px; font-weight:900; color:#c0392b;">Rp ${formatNumber(slip.totalDiterima)}</span>
      </div>
 
      <p class="mt-2 italic" style="font-size:10px; color:#666;">
        <b>TERBILANG DENGAN KATA :</b> ${slip.terbilang}
      </p>
 
      <div class="flex-sig mt-4" style="font-size:11px; color:#666;">
        <div class="sig-block" style="float: left; width: 45%; text-align: center;">
          <p class="font-bold spacer" style="margin-bottom: 50px;">DISETUJUI OLEH</p>
          <p class="font-bold">ANRIKO KURNIAWAN</p>
          <p style="font-size:9px;">DIREKTUR</p>
        </div>
        <div class="sig-block" style="float: right; width: 45%; text-align: center;">
          <p class="font-bold spacer" style="margin-bottom: 50px;">DITERIMA OLEH</p>
          <p class="font-bold">${slip.name.toUpperCase()}</p>
          <p style="font-size:9px;">${slip.roleLabel.toUpperCase()}</p>
        </div>
        <div style="clear: both;"></div>
      </div>
    </div>`
}
 
// Build full slip data from a table row
function buildSlipData(row, slipNo) {
  const rates = getRates()
  const pokokMakanTrans = row.gajiPokok + row.baseMakanTransport
  const lemburHariCount = 0
  const lemburJamCount = 0
  const lemburHariRate = rates.lemburHari || 0
  const lemburJamRate = rates.lemburJam || 0
  const lemburHari = lemburHariCount * lemburHariRate
  const lemburJam = lemburJamCount * lemburJamRate
  const totalLembur = lemburHari + lemburJam
 
  const liburCount = row.cuti + row.liburTahunan
  const liburRate = row.dailyMakanTransport
  const libur = row.potonganMakanTransport
 
  const potonganAbsen = row.potonganAbsenCount * row.absenSetengahRate
  const potonganTidakHadir = row.potonganTidakHadirCount * row.tidakHadirRate
  const potonganTerlambat = row.potonganTerlambatCount * row.terlambatRate
  const totalPotongan = potonganAbsen + potonganTidakHadir + potonganTerlambat + libur
 
  const jumlahPinjaman = 0
  const pemotonganCicilanKe = 0
  const jumlahPotonganCicilan = 0
  const sisaPinjaman = jumlahPinjaman - jumlahPotonganCicilan
  const totalDiterima = (row.gajiPokok + row.baseMakanTransport + row.tunjangan) - totalPotongan + totalLembur
 
  // Generate date from calculated period
  const [y, m] = selectedMonth.value.split('-')
  const dateObj = new Date(parseInt(y), parseInt(m) - 1, 5) // set standard slip date to 5th of current month
  const slipDateStr = `${String(dateObj.getDate()).padStart(2,'0')}-${monthNamesShort[dateObj.getMonth()]}-${String(dateObj.getFullYear()).substring(2)}`

  return {
    no: slipNo,
    name: row.name,
    roleLabel: row.roleLabel,
    tanggal: slipDateStr,
    gajiPokok: row.gajiPokok,
    makanTransport: row.baseMakanTransport,
    tunjanganKesehatan: row.tunjanganKesehatan,
    tunjanganJabatan: row.tunjanganJabatan,
    tunjanganHariRaya: row.tunjanganHariRaya,
    pokokMakanTrans,
    lemburHariCount, lemburHariRate, lemburHari,
    lemburJamCount, lemburJamRate, lemburJam,
    liburCount, liburRate, libur,
    totalLembur,
    potonganAbsenCount: row.potonganAbsenCount, absenSetengahRate: row.absenSetengahRate, potonganAbsen,
    potonganTidakHadirCount: row.potonganTidakHadirCount, tidakHadirRate: row.tidakHadirRate, potonganTidakHadir,
    potonganTerlambatCount: row.potonganTerlambatCount, terlambatRate: row.terlambatRate, potonganTerlambat,
    totalPotongan,
    jumlahPinjaman, pemotonganCicilanKe, jumlahPotonganCicilan, sisaPinjaman,
    totalDiterima,
    terbilang: terbilang(totalDiterima)
  }
}

function printWindowStyles() {
  return `
    @page { size: A4; margin: 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #222; font-size: 11px; line-height: 1.4; }
    .slip-page { page-break-after: always; padding: 10px 0; }
    .slip-page:last-child { page-break-after: avoid; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 2px 4px; font-size: 11px; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .border-t { border-top: 1px solid #ccc; }
    .border-double-top { border-top: 2px double #111; }
    .bg-section { background: #f5f5f5; padding: 3px 8px; font-weight: 900; font-size: 10px; text-transform: uppercase; margin: 8px 0 4px 0; border-radius: 3px; }
    .text-red { color: #c0392b; }
    .italic { font-style: italic; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .pt-3 { padding-top: 12px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .flex-sig { display: flex; justify-content: space-between; }
    .sig-block { text-align: center; }
    .sig-line { border-top: 1px solid #888; width: 130px; margin: 0 auto; }
    .spacer { margin-top: 40px; }
    .print-btn { position: fixed; top: 16px; right: 16px; z-index: 9999; padding: 10px 24px; background: #991b1b; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    .print-btn:hover { background: #7f1d1d; }
    @media print { .print-btn { display: none !important; } }
  `
}

// Open slip in new window with Print button (no auto-print)
function cetakSlip(row) {
  const slipNo = tableRows.value.indexOf(row) + 1
  const slipData = buildSlipData(row, slipNo)
  const slipHTML = buildSlipHTML(slipData)

  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>Slip Gaji - ${row.name} - ${calcMonthLabel.value}</title>
    <style>${printWindowStyles()}</style></head><body>
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
    ${slipHTML}
    </body></html>
  `)
  win.document.close()
}

// Download single slip as PDF using html2pdf.js
function downloadSlipPDF(row) {
  if (typeof html2pdf === 'undefined') {
    alert('Library PDF belum dimuat. Silakan coba sesaat lagi.')
    return
  }

  const slipNo = tableRows.value.indexOf(row) + 1
  const slipData = buildSlipData(row, slipNo)
  const slipHTML = buildSlipHTML(slipData)

  const element = document.createElement('div')
  element.innerHTML = `
    <style>
      ${printWindowStyles()}
      .slip-page { padding: 15px; box-sizing: border-box; }
    </style>
    ${slipHTML}
  `
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Slip_Gaji_${row.name.replace(/\s+/g, '_')}_${calcMonthLabel.value.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().from(element).set(opt).save()
}

// Cetak Semua - opens all slips in one window
function cetakSemua() {
  if (tableRows.value.length === 0) return
  let allSlipsHTML = ''
  tableRows.value.forEach((row, idx) => {
    const slipData = buildSlipData(row, idx + 1)
    allSlipsHTML += buildSlipHTML(slipData)
  })

  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>Slip Gaji - ${calcMonthLabel.value}</title>
    <style>${printWindowStyles()}</style></head><body>
    <button class="print-btn" onclick="window.print()">🖨️ Print Semua</button>
    ${allSlipsHTML}
    </body></html>
  `)
  win.document.close()
}

// Download all slips as a combined PDF using html2pdf.js
function downloadSemuaPDF() {
  if (tableRows.value.length === 0) return
  if (typeof html2pdf === 'undefined') {
    alert('Library PDF belum dimuat. Silakan coba sesaat lagi.')
    return
  }

  let allSlipsHTML = ''
  tableRows.value.forEach((row, idx) => {
    const slipData = buildSlipData(row, idx + 1)
    allSlipsHTML += buildSlipHTML(slipData)
  })

  const element = document.createElement('div')
  element.innerHTML = `
    <style>
      ${printWindowStyles()}
      .slip-page { padding: 15px; box-sizing: border-box; page-break-after: always; }
      .slip-page:last-child { page-break-after: avoid; }
    </style>
    ${allSlipsHTML}
  `
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Slip_Gaji_Semua_Karyawan_${calcMonthLabel.value.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().from(element).set(opt).save()
}

onMounted(async () => { await loadUsers(); loadData() })
</script>

<style scoped>
@media print {
  .slip-page {
    page-break-after: always;
    break-after: page;
  }
  .slip-page:last-child {
    page-break-after: avoid;
    break-after: auto;
  }
}
</style>
