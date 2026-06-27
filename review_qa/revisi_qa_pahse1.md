================================================================================
                        QA PHASE 1 — LAPORAN LENGKAP
================================================================================
Website    : https://kcm.berakun.web.id
Tanggal    : 27 Juni 2026
Mode       : Desktop (1280x633) + Mobile (375x812)
Login      : admin / password123
Score      : 5.5 / 10
================================================================================

DAFTAR ISI
----------
  1. Ringkasan Eksekutif
  2. Desktop QA — Landing Page
  3. Desktop QA — Login Page
  4. Desktop QA — Admin Dashboard
  5. Desktop QA — Portfolio
  6. Desktop QA — RAB / Anggaran
  7. Desktop QA — PO Belanja
  8. Desktop QA — Rekap Absensi
  9. Mobile QA — Responsiveness
 10. Mobile QA — Sizing & Touch Targets
 11. Rekomendasi Prioritas


================================================================================
                        RINGKASAN EKSEKUTIF
================================================================================

Total Issues : 28
  Critical    :  9
  Medium      : 12
  Low         :  7

Area Score:
  Visual Consistency    : 7/10
  Responsiveness       : 5/10
  Feature Functionality: 5/10
  UX Heuristics        : 6/10
  Content Quality      : 7/10
  ----------------------------------
  OVERALL              : 5.5/10


================================================================================
1. LANDING PAGE
================================================================================

--------------------------------------------------------------------------------
1.1 [CRITICAL] Nav Links Hilang di Tablet (768-1024px)
--------------------------------------------------------------------------------
Lokasi     : Navbar — navigation links
Masalah    : Nav links pakai hidden md:flex (hilang <768px). Hamburger menu pakai
             lg:hidden (muncul <1024px). Gap 768-1024px: nav links DAN hamburger
             SAMA-SAMA hidden = TIDAK ADA NAVIGASI.
Bukti      : Class nav: "hidden md:flex items-center space-x-8"
             Class hamburger: "lg:hidden"
Risiko     : Di tablet (iPad Mini, iPad), user tidak bisa navigasi sama sekali.
             Tidak ada menu, tidak ada hamburger.
Expected   : Nav links muncul di md+ (768px). Hamburger muncul di md- (di bawah
             768px). Tidak ada gap navigasi.
Rekomendasi: Ganti hamburger dari lg:hidden -> md:hidden agar muncul mulai 768px.

--------------------------------------------------------------------------------
1.2 [MEDIUM] Hero Section Padding Berlebihan
--------------------------------------------------------------------------------
Lokasi     : Hero section (relative pt-32 pb-24 md:py-48)
Masalah    : padding-top 192px + padding-bottom 192px = 384px total. Di mobile
             812px, 47% layar habis untuk padding.
Bukti      : pt-32 pb-24 md:py-48 min-h-screen
             Computed: paddingTop=192px, paddingBottom=192px
Risiko     : Content hero terlalu kecil dan ter-push ke bawah. User harus scroll
             untuk melihat CTA.
Expected   : Mobile: pt-20 pb-12 (80px + 48px = 128px)
             Desktop: md:pt-48 md:pb-32 (192px + 128px)
Rekomendasi: Ubah ke pt-20 pb-12 md:pt-48 md:pb-32

--------------------------------------------------------------------------------
1.3 [MEDIUM] Stats Grid Tidak Responsif
--------------------------------------------------------------------------------
Lokasi     : Stats section (10+ Tahun, 500+, 98%, 5 Tahun)
Masalah    : Class grid-cols-3 — tanpa breakpoint responsive. Selalu 3 kolom
             bahkan di 375px.
Bukti      : <div class="grid grid-cols-3 ...">. 4 item dipaksa masuk 3 kolom.
Risiko     : Di mobile, angka-angka kecil dan rapat. Item ke-4 (5 Tahun) terpaksa
             wrap ke baris baru sendirian.
Expected   : Mobile: 2 kolom (grid-cols-2). Tablet+: 4 kolom (md:grid-cols-4).
Rekomendasi: Ubah ke grid-cols-2 md:grid-cols-4

--------------------------------------------------------------------------------
1.4 [MEDIUM] Section Padding Berlebihan di Mobile
--------------------------------------------------------------------------------
Lokasi     : Semua section content (6 sections)
Masalah    : Semua section pakai py-24 = 96px padding atas + 96px bawah =
             192px per section. Di mobile, 24% layar per section hanya untuk spasi.
