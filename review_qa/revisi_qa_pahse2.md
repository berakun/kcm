# 📋 Data Aktual + Task Fix QA — KCM Interior Studio

**Tanggal:** 27 Juni 2026
**Dari:** Gusni (QA Analyst)
**Untuk:** Rifki (Implementer)

---

# BAGIAN A: SPESIFIKASI DATA AKTUAL

---

## 1. Gambar About Section (Ganti broken Google URL)

**Deskripsi gambar yang dibutuhkan:**

> Foto tim KCM yang sedang bekerja di workshop — suasana produksi mebel interior, ada kayu, peralatan, dan 2-3 orang pekerja. Suasana hangat, pencahayaan natural.

**Opsi URL alternatif (jika belum ada foto asli):**

| Opsi | URL | Deskripsi |
|------|-----|-----------|
| Workshop/mebel | `https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80` | Workshop produksi mebel |
| Tim kerja | `https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80` | Konstruksi interior |

**Action:** Upload gambar ke `client/public/assets/images/about-kcm.jpg`

---

## 2. Hero Background Image

Sudah pakai `hero-interior.jpg`. Pastikan file ada di `client/public/assets/images/hero-interior.jpg` dan merupakan foto interior design premium.

**Deskripsi gambar:**

> Foto ruang tamu modern minimalis dengan pencahayaan natural, tone warm, gaya interior Jepang-Scandinavian.

**Contoh URL alternatif:**
`https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80`

---

## 3. Data Karyawan (Users Table)

| # | name | username | password | role | department | phone |
|---|------|----------|----------|------|------------|-------|
| 1 | Ahmad Kurnia | superadmin | password123 | super_admin | Management | 085868000012 |
| 2 | Rina Wati | admin | password123 | admin | Project | 081234567890 |
| 3 | Budi Santoso | budi | password123 | staff | Desain | 085678901234 |
| 4 | Dewi Lestari | dewi | password123 | staff | Desain | 087890123456 |
| 5 | Eko Prasetyo | eko | password123 | staff | Proyek | 089012345678 |

> **Status:** Sudah benar. Tidak perlu diubah.

---

## 4. Data Portfolio (8 item)

| # | title | category | client | location | year | jumlah gambar |
|---|-------|----------|--------|----------|------|---------------|
| 1 | Villa Modern Jogja | residential | Budi Hartono | Sleman, DIY | 2025 | 2 |
| 2 | Kantor Startup Tech | office | PT Tech Indonesia | Yogyakarta | 2025 | 1 |
| 3 | Hotel Heritage Jogja | hotel | PT Candi Heritage | Yogyakarta | 2025 | 2 |
| 4 | Kost Eksklusif Mahasiswa | kost | Andi Wijaya | Ungaran, Sleman | 2025 | 1 |
| 5 | RS Mitra Keluarga | rumah_sakit | RS Mitra Keluarga | Depok, Sleman | 2025 | 2 |
| 6 | Rumah Minimalis 2 Lantai | residential | Keluarga Raharjo | Bantul, DIY | 2025 | 1 |
| 7 | Co-working Space KCM | office | KCM Internal | Ngaglik, Sleman | 2026 | 2 |
| 8 | Restoran Padang Modern | hotel | RM Selera Padang | Yogyakarta | 2026 | 1 |

> **Status:** Sudah benar. Pastikan semua gambar bisa diakses dan tidak broken.

---

## 5. Data RAB (5 proyek)

| # | code | project_name | client | date | status | total_budget |
|---|------|-------------|--------|------|--------|-------------|
| 1 | KCM-RAB-2026-001 | Dapur Modern Minimalis | Wildan Firmansyah | 2026-06-26 | dikerjakan | Rp 310.000.000 |
| 2 | KCM-RAB-2025-004 | Rumah Minimalis 2 Lantai | Keluarga Raharjo | 2025-04-01 | draft | Rp 380.000.000 |
| 3 | KCM-RAB-2025-003 | Kost Eksklusif Mahasiswa | Andi Wijaya | 2025-03-10 | dikerjakan | Rp 620.000.000 |
| 4 | KCM-RAB-2025-002 | Kantor Startup Tech | PT Tech Indonesia | 2025-02-20 | dikerjakan | Rp 450.000.000 |
| 5 | KCM-RAB-2025-001 | Villa Modern Jogja | Budi Hartono | 2025-01-15 | selesai | Rp 850.000.000 |

