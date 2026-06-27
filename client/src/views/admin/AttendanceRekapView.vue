<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col min-h-screen">
      <!-- Topbar Navigation -->
      <AppTopbar title="Rekap Absensi Karyawan" />

      <!-- Content Body -->
      <div class="p-8 flex-grow space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        
        <!-- Header & Filters -->
        <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 space-y-4">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">Rekap Absensi</h2>
              <p class="text-xxs text-gray-400">Pantau kehadiran harian, keterlambatan, dan riwayat presensi GPS karyawan.</p>
            </div>
            
            <div class="flex gap-3 w-full md:w-auto">
              <button 
                @click="exportToCsv" 
                class="border border-red-800 hover:bg-red-50 dark:border-red-500 dark:hover:bg-red-955/20 text-red-800 dark:text-red-500 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                Export Excel/CSV
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="text-[10px] font-bold text-gray-400 block mb-1">Periode Absensi</label>
              <DateRangePicker 
                v-model:startDate="filter.start" 
                v-model:endDate="filter.end" 
                @change="loadRekap"
                align="left"
              />
            </div>
            <div v-if="user?.role === 'super_admin' || user?.role === 'admin'">
              <label class="text-[10px] font-bold text-gray-400 block mb-1">Karyawan</label>
              <select v-model="filter.user_id" @change="loadRekap" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs px-3 py-2 focus:border-red-500 focus:ring-0">
                <option value="">-- Semua Karyawan --</option>
                <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button @click="resetFilters" class="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 font-bold py-2.5 rounded-xl text-xs transition-colors min-h-[44px]">
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hadir</p>
              <h3 class="text-2xl font-black mt-2 text-emerald-600">{{ summary.hadir }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">check_circle</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Terlambat (> 08.00)</p>
              <h3 class="text-2xl font-black mt-2 text-amber-600">{{ summary.terlambat }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-955/20 text-amber-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">schedule</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tidak Hadir</p>
              <h3 class="text-2xl font-black mt-2 text-red-700">{{ summary.tidak_hadir }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-750 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">cancel</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Izin / Cuti / Libur</p>
              <h3 class="text-2xl font-black mt-2 text-blue-600">{{ summary.izinCuti }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">event_available</span>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex space-x-2 border-b border-gray-200 dark:border-gray-800 pb-px">
          <button 
            @click="activeTab = 'calendar'"
            :class="[
              activeTab === 'calendar' 
                ? 'border-red-800 text-red-800 dark:text-red-500 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
              'px-6 py-3 border-b-2 text-xs font-semibold transition-all duration-200 focus:outline-none'
            ]"
          >
            <div class="flex items-center space-x-2">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
              <span>Kalender Kehadiran</span>
            </div>
          </button>
          <button 
            @click="activeTab = 'table'"
            :class="[
              activeTab === 'table' 
                ? 'border-red-800 text-red-800 dark:text-red-500 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
              'px-6 py-3 border-b-2 text-xs font-semibold transition-all duration-200 focus:outline-none'
            ]"
          >
            <div class="flex items-center space-x-2">
              <span class="material-symbols-outlined text-lg">list_alt</span>
              <span>Tabel Detail</span>
            </div>
          </button>
        </div>

        <!-- TAB 1: CALENDAR VIEW -->
        <div v-if="activeTab === 'calendar'" class="space-y-6">
          <div class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800">
            <!-- Calendar Navigation Header -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-sm font-bold text-gray-800 dark:text-white capitalize">
                {{ currentMonthName }} {{ currentYear }}
              </h3>
              <div class="flex items-center space-x-2">
                <button @click="navigateMonth(-1)" class="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500">
                  <span class="material-symbols-outlined text-sm align-middle">chevron_left</span>
                </button>
                <button @click="navigateMonth(1)" class="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500">
                  <span class="material-symbols-outlined text-sm align-middle">chevron_right</span>
                </button>
              </div>
            </div>

            <!-- Calendar Month Grid -->
            <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <div v-for="dayName in ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']" :key="dayName" class="py-2">
                {{ dayName }}
              </div>
            </div>

            <div class="grid grid-cols-7 gap-2">
              <!-- Empty placeholders before the month start -->
              <div v-for="n in calendarEmptyPrefix" :key="'empty-'+n" class="aspect-square bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border border-dashed border-gray-150 dark:border-gray-800"></div>

              <!-- Days of the month -->
              <div 
                v-for="day in calendarDays" 
                :key="'day-'+day.dateString"
                @click="selectDay(day.dateString)"
                :class="[
                  selectedDateDetail === day.dateString ? 'ring-2 ring-red-800 bg-red-50/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40',
                  'aspect-square bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl p-2 cursor-pointer flex flex-col justify-between transition-all duration-200'
                ]"
              >
                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ day.dayNum }}</span>
                
                <!-- Indicators -->
                <div class="flex flex-wrap gap-1 items-center justify-start mt-2">
                  <div 
                    v-for="log in day.logs" 
                    :key="log.id" 
                    :title="log.employee_name + ': ' + typeLabel(log.type || 'check_in')"
                    :class="[
                      log.type === 'izin' ? 'bg-blue-500' 
                        : log.type === 'cuti' ? 'bg-purple-500' 
                        : log.type === 'libur_tahunan' ? 'bg-orange-500'
                        : log.check_in 
                          ? (isLate(log.check_in) ? 'bg-amber-500' : 'bg-emerald-500') 
                          : 'bg-red-500',
                      'w-2 h-2 rounded-full'
                    ]"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar Side Detail Panel -->
          <div v-if="selectedDateDetail" class="bg-white dark:bg-gray-850 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 space-y-4">
            <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                Detail Kehadiran Tanggal: {{ formatDateString(selectedDateDetail) }}
              </h4>
              <button @click="selectedDateDetail = ''" class="text-gray-400 hover:text-gray-600">
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <div v-if="selectedDayLogs.length === 0" class="py-6 text-center text-xs text-gray-400">
                Tidak ada data absensi untuk hari ini.
              </div>
              <div v-else v-for="log in selectedDayLogs" :key="log.id" class="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-full bg-red-900/10 text-red-800 font-bold flex items-center justify-center text-sm uppercase">
                    {{ log.employee_name.charAt(0) }}
                  </div>
                  <div>
                    <h5 class="text-xs font-bold text-gray-900 dark:text-white">{{ log.employee_name }}</h5>
                    <p class="text-[9px] text-gray-400 uppercase mt-0.5">{{ log.department || 'Staff' }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-6 text-center sm:text-right">
                  <div>
                    <span class="text-[9px] font-bold text-gray-400 uppercase block">Check-In</span>
                    <span class="text-xs font-bold" :class="isLate(log.check_in) ? 'text-amber-600' : 'text-emerald-700'">
                      {{ log.check_in ? formatTime(log.check_in) : '--:--' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-[9px] font-bold text-gray-400 uppercase block">Check-Out</span>
                    <span class="text-xs font-bold text-red-750">
                      {{ log.check_out ? formatTime(log.check_out) : '--:--' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-[9px] font-bold text-gray-400 uppercase block">Status</span>
                    <span :class="[
                      log.status === 'di_kantor' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-amber-700 bg-amber-50 dark:bg-amber-955/20',
                      'px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase mt-0.5 inline-block'
                    ]">
                      {{ log.status === 'di_kantor' ? 'Kantor' : 'Remote' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: TABLE VIEW -->
        <div v-if="activeTab === 'table'" class="space-y-6">
          <div class="bg-white dark:bg-gray-850 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800 overflow-hidden">
            <!-- Search & Filters inside table -->
            <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center">
              <div class="relative w-full sm:w-64">
                <input 
                  v-model="tableSearchQuery" 
                  class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-red-500" 
                  placeholder="Cari nama karyawan..." 
                  type="text"
                />
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">search</span>
              </div>
              
              <!-- Filter Karyawan -->
              <div class="w-full sm:w-48">
                <select 
                  v-model="tableKaryawanFilter" 
                  class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-red-500 text-gray-700 dark:text-gray-300"
                >
                  <option value="">Semua Karyawan</option>
                  <option v-for="emp in employeesInLogs" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
                </select>
              </div>

              <!-- Filter Departemen -->
              <div class="w-full sm:w-48">
                <select 
                  v-model="tableDeptFilter" 
                  class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-red-500 text-gray-700 dark:text-gray-300"
                >
                  <option value="">Semua Departemen</option>
                  <option v-for="dept in departmentsList" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 text-xxs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                    <th class="py-4 px-6">Tanggal</th>
                    <th class="py-4 px-6">Karyawan</th>
                    <th class="py-4 px-6 hidden md:table-cell">Departemen</th>
                    <th class="py-4 px-6 text-center font-semibold">Check-In</th>
                    <th class="py-4 px-6 text-center font-semibold">Check-Out</th>
                    <th class="py-4 px-6 text-center hidden lg:table-cell">Durasi</th>
                    <th class="py-4 px-6 text-center hidden lg:table-cell">Jarak</th>
                    <th class="py-4 px-6 text-center hidden sm:table-cell">Status</th>
                    <th class="py-4 px-6 text-center hidden sm:table-cell">Tipe</th>
                    <th class="py-4 px-6 text-center" v-if="user?.role === 'super_admin'">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <tr v-if="paginatedTableLogs.length === 0">
                    <td colspan="10" class="py-12 text-center text-gray-400">Tidak ada rekap absensi ditemukan.</td>
                  </tr>
                  <tr v-else v-for="log in paginatedTableLogs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer" @click="showDetailModal(log)">
                    <td class="py-4 px-6 font-medium text-gray-400">{{ formatDate(log.date) }}</td>
                    <td class="py-4 px-6 font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-full bg-red-900/10 text-red-800 font-bold flex items-center justify-center text-xs uppercase">
                        {{ log.employee_name.charAt(0) }}
                      </div>
                      <span>{{ log.employee_name }}</span>
                    </td>
                    <td class="py-4 px-6 text-gray-500 dark:text-gray-400 hidden md:table-cell">{{ log.department || 'Staff' }}</td>
                    <td class="py-4 px-6 text-center text-emerald-600 font-semibold font-mono">{{ log.check_in ? formatTime(log.check_in) : '--:--' }}</td>
                    <td class="py-4 px-6 text-center text-red-750 font-semibold font-mono">{{ log.check_out ? formatTime(log.check_out) : '--:--' }}</td>
                    <td class="py-4 px-6 text-center font-mono font-medium hidden lg:table-cell">{{ log.duration || '--:--:--' }}</td>
                    <td class="py-4 px-6 text-center font-mono font-medium hidden lg:table-cell">
                      <span v-if="log.distance !== null">{{ log.distance }} meter</span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="py-4 px-6 text-center hidden sm:table-cell">
                      <span :class="[
                        log.status === 'di_kantor' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-amber-700 bg-amber-50 dark:bg-amber-955/20',
                        'px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase'
                      ]">
                        {{ log.status === 'di_kantor' ? 'Di Kantor' : 'Remote' }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-center hidden sm:table-cell">
                      <span :class="typeBadgeClass(log.type)" class="px-2 py-1 text-[10px] font-bold rounded-lg uppercase">
                        {{ typeLabel(log.type) }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-center space-x-2" v-if="user?.role === 'super_admin'" @click.stop>
                      <select @change="setType(log, $event.target.value); $event.target.value = ''" class="text-[10px] font-bold border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 dark:bg-gray-900 dark:text-white focus:ring-0 focus:border-red-500">
                        <option value="">Set Tipe...</option>
                        <option value="check_in">Check In</option>
                        <option value="izin">Izin</option>
                        <option value="cuti">Cuti</option>
                        <option value="libur_tahunan">Libur Tahunan</option>
                      </select>
                      <button @click="openEditModal(log)" class="text-amber-600 hover:text-amber-800">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button @click="deleteLog(log.id)" class="text-red-600 hover:text-red-800">
                        <span class="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Pagination -->
            <div class="px-6 py-4 border-t border-gray-150 dark:border-gray-800 flex justify-between items-center text-xxs font-bold text-gray-400 uppercase" v-if="tableTotalPages > 1">
              <span>Halaman {{ tableCurrentPage }} dari {{ tableTotalPages }}</span>
              <div class="flex items-center space-x-2">
                <button 
                  @click="tableCurrentPage = Math.max(1, tableCurrentPage - 1)"
                  :disabled="tableCurrentPage === 1"
                  class="p-2 border border-gray-250 dark:border-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button 
                  @click="tableCurrentPage = Math.min(tableTotalPages, tableCurrentPage + 1)"
                  :disabled="tableCurrentPage === tableTotalPages"
                  class="p-2 border border-gray-250 dark:border-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Detail Modal -->
    <BaseModal :show="showModal" :title="'Profil Kehadiran: ' + selectedEmployee?.name" @close="closeDetailModal">
      <div class="p-6 space-y-6" v-if="selectedEmployee">
        <!-- Top Profile summary -->
        <div class="flex items-center space-x-4">
          <div class="w-14 h-14 rounded-full bg-red-900/10 text-red-800 font-bold flex items-center justify-center text-2xl uppercase">
            {{ selectedEmployee.name.charAt(0) }}
          </div>
          <div>
            <h4 class="font-bold text-base text-gray-900 dark:text-white">{{ selectedEmployee.name }}</h4>
            <p class="text-xs text-gray-500 uppercase mt-0.5">{{ selectedEmployee.department || 'Staff Karyawan' }}</p>
          </div>
        </div>

        <!-- Monthly numbers -->
        <div class="grid grid-cols-3 gap-4 border-y border-gray-100 dark:border-gray-850 py-4 text-center">
          <div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Hadir</span>
            <span class="text-lg font-black text-emerald-600 mt-1 block">{{ employeeStats.hadir }}</span>
          </div>
          <div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Terlambat</span>
            <span class="text-lg font-black text-amber-600 mt-1 block">{{ employeeStats.terlambat }}</span>
          </div>
          <div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Hari</span>
            <span class="text-lg font-black text-gray-950 dark:text-white mt-1 block">{{ employeeStats.total }}</span>
          </div>
        </div>

        <!-- Log entries listing -->
        <div class="space-y-3">
          <h5 class="text-xxs font-bold text-gray-400 uppercase tracking-wider">Histori Presensi Karyawan</h5>
          <div class="flow-root overflow-y-auto max-h-48 pr-1 space-y-2">
            <div 
              v-for="log in employeeLogs" 
              :key="log.id"
              class="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 flex justify-between items-center"
            >
              <div>
                <div class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ formatDate(log.date) }}</div>
                <div class="text-[9px] text-gray-400 mt-0.5 font-mono">
                  In: {{ log.check_in ? formatTime(log.check_in) : '--:--' }} | Out: {{ log.check_out ? formatTime(log.check_out) : '--:--' }}
                </div>
              </div>
              
              <span :class="[
                log.status === 'di_kantor' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' : 'text-amber-700 bg-amber-50 dark:bg-amber-955/20',
                'px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase'
              ]">
                {{ log.status === 'di_kantor' ? 'Kantor' : 'Remote' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Super Admin Edit Modal -->
    <BaseModal :show="showEditModal" title="Edit Log Presensi Karyawan" @close="closeEditModal">
      <form @submit.prevent="submitEditForm" class="p-6 space-y-4" v-if="editForm">
        <div>
          <label class="text-[10px] font-bold text-gray-400 block mb-1">Nama Karyawan</label>
          <input :value="editForm.employee_name" type="text" disabled class="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-850 text-xs p-2.5 opacity-60 cursor-not-allowed"/>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Check-In</label>
            <input v-model="editForm.check_in" type="text" placeholder="YYYY-MM-DD HH:MM:SS" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs p-2.5 focus:border-red-500 focus:ring-0"/>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Check-Out</label>
            <input v-model="editForm.check_out" type="text" placeholder="YYYY-MM-DD HH:MM:SS" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs p-2.5 focus:border-red-500 focus:ring-0"/>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Status Kehadiran</label>
            <select v-model="editForm.status" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs p-2.5 focus:border-red-500 focus:ring-0">
              <option value="di_kantor">Di Kantor</option>
              <option value="luar_kantor">Remote / Luar Kantor</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">Jarak (Meter)</label>
            <input v-model.number="editForm.distance" type="number" step="any" class="w-full rounded-xl border-gray-250 dark:border-gray-700 dark:bg-gray-900 text-xs p-2.5 focus:border-red-500 focus:ring-0"/>
          </div>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end space-x-3 mt-6">
          <button type="button" @click="closeEditModal" class="px-5 py-2.5 rounded-xl border border-gray-250 text-gray-500 font-semibold text-xs hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="bg-red-800 hover:bg-red-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Simpan Perubahan
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
import DateRangePicker from '../../components/ui/DateRangePicker.vue'
import { useAuth } from '../../composables/useAuth'
import { useApi } from '../../composables/useApi'
import { formatDate, formatTime } from '../../utils/helpers'
import * as XLSX from 'xlsx'

const { user } = useAuth()
const api = useApi()

const activeTab = ref('calendar')

// Date filters defaulting to last 30 days
const todayStr = new Date().toISOString().split('T')[0]
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const filter = ref({
  start: thirtyDaysAgo,
  end: todayStr,
  user_id: ''
})

const employeesList = ref([])
const rekapLogs = ref([])

// Calendar Navigation
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth()) // 0-indexed

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]
const currentMonthName = computed(() => monthNames[currentMonth.value])

// Selected item states
const selectedDateDetail = ref(todayStr)
const showModal = ref(false)
const selectedEmployee = ref(null)

// Super Admin editing states
const showEditModal = ref(false)
const editForm = ref(null)

// Table pagination
const tableSearchQuery = ref('')
const tableCurrentPage = ref(1)
const tablePageSize = 10

onMounted(async () => {
  await fetchEmployees()
  await loadRekap()
})

async function fetchEmployees() {
  try {
    const list = await api.get('/api/users')
    employeesList.value = list.filter(u => u.role === 'staff')
  } catch (err) {
    console.error('Failed to load employee list:', err)
  }
}

async function loadRekap() {
  try {
    const params = { ...filter.value }
    const logs = await api.get('/api/attendance/rekap', params)
    // Server may return { records: [...] } or flat array
    rekapLogs.value = Array.isArray(logs) ? logs : (logs.records || [])
  } catch (err) {
    console.error('Failed to load attendance logs:', err)
  }
}

function resetFilters() {
  filter.value = {
    start: thirtyDaysAgo,
    end: todayStr,
    user_id: ''
  }
  loadRekap()
}

// Summary Numbers
const summary = computed(() => {
  const present = rekapLogs.value.filter(l => l.check_in !== null)
  const late = present.filter(l => isLate(l.check_in))
  const absent = rekapLogs.value.filter(l => l.check_in === null && (!l.type || l.type === 'check_in'))
  const izinCuti = rekapLogs.value.filter(l => l.type && l.type !== 'check_in').length
  return {
    hadir: present.length,
    terlambat: late.length,
    tidak_hadir: absent.length,
    izinCuti
  }
})

// Late Helper Check (In after 08:00)
function isLate(checkInStr) {
  if (!checkInStr) return false
  try {
    const timePart = checkInStr.includes('T') 
      ? checkInStr.split('T')[1] 
      : (checkInStr.includes(' ') ? checkInStr.split(' ')[1] : checkInStr)
    const parts = timePart.split(':')
    const hour = parseInt(parts[0], 10)
    const minute = parseInt(parts[1], 10)
    return hour > 8 || (hour === 8 && minute > 0)
  } catch (e) {
    return false
  }
}

// Export XLS Function
function exportToCsv() {
  if (rekapLogs.value.length === 0) return alert('Tidak ada data untuk diekspor.')
  
  const rows = rekapLogs.value.map(row => ({
    'Tanggal': formatDate(row.date),
    'Karyawan': row.employee_name,
    'Departemen': row.department || 'Staff',
    'Jam Masuk': row.check_in ? formatTime(row.check_in) : '--:--',
    'Jam Keluar': row.check_out ? formatTime(row.check_out) : '--:--',
    'Durasi': row.duration || '-',
    'Jarak (m)': row.distance !== null ? row.distance : '-',
    'Status': row.status === 'di_kantor' ? 'Di Kantor' : 'Remote',
    'Tipe': typeLabel(row.type || 'check_in')
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi')
  XLSX.writeFile(wb, `rekap-presensi-kcm-${filter.value.start}-s-d-${filter.value.end}.xlsx`)
}

// Calendar Calculation
const calendarDays = computed(() => {
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const days = []
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
    const dayLogs = rekapLogs.value.filter(l => {
      const logDate = l.date ? new Date(l.date).toISOString().split('T')[0] : ''
      return logDate === dateStr
    })
    
    days.push({
      dayNum: i,
      dateString: dateStr,
      logs: dayLogs
    })
  }
  return days
})

const calendarEmptyPrefix = computed(() => {
  // First day of month day-of-week (0=Sunday, 1=Monday... 6=Saturday)
  // We want Sen=0, Sel=1, ... Min=6
  let firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  // Adjust so Monday is 0, Sunday is 6
  firstDay = firstDay === 0 ? 6 : firstDay - 1
  return firstDay
})

function navigateMonth(direction) {
  currentMonth.value += direction
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value += 1
  }
}

// Selected Day Detail List
const selectedDayLogs = computed(() => {
  if (!selectedDateDetail.value) return []
  return rekapLogs.value.filter(l => {
    const logDate = l.date ? new Date(l.date).toISOString().split('T')[0] : ''
    return logDate === selectedDateDetail.value
  })
})

function selectDay(dateString) {
  selectedDateDetail.value = dateString
}

function formatDateString(str) {
  try {
    return formatDate(str)
  } catch (e) {
    return str
  }
}

// Dynamic Table filters
const tableKaryawanFilter = ref('')
const tableDeptFilter = ref('')

const departmentsList = computed(() => {
  const depts = new Set()
  rekapLogs.value.forEach(l => {
    if (l.department) depts.add(l.department)
  })
  return Array.from(depts)
})

const employeesInLogs = computed(() => {
  const emps = new Map()
  rekapLogs.value.forEach(l => {
    if (l.user_id) emps.set(l.user_id, l.employee_name)
  })
  return Array.from(emps.entries()).map(([id, name]) => ({ id, name }))
})

// Table search and filters
const filteredTableLogs = computed(() => {
  const q = tableSearchQuery.value.toLowerCase().trim()
  return rekapLogs.value.filter(l => {
    const matchSearch = l.employee_name.toLowerCase().includes(q)
    const matchKaryawan = tableKaryawanFilter.value === '' || l.user_id === parseInt(tableKaryawanFilter.value)
    const matchDept = tableDeptFilter.value === '' || l.department === tableDeptFilter.value
    return matchSearch && matchKaryawan && matchDept
  })
})

const tableTotalPages = computed(() => {
  return Math.ceil(filteredTableLogs.value.length / tablePageSize)
})

const paginatedTableLogs = computed(() => {
  const start = (tableCurrentPage.value - 1) * tablePageSize
  const end = start + tablePageSize
  return filteredTableLogs.value.slice(start, end)
})

// Modal for user monthly detail summary
const employeeLogs = ref([])
const employeeStats = ref({ hadir: 0, terlambat: 0, total: 0 })

async function showDetailModal(log) {
  selectedEmployee.value = {
    id: log.user_id,
    name: log.employee_name,
    department: log.department
  }
  
  // Load logs of this user
  const list = rekapLogs.value.filter(l => l.user_id === log.user_id)
  employeeLogs.value = list
  
  const present = list.filter(l => l.check_in !== null)
  const late = present.filter(l => isLate(l.check_in))
  employeeStats.value = {
    hadir: present.length,
    terlambat: late.length,
    total: list.length
  }
  
  showModal.value = true
}

function closeDetailModal() {
  showModal.value = false
  selectedEmployee.value = null
}

// Super Admin editing functions
function openEditModal(log) {
  editForm.value = {
    id: log.id,
    employee_name: log.employee_name,
    check_in: log.check_in ? new Date(log.check_in).toISOString().replace('T', ' ').substring(0, 19) : '',
    check_out: log.check_out ? new Date(log.check_out).toISOString().replace('T', ' ').substring(0, 19) : '',
    status: log.status,
    distance: log.distance
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editForm.value = null
}

async function submitEditForm() {
  try {
    await api.put(`/api/attendance/${editForm.value.id}`, {
      check_in: editForm.value.check_in || null,
      check_out: editForm.value.check_out || null,
      status: editForm.value.status,
      distance: editForm.value.distance
    })
    closeEditModal()
    await loadRekap()
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal menyimpan perubahan presensi.')
  }
}

async function deleteLog(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus data presensi ini?')) return
  try {
    await api.delete(`/api/attendance/${id}`)
    await loadRekap()
  } catch (err) {
    alert('Gagal menghapus log presensi.')
  }
}

function typeLabel(type) {
  const labels = { check_in: 'Hadir', izin: 'Izin', cuti: 'Cuti', libur_tahunan: 'Libur' }
  return labels[type] || 'Hadir'
}

function typeBadgeClass(type) {
  const classes = {
    check_in: 'text-gray-400 bg-gray-50 dark:bg-gray-800',
    izin: 'text-blue-700 bg-blue-50 dark:bg-blue-950/20',
    cuti: 'text-purple-700 bg-purple-50 dark:bg-purple-950/20',
    libur_tahunan: 'text-orange-700 bg-orange-50 dark:bg-orange-950/20'
  }
  return classes[type] || classes.check_in
}

async function setType(log, type) {
  if (!type) return
  try {
    await api.post('/api/attendance/set-type', {
      user_id: log.user_id,
      date: log.date ? new Date(log.date).toISOString().split('T')[0] : log.date,
      type
    })
    await loadRekap()
  } catch (err) {
    alert(err.response?.data?.error || 'Gagal mengatur tipe absensi.')
  }
}
</script>