Bukti      : 6 elemen dengan class py-24. Computed padding: 96px top + 96px bottom.
Risiko     : Terlalu banyak whitespace di mobile. User harus scroll jauh.
Expected   : Mobile: py-12 (48px). Desktop: md:py-24 (96px).
Rekomendasi: Ubah ke py-12 md:py-24

--------------------------------------------------------------------------------
1.5 [CRITICAL] Portfolio "Rumah_sakit" Bukan "Rumah Sakit"
--------------------------------------------------------------------------------
Lokasi     : Landing Page -> Portfolio Gallery -> "RS Mitra Keluarga"
Masalah    : Badge kategori menampilkan "Rumah_sakit" (underscore, lowercase)
             bukan "Rumah Sakit".
Bukti      : Snapshot: StaticText "Rumah_sakit" pada item RS Mitra Keluarga.
Risiko     : Terlihat tidak profesional. Raw value dari database tidak di-format.
Expected   : Badge menampilkan "Rumah Sakit" (spasi, title case).
Rekomendasi: Tambahkan formatter: rumah_sakit -> "Rumah Sakit"

--------------------------------------------------------------------------------
1.6 [CRITICAL] Gambar Tidak Responsif
--------------------------------------------------------------------------------
Lokasi     : Landing Page -> Portfolio Gallery (6 gambar) + Logo
Masalah    : 0/8 gambar punya srcset atau sizes. 7/8 gambar tanpa loading="lazy".
             Logo 2048x2048 ditampilkan 40x40 (51x oversized).
Bukti      : Semua <img> tanpa attributes srcset, sizes, atau loading="lazy".
             Logo natural: 2048x2048, rendered: 40x40.
Risiko     : Mobile user download gambar desktop. Page load lambat di 3G/4G.
             Boros kuota.
Expected   : Semua gambar punya loading="lazy". Logo pakai versi optimized
             (128x128 atau 256x256). Portfolio images pakai srcset.
Rekomendasi: Tambahkan loading="lazy" ke semua <img>. Buat logo versi kecil.

--------------------------------------------------------------------------------
1.7 [MEDIUM] Touch Targets Kecil (19 dari 25 elements)
--------------------------------------------------------------------------------
Lokasi     : Seluruh halaman — nav links, footer links, buttons
Masalah    : 19 dari 25 clickable elements punya tinggi < 44px (standar Apple HIG).
             Nav links: 20px. Footer links: 15px. Dark mode: 42px. Masuk Akun: 40px.
Bukti      : Measured via getBoundingClientRect(). Nav "Beranda" h=20px.
             Footer "Interior Design" h=15px.
Risiko     : Sulit di-tap di mobile. Miss-tap sering terjadi. Accessibility buruk.
Expected   : Semua clickable elements minimal 44x44px (Apple) atau 48x48px
             (Material Design).
Rekomendasi: Tambahkan py-2 atau min-h-[44px] pada semua link/button.

--------------------------------------------------------------------------------
1.8 [LOW] FAQ Hanya 3 Pertanyaan
--------------------------------------------------------------------------------
Lokasi     : Landing Page -> FAQ Section
Masalah    : Hanya 3 pertanyaan. Untuk website bisnis interior, idealnya 5-8.
Bukti      : 3 <button> accordion items.
Risiko     : Kurang informatif untuk calon klien.
Expected   : 5-8 pertanyaan FAQ mencakup: proses pengerjaan, estimasi waktu,
             area jangkauan, garansi, metode pembayaran.
Rekomendasi: Tambahkan FAQ: "Berapa lama pengerjaan?", "Area jangkauan KCM?",
             "Metode pembayaran?", "Apakah bisa custom design?",
             "Bagaimana proses konsultasi?".

--------------------------------------------------------------------------------
1.9 [LOW] Footer "Karyawan Area" Ambigu
--------------------------------------------------------------------------------
Lokasi     : Landing Page -> Footer -> Navigasi
Masalah    : Link "Karyawan Area" mengarah ke halaman login. Tidak jelas untuk siapa.
Bukti      : <a href="/login">Karyawan Area</a>
Risiko     : User bingung apakah ini untuk klien atau karyawan internal.
Expected   : Label yang jelas: "Login Karyawan" atau "Area Klien".
Rekomendasi: Ganti label menjadi "Login Karyawan" atau "Area Klien".


================================================================================
2. LOGIN PAGE
================================================================================