> **Status:** Sudah benar.

---

## 6. Data Absensi (Seed 2 minggu terakhir)

**Format seed:**
- 5 karyawan × 26 hari kerja (12-27 Juni 2026) = 130 record
- Jam check-in bervariasi: 08:00 - 08:20
- Jam check-out: 17:05 (konsisten)
- Status: mayoritas "hadir" (di_kantor)
- Distance bervariasi: 3-18 meter dari kantor

**PENTING — Tambahkan variasi untuk demo realistis:**

| Jenis | Jumlah | Contoh |
|-------|--------|--------|
| Hadir tepat waktu (≤08:00) | ~30% | Check-in 07:55, status hadir |
| Hadir terlambat (>08:00) | ~40% | Check-in 08:12, status terlambat |
| Tidak hadir | 2-3 record | Tidak ada check-in, status tidak_hadir |
| Cuti/Izin | 1-2 record | Status cuti atau izin |

---

## 7. Data Financial Reports (6 bulan terakhir)

| # | period | revenue | expenses | utilization |
|---|--------|---------|----------|-------------|
| 1 | Januari 2026 | Rp 450.000.000 | Rp 65.000.000 | 14.44 |
| 2 | Februari 2026 | Rp 380.000.000 | Rp 52.000.000 | 13.68 |
| 3 | Maret 2026 | Rp 520.000.000 | Rp 71.000.000 | 13.65 |
| 4 | April 2026 | Rp 290.000.000 | Rp 43.850.000 | 15.12 |
| 5 | Mei 2026 | Rp 340.000.000 | Rp 38.000.000 | 11.18 |
| 6 | Juni 2026 | Rp 250.000.000 | Rp 24.000.000 | 9.60 |

> Revenue bervariasi per bulan, expenses ~10-15% dari revenue. Profit margin tinggi (bisnis jasa konstruksi/interior).

---

## 8. Data Cashbon (5 record)

| # | user | date | recipient | description | amount | status |
|---|------|------|-----------|-------------|--------|--------|
| 1 | Budi | 2026-06-15 | Toko Bangunan Jaya | Material cat & amplas | Rp 850.000 | approved |
| 2 | Eko | 2026-06-18 | Toko Mebel Indo | Fitting kabinet dapur | Rp 1.200.000 | approved |
| 3 | Dewi | 2026-06-20 | Studio Foto X | Foto portfolio proyek | Rp 500.000 | pending |
| 4 | Budi | 2026-06-22 | Vendor Las Surya | Pagar besi custom | Rp 2.300.000 | pending |
| 5 | Eko | 2026-06-25 | Toko Material Abadi | Granit & keramik | Rp 3.500.000 | rejected |

---

## 9. Data Rembes (5 record)

| # | project | date | description | rab_amount | actual_amount | status |
|---|---------|------|-------------|------------|---------------|--------|
| 1 | Kost Eksklusif | 2025-05-01 | Besi beton naik harga | Rp 7.000.000 | Rp 7.350.000 | waspada |
| 2 | Kantor Startup | 2025-04-10 | Partisi kaca lebih mahal | Rp 34.000.000 | Rp 36.000.000 | waspada |
| 3 | Villa Modern | 2025-04-01 | Pekerjaan tambah 10 hari | Rp 42.000.000 | Rp 45.500.000 | waspada |
| 4 | Villa Modern | 2025-03-15 | Kayu Jati naik harga | Rp 112.500.000 | Rp 125.000.000 | melebihi |
| 5 | Kost Eksklusif | 2025-03-20 | Ongkos tukang tambahan | Rp 28.000.000 | Rp 28.500.000 | aman |