--------------------------------------------------------------------------------
2.1 [LOW] Input Tanpa Label Visible
--------------------------------------------------------------------------------
Lokasi     : Login Page -> Username & Password fields
Masalah    : Input menggunakan placeholder text, bukan label visible di atas input.
Bukti      : <input placeholder="Masukkan username">. Tidak ada <label> visible.
Risiko     : Minor accessibility issue.
Expected   : Label "Username" dan "Password" visible di atas input field.
Rekomendasi: Tambahkan label text di atas input. Placeholder tetap ada sebagai hint.


================================================================================
3. ADMIN DASHBOARD
================================================================================

--------------------------------------------------------------------------------
3.2 [CRITICAL] Sidebar Admin Tanpa Backdrop
--------------------------------------------------------------------------------
Lokasi     : Admin Panel -> Sidebar (mobile)
Masalah    : Sidebar class: fixed inset-y-0 left-0 -translate-x-full
             lg:static lg:translate-x-0 w-64. Di mobile, sidebar muncul sebagai
             overlay 256px. Tidak ada backdrop/overlay element.
Bukti      : Tidak ada sibling element backdrop di DOM.
Risiko     : User harus cari tombol close/hamburger lagi untuk menutup sidebar.
Expected   : Saat sidebar terbuka di mobile, muncul backdrop semi-transparan
             (bg-black/50). Klik backdrop = close sidebar.
Rekomendasi: Tambahkan <div class="fixed inset-0 bg-black/50 z-40 lg:hidden"
             v-if="sidebarOpen" @click="sidebarOpen = false" />.

--------------------------------------------------------------------------------
3.3 [MEDIUM] Dark Mode Button Tanpa Indikator State
--------------------------------------------------------------------------------
Lokasi     : Semua halaman admin -> Header -> Dark mode toggle
Masalah    : Tombol dark_mode ada tapi tidak ada indikasi visual state aktif/tidak.
Bukti      : <button class="dark_mode">. Tidak ada class conditional.
Risiko     : User bingung mode mana yang aktif.
Expected   : Icon berubah: dark_mode saat light mode aktif,
             light_mode saat dark mode aktif.
Rekomendasi: Conditional icon: isDark ? 'light_mode' : 'dark_mode'

--------------------------------------------------------------------------------
3.4 [LOW] Tidak Ada Breadcrumb Navigation
--------------------------------------------------------------------------------
Lokasi     : Semua halaman admin
Masalah    : Tidak ada breadcrumb untuk navigasi hierarki.
Bukti      : Tidak ada element breadcrumb di DOM.
Risiko     : Minor usability issue. User tidak tahu posisi mereka.
Expected   : Breadcrumb: Home > Portfolio atau Dashboard > RAB > Detail.
Rekomendasi: Tambahkan breadcrumb component di bawah section header.


================================================================================
4. PORTFOLIO
================================================================================

--------------------------------------------------------------------------------
4.1 [MEDIUM] Filter Buttons Kecil (< 44px)
--------------------------------------------------------------------------------
Lokasi     : Admin -> Portfolio -> Filter Buttons (Semua, Residential, Office,
             Hotel, Kost, Rumah Sakit)
Masalah    : Tinggi buttons = 34px. Standar touch target minimum = 44px.
Bukti      : Measured: height=34px untuk semua 6 filter buttons.
Risiko     : Sulit di-tap di mobile. Miss-tap sering terjadi.
Expected   : Semua filter buttons minimal 44px tinggi.
Rekomendasi: Tambahkan py-2.5 atau min-h-[44px].


================================================================================
5. RAB / ANGGARAN
================================================================================

--------------------------------------------------------------------------------
5.1 [MEDIUM] Filter Tanggal Tidak Ada Shortcut
--------------------------------------------------------------------------------
Lokasi     : RAB/Anggaran -> Filter section
Masalah    : 2 date picker terpisah (Tanggal Mulai -> Tanggal Selesai).
             Tidak ada shortcut "Hari Ini", "Bulan Ini", dll.
Bukti      : 2 <input type="date"> dengan tombol "Show date picker".
Risiko     : User harus manual set tanggal 2x. Kurang efisien.
Expected   : 1 unified date range picker + shortcut buttons:
             "Hari Ini", "Minggu Ini", "Bulan Ini", "3 Bulan Terakhir".
Rekomendasi: Tambahkan shortcut filter atau gunakan date range picker modern.

--------------------------------------------------------------------------------
5.2 [CRITICAL] Table Overflow di Mobile
--------------------------------------------------------------------------------
Lokasi     : RAB -> Table (7 kolom)
Masalah    : Table width 952px. Mobile viewport 375px. Overflow 2.5x.
Bukti      : 7 kolom: KODE RAB, NAMA PROYEK, KLIEN, TANGGAL, TOTAL ANGGARAN,
             STATUS, AKSI.
Risiko     : User harus scroll horizontal. Kolom AKSI tersembunyi.
Expected   : Table memiliki overflow-x-auto di parent. Idealnya: mobile card view.
Rekomendasi: Minimal: tambahkan overflow-x-auto. Ideal: buat card view mobile.


================================================================================
6. PO BELANJA
================================================================================

--------------------------------------------------------------------------------
6.1 [MEDIUM] Data Supplier & Project Kosong
--------------------------------------------------------------------------------
Lokasi     : PO Belanja -> Table -> Row 1
Masalah    : Supplier dan Project menampilkan "-".
Bukti      : Cell "SUPPLIER" = "-". Cell "PROJECT" = "-".
Risiko     : Data tidak lengkap. Admin tidak bisa melihat relasi.
Expected   : Supplier dan Project terisi dari relasi database.
Rekomendasi: Pastikan seed data PO memiliki relasi ke supplier dan project.

--------------------------------------------------------------------------------
6.2 [MEDIUM] Table Overflow di Mobile
--------------------------------------------------------------------------------
Lokasi     : PO Belanja -> Table (8 kolom)
Masalah    : Table width 975px. Mobile viewport 375px. Overflow 2.6x.
Bukti      : 8 kolom. Parent class: overflow-x-auto.
Risiko     : User harus scroll horizontal.
Expected   : Table scrollable dengan indicator. Idealnya: mobile card view.
Rekomendasi: Parent sudah punya overflow-x-auto. Tambahkan scroll indicator.


================================================================================
7. REKAP ABSENSI
================================================================================

--------------------------------------------------------------------------------
7.1 [CRITICAL] Absensi Hanya Tampilkan 1 Karyawan
--------------------------------------------------------------------------------
Lokasi     : Rekap Absensi -> Tabel Detail
Masalah    : Tabel hanya menampilkan data "R Rina Wati" dari 5 karyawan.
Bukti      : Semua 10 rows di tabel menampilkan "R Rina Wati".
Risiko     : Admin tidak bisa melihat data absensi seluruh karyawan.
Expected   : Tabel menampilkan semua karyawan. Filter dropdown tersedia.
Rekomendasi: Tambahkan filter dropdown karyawan. Pastikan backend mengembalikan
             data semua karyawan.

--------------------------------------------------------------------------------
7.2 [MEDIUM] Statistik Hadir & Terlambat Angka Sama
--------------------------------------------------------------------------------
Lokasi     : Rekap Absensi -> Stats Cards
Masalah    : HADIR = 27 dan TERLAMBAT (> 08.00) = 27. Angka identik.
Bukti      : Heading "27" untuk HADIR dan "27" untuk TERLAMBAT.
Risiko     : Jika semua memang terlambat, ada masalah sistematis. Jika tidak,
             ada bug kalkulasi.
Expected   : HADIR = total kehadiran. TERLAMBAT = subset yang check-in > 08:00.
Rekomendasi: Review logika kalkulasi "TERLAMBAT".

--------------------------------------------------------------------------------
7.3 [MEDIUM] Tidak Ada Filter Karyawan di Tabel Detail
--------------------------------------------------------------------------------
Lokasi     : Rekap Absensi -> Tabel Detail
Masalah    : Hanya ada search box. Tidak ada dropdown filter karyawan/departemen.
Bukti      : Search box "Cari nama karyawan..." tanpa dropdown filter.
Risiko     : Sulit mencari data spesifik jika data banyak.
Expected   : Dropdown filter "Semua Karyawan" dan "Semua Departemen".
Rekomendasi: Tambahkan 2 dropdown filter: karyawan dan departemen.

--------------------------------------------------------------------------------
7.4 [CRITICAL] Table Absensi Overflow di Mobile
--------------------------------------------------------------------------------
Lokasi     : Rekap Absensi -> Tabel Detail (9 kolom)
Masalah    : 9 kolom: TANGGAL, KARYAWAN, DEPARTEMEN, CHECK-IN, CHECK-OUT,
             DURASI, JARAK, STATUS, TIPE.
Bukti      : Table dengan 9 kolom header.
Risiko     : Overflow sangat besar di mobile.
Expected   : Mobile: sembunyikan kolom次要 (JARAK, DURASI). Tampilkan di expand.
Rekomendasi: Buat mobile card view atau sembunyikan kolom次要 di mobile.