---

## 10. Data PO Belanja

| # | no_po | project | supplier | date | total | status |
|---|-------|---------|----------|------|-------|--------|
| 1 | B.803/KCM/VI/2026 | Dapur Modern | Toko Bangunan Jaya | 2026-06-25 | Rp 5.500.000 | draft |
| 2 | B.803/KCM/VI/2026-2 | Kost Eksklusif | Material Indo | 2026-06-20 | Rp 12.800.000 | approved |

---

# BAGIAN B: SEMUA TASK FIX QA

---

## 🔴 FIX 1: Gambar About Section

**File:** `client/src/views/LandingView.vue`

Cari section "Tentang KCM", ganti URL broken:

```vue
<!-- SEBELUM (broken) -->
<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz..." alt="KCM Interior Studio" />

<!-- SESUDAH -->
<img 
  src="/assets/images/about-kcm.jpg" 
  alt="Tim KCM Interior Studio sedang bekerja di workshop produksi mebel" 
  loading="lazy"
  class="w-full h-full object-cover rounded-3xl"
/>
```

**Action:** Upload gambar workshop ke `client/public/assets/images/about-kcm.jpg`

---

## 🔴 FIX 2: Tombol CHECK IN Geofence

**File:** `client/src/views/user/StaffAttendanceView.vue`

### Template — ganti tombol CHECK IN:

```vue
<!-- SEBELUM -->
<button 
  @click="handleCheckIn" 
  class="w-32 h-32 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-200 disabled:opacity-50"
>
  <span class="material-icons text-3xl">login</span>
  <span class="text-sm font-bold mt-1">CHECK IN</span>
</button>

<!-- SESUDAH -->
<button 
  @click="handleCheckIn" 
  :disabled="!canCheckIn"
  class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-200"
  :class="canCheckIn 
    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer' 
    : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
>
  <span class="material-icons text-3xl">login</span>
  <span class="text-sm font-bold mt-1">CHECK IN</span>
</button>

<!-- Tambahkan error message di bawah tombol -->
<p v-if="!gpsGranted" class="text-red-500 text-sm text-center mt-3 max-w-xs">
  ⚠️ Aktifkan GPS untuk melakukan absensi. Akses lokasi diperlukan.
</p>
<p v-else-if="distance !== null && distance > 20" class="text-red-500 text-sm text-center mt-3 max-w-xs">
  🚫 Anda berada di luar radius kantor. Jarak Anda: {{ Math.round(distance) }} meter dari kantor.
</p>
```

### Script — tambahkan computed property:

```javascript
// Tambahkan di bagian <script setup>
const canCheckIn = computed(() => {
  return gpsGranted.value && distance.value !== null && distance.value <= 20
})
```

---

## 🟡 FIX 3: Dropdown Rekap Absensi

**File:** `client/src/views/admin/AttendanceRekapView.vue`

Cari bagian fetch employees:

```javascript
// SEBELUM (kemungkinan filter by role)
const employees = data.filter(e => e.role === 'staff')

// SESUDAH (tampilkan semua yang punya data absensi)
const employees = data // Tampilkan semua karyawan
```

---

## 🟡 FIX 4: Sidebar Backdrop Mobile

**File:** `client/src/components/layout/AppSidebar.vue`

```vue
<!-- SEBELUM (hanya sidebar) -->
<aside class="fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0 ...">
  ...
</aside>

<!-- SESUDAH (tambahkan backdrop + sidebar) -->
<template>
  <!-- Backdrop overlay — muncul saat sidebar open di mobile -->
  <div 
    v-if="sidebarOpen" 
    @click="sidebarOpen = false"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
  ></div>

  <!-- Sidebar -->
  <aside 
    :class="[
      'fixed inset-y-0 left-0 z-50 lg:static h-screen lg:h-full flex flex-col justify-between bg-red-950 text-white w-64 shadow-xl select-none transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- ... konten sidebar ... -->
  </aside>
</template>
```