================================================================================
8. MOBILE QA — RESPONSIVENESS
================================================================================

8.1 [CRITICAL] Nav Landing Page Hilang di Tablet
  Masalah  : Gap breakpoint 768-1024px — nav dan hamburger sama-sama hidden.
  Expected : Konsisten: hamburger muncul < 768px, nav muncul >= 768px.
  Fix      : Ganti lg:hidden -> md:hidden pada tombol hamburger.

8.2 [MEDIUM] Hero Section Padding Mobile
  Masalah  : pt-32 pb-24 md:py-48 = 384px padding di mobile.
  Expected : Mobile: pt-20 pb-12 (128px total). Desktop: md:pt-48 md:pb-32.

8.3 [MEDIUM] Section Padding Mobile
  Masalah  : py-24 = 96px padding di semua section.
  Expected : Mobile: py-12 (48px). Desktop: md:py-24 (96px).

8.4 [MEDIUM] Stats Grid Mobile
  Masalah  : grid-cols-3 tanpa responsive breakpoint.
  Expected : Mobile: grid-cols-2. Desktop: md:grid-cols-4.

8.5 [MEDIUM] Logo Oversized
  Masalah  : Natural 2048x2048, rendered 40x40. 51x oversized.
  Expected : Logo optimized 128x128 atau 256x256.

8.6 [LOW] Tidak Ada Scroll Indicator untuk Tables
  Masalah  : Tidak ada visual cue bahwa table bisa di-scroll horizontal.
  Expected : Gradient fade atau scroll indicator di kanan table.


================================================================================
9. MOBILE QA — SIZING & TOUCH TARGETS
================================================================================

Touch Targets Summary:
  Kategori      | Jumlah < 44px | Contoh
  --------------|---------------|----------------------------
  Nav links     | 5             | Beranda (20px), Layanan (20px)
  Footer links  | 6             | Interior Design (15px)
  Buttons       | 4             | Dark mode (42px), Masuk Akun (40px)
  Other         | 4             | Logo link (40px)
  --------------|---------------|----------------------------
  TOTAL         | 19 dari 25    |

Form Inputs Summary:
  Input              | Tinggi | Status
  -------------------|--------|--------------------------
  "Nama Anda..."     | 16px   | 63% terlalu kecil
  "0812xxxx..."      | 16px   | 63% terlalu kecil
  Textarea           | 64px   | OK


================================================================================
10. REKOMENDASI PRIORITAS
================================================================================

--- SEGERA (Hari Ini) ---
  1. Fix nav breakpoint mismatch (lg:hidden -> md:hidden)     | 1 jam
  2. Fix "Rumah_sakit" -> "Rumah Sakit"                       | 1 jam
  3. Tambahkan backdrop overlay untuk sidebar mobile           | 2 jam
  4. Fix presensi hari ini (cek hari libur vs 0)               | 2 jam
  5. Fix absensi tampilkan semua karyawan                      | 1 hari
  6. Tambahkan overflow-x-auto pada semua table parent         | 1 jam
  7. Tambahkan loading="lazy" pada semua gambar                | 30 menit

--- MINGGU INI ---
  8.  Review kalkulasi terlambat (HADIR = TERLAMBAT)           | 1 hari
  9.  Tambahkan shortcut filter tanggal                        | 2 jam
  10. Perbesar touch target semua buttons (min 44px)           | 1 jam
  11. Fix dark mode button state indicator                     | 1 jam
  12. Fix stats grid responsive                                | 30 menit
  13. Fix hero padding mobile                                  | 30 menit
  14. Fix section padding mobile                               | 30 menit
  15. Perbaiki PO Belanja data kosong                          | 1 hari
  16. Tambahkan filter karyawan di Tabel Detail Absensi        | 1 hari
  17. Tambahkan scroll indicator untuk tables                  | 2 jam

--- BULAN INI ---
  18. Buat mobile card view untuk tables                       | 2 hari
  19. Buat versi gambar thumbnail untuk mobile (srcset)        | 1 hari
  20. Tambahkan FAQ (5-8 pertanyaan)                           | 1 hari
  21. Tambahkan breadcrumb navigation                          | 2 jam
  22. Fix footer "Karyawan Area" label                         | 30 menit
  23. Tambahkan label visible di login form                    | 30 menit


================================================================================
                    Dibuat oleh: Gusni — Remediator Keamanan & QA Analyst
                    Tanggal: 27 Juni 2026
================================================================================