> Pastikan `sidebarOpen` adalah ref/reactive yang dikontrol oleh hamburger button.

---

## 🟡 FIX 5: Lazy Loading Portfolio Images

**File:** `client/src/views/LandingView.vue`

Tambahkan `loading="lazy"` pada semua img portfolio:

```vue
<img 
  :src="getImageUrl(project.images[0])" 
  :alt="project.title"
  loading="lazy"
  class="w-full h-48 object-cover"
/>
```

---

## 🟡 FIX 6: Tab Container RAB Overflow

**File:** `client/src/views/admin/RabView.vue`

```vue
<!-- SEBELUM -->
<div class="flex items-center space-x-3">

<!-- SESUDAH -->
<div class="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
```

**File:** `client/src/assets/css/main.css` — tambahkan:

```css
/* Scrollbar hide untuk tab container */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

---

## 🟢 FIX 7: Form Name Attributes

**File:** `client/src/views/LandingView.vue`

```vue
<!-- SEBELUM -->
<input placeholder="Nama Anda..." required />
<input placeholder="0812xxxx..." required />
<textarea placeholder="Tulis rencana..." required></textarea>

<!-- SESUDAH -->
<input name="nama" placeholder="Nama Anda..." required />
<input name="telepon" type="tel" placeholder="0812xxxx..." required />
<textarea name="pesan" placeholder="Tulis rencana kebutuhan renovasi/interior Anda di sini..." required></textarea>
```

---

## 🟢 FIX 8: Autocomplete Login

**File:** `client/src/views/LoginView.vue`

```vue
<!-- SEBELUM -->
<input placeholder="Masukkan username" required />
<input type="password" placeholder="••••••••" required />

<!-- SESUDAH -->
<input autocomplete="username" placeholder="Masukkan username" required />
<input type="password" autocomplete="current-password" placeholder="••••••••" required />
```

---

## 🟢 FIX 9: Sembunyikan "Lupa password?"

**File:** `client/src/views/LoginView.vue`

```vue
<!-- SEBELUM -->
<a href="#" class="text-sm text-red-600 hover:underline">Lupa password?</a>

<!-- SESUDAH — komentari sampai fitur dibuat -->
<!-- TODO: Implement password reset flow -->
<!-- <a href="#" class="text-sm text-red-600 hover:underline">Lupa password?</a> -->
```

---

## 🟢 FIX 10: Alt Text Logo

**File:** `client/src/views/LoginView.vue`

```vue
<!-- SEBELUM -->
<img src="/logo-transparent.png" alt="KCM Logo" />

<!-- SESUDAH -->
<img src="/logo-transparent.png" alt="KCM Interior Studio — Logo" />
```

---

# RINGKASAN TASK

| # | Fix | File | Estimasi | Prioritas |
|---|-----|------|----------|-----------|
| 1 | Ganti gambar about | LandingView.vue + upload gambar | 15m | 🔴 |
| 2 | Disable CHECK IN geofence | StaffAttendanceView.vue | 30m | 🔴 |
| 3 | Fix dropdown rekap | AttendanceRekapView.vue | 20m | 🟡 |
| 4 | Sidebar backdrop | AppSidebar.vue | 30m | 🟡 |
| 5 | Lazy load images | LandingView.vue | 10m | 🟡 |
| 6 | Tab overflow | RabView.vue + main.css | 15m | 🟡 |
| 7 | Form name attrs | LandingView.vue | 10m | 🟢 |
| 8 | Autocomplete login | LoginView.vue | 5m | 🟢 |
| 9 | Hide lupa password | LoginView.vue | 2m | 🟢 |
| 10 | Alt text logo | LoginView.vue | 2m | 🟢 |
| — | Update seed data | database/seed.js | 30m | — |

**Total estimasi: ~3 jam**

---

*Setelah semua fix diterapkan, kabari untuk QA ulang.*
