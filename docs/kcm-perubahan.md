# Prompt Antigravity — Kurnia Cipta Mandiri (Vue + Node.js)
## Copy paste ke Antigravity (Gemini)

---

```
Buatkan website lengkap untuk perusahaan "Kurnia Cipta Mandiri" (KCM) menggunakan Vue.js 3 (frontend) dan Node.js/Express (backend) dengan MySQL database. Project disimpan di C:\laragon\www\kcm dengan UI design sebagai pedoman di C:\laragon\www\kcm\ui (baca semua file .html dan .png di folder ui untuk referensi design).

## TENTANG PERUSAHAAN
- Nama: Kurnia Cipta Mandiri (KCM)
- Slogan: "Ingin interior murah? KCM solusinya"
- Alamat: Jl. Kaliurang Jl. Candi Winangun km 12 No.24, Turen, Sardonoharjo, Kec. Ngaglik, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55581
- Telepon/WhatsApp: 085868000012
- Email: kcm_production@ymail.com
- Instagram: https://www.instagram.com/pengrajin_interiorkcm
- Facebook: https://www.facebook.com/anriko.kurniawan (Interior design KCM)
- Jam Kerja: Senin - Sabtu, 08:00 - 17:00, Minggu Libur
- Google Maps: https://maps.app.goo.gl/cYj8UaaEvfLbnn6x8
- Logo: File logo disimpan di client/public/logo.png — gunakan file ini di semua halaman (sidebar, login, landing page, footer)

## DATABASE MySQL (Connect ke STB)
```
DB_HOST=192.168.100.191
DB_PORT=3306
DB_USER=root
DB_PASS=qwerty123
DB_NAME=kcm_database
```
Buat database baru 'kcm_database'. Jangan gunakan database keepitlow.

## FONT
Gunakan Google Fonts: **Plus Jakarta Sans** sebagai font utama. Modern, bersih, profesional.
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```
```css
body { font-family: 'Plus Jakarta Sans', sans-serif; }
```

## WARNA THEME
- Primary: Maroon (#991B1B)
- Light mode: Maroon + Putih (#FFFFFF)
- Dark mode: Maroon + Abu gelap (#1F2937, #111827)
- Accent: Gold (#B45309)

## LOGO
File logo disimpan di `docs/logo.png` dalam folder project. Copy dari situ ke `client/public/logo.png`. Gunakan file ini di semua halaman (sidebar, login, landing page, footer, WhatsApp, favicon). Jika ada multiple format (png/svg), gunakan SVG jika tersedia.

## STRUKTUR PROJECT
```
kcm/
├── docs/
│   └── logo.png              (Logo KCM — letakkan file logo di sini)
├── client/                         (Vue.js Frontend)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue
│   │   ├── router/
│   │   │   └── index.js           (Vue Router)
│   │   ├── stores/
│   │   │   ├── auth.js            (Pinia auth store)
│   │   │   └── app.js             (Pinia app store)
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── LandingView.vue
│   │   │   ├── PortfolioView.vue
│   │   │   ├── admin/
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── UsersView.vue
│   │   │   │   ├── PortfolioManageView.vue
│   │   │   │   ├── RabView.vue
│   │   │   │   ├── FinancialView.vue
│   │   │   │   └── AttendanceView.vue
│   │   │   └── user/
│   │   │       └── AttendanceView.vue
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   ├── AppTopbar.vue
│   │   │   │   └── AppFooter.vue
│   │   │   ├── ui/
│   │   │   │   ├── BaseCard.vue
│   │   │   │   ├── BaseTable.vue
│   │   │   │   ├── BaseModal.vue
│   │   │   │   ├── BaseButton.vue
│   │   │   │   └── BaseChart.vue
│   │   │   ├── attendance/
│   │   │   │   ├── CheckInOutButton.vue
│   │   │   │   ├── GpsVerification.vue
│   │   │   │   ├── CalendarHeatmap.vue
│   │   │   │   └── AttendanceHistory.vue
│   │   │   └── rab/
│   │   │       ├── RabTable.vue
│   │   │       ├── RembesTable.vue
│   │   │       ├── CashbonForm.vue
│   │   │       └── BelanjaForm.vue
│   │   ├── composables/
│   │   │   ├── useAuth.js
│   │   │   ├── useGps.js
│   │   │   └── useApi.js
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   │   └── main.css       (Tailwind + custom)
│   │   │   └── images/
│   │   │       └── logo.svg
│   │   └── utils/
│   │       ├── validators.js
│   │       └── helpers.js
│   └── public/
│       └── favicon.ico
├── server/                         (Node.js Backend)
│   ├── package.json
│   ├── .env                        (环境变量)
│   ├── server.js                   (Entry point)
│   ├── config/
│   │   └── db.js                   (MySQL connection pool)
│   ├── middleware/
│   │   ├── auth.js                 (JWT verification)
│   │   ├── role.js                 (Role-based access)
│   │   ├── validate.js             (Input validation)
│   │   ├── rateLimiter.js          (Rate limiting)
│   │   └── security.js             (Helmet + CORS)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── portfolio.routes.js
│   │   ├── rab.routes.js
│   │   ├── financial.routes.js
│   │   ├── attendance.routes.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── portfolio.controller.js
│   │   ├── rab.controller.js
│   │   ├── financial.controller.js
│   │   └── attendance.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   ├── Rab.js
│   │   ├── RabItem.js
│   │   ├── Rembes.js
│   │   ├── Cashbon.js
│   │   ├── OfficeSupply.js
│   │   ├── Attendance.js
│   │   └── FinancialReport.js
│   ├── utils/
│   │   ├── gps.js                  (Haversine formula)
│   │   ├── validators.js
│   │   └── helpers.js
│   └── database/
│       └── schema.sql              (Database schema)
├── .gitignore
└── README.md
```

## TECH STACK

### Frontend (client/)
- Vue.js 3 + Composition API
- Vite as build tool
- Vue Router 4 (client-side routing)
- Pinia (state management)
- Tailwind CSS (styling)
- Chart.js + vue-chartjs (charts)
- Axios (HTTP client)
- Lucide Vue Next (icons)

### Backend (server/)
- Node.js 18+
- Express.js 4 (web framework)
- mysql2/promise (MySQL driver with connection pooling)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- express-validator (input validation)
- helmet (security headers)
- cors (CORS configuration)
- express-rate-limit (rate limiting)
- dotenv (environment variables)
- multer (file upload)
- morgan (logging)

### Database
- MySQL 8 di STB (192.168.100.191:3306)
- Database: kcm_database (buat baru)

## DATABASE SCHEMA (schema.sql)

```sql
CREATE DATABASE IF NOT EXISTS kcm_database;
USE kcm_database;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('super_admin', 'admin', 'user') DEFAULT 'user',
    department VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    avatar VARCHAR(255),
    last_active DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE portfolio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    category ENUM('residential', 'office', 'hotel', 'kost', 'rumah_sakit') NOT NULL,
    description TEXT,
    client_name VARCHAR(100),
    location VARCHAR(200),
    year YEAR,
    images JSON,
    status ENUM('published', 'draft') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- RAB (Rencana Anggaran Biaya)
CREATE TABLE rab (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    client VARCHAR(100),
    date DATE,
    status ENUM('draft', 'dikerjakan', 'selesai') DEFAULT 'draft',
    total_budget DECIMAL(15,2) DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- RAB Items
CREATE TABLE rab_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rab_id INT NOT NULL,
    section ENUM('bahan', 'pekerjaan', 'perlengkapan') NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    unit VARCHAR(20),
    qty DECIMAL(10,2) DEFAULT 0,
    unit_price DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) GENERATED ALWAYS AS (qty * unit_price) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rab_id) REFERENCES rab(id) ON DELETE CASCADE
);

-- Rembes (Leakage Tracking)
CREATE TABLE rembes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rab_id INT NOT NULL,
    date DATE,
    description TEXT,
    rab_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2),
    difference DECIMAL(15,2) GENERATED ALWAYS AS (rab_amount - actual_amount) STORED,
    notes TEXT,
    status ENUM('aman', 'waspada', 'melebihi') DEFAULT 'aman',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rab_id) REFERENCES rab(id) ON DELETE CASCADE
);

-- Cashbon
CREATE TABLE cashbon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE,
    recipient VARCHAR(100),
    description TEXT,
    amount DECIMAL(15,2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    proof_file VARCHAR(255),
    notes TEXT,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Office Supplies (Belanja Kantor)
CREATE TABLE office_supplies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE,
    item VARCHAR(200),
    category ENUM('atk', 'elektronik', 'furniture', 'lainnya') DEFAULT 'lainnya',
    qty INT DEFAULT 1,
    unit_price DECIMAL(15,2),
    total DECIMAL(15,2) GENERATED ALWAYS AS (qty * unit_price) STORED,
    status ENUM('pending', 'approved', 'selesai') DEFAULT 'pending',
    justification TEXT,
    urgency ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang',
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Attendance
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    check_in DATETIME,
    check_out DATETIME,
    duration TIME GENERATED ALWAYS AS (TIMDIFF(check_out, check_in)) STORED,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    distance DECIMAL(10,2),
    status ENUM('di_kantor', 'luar_kantor') DEFAULT 'di_kantor',
    ip_address VARCHAR(45),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Financial Reports
CREATE TABLE financial_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    period VARCHAR(20),
    revenue DECIMAL(15,2) DEFAULT 0,
    expenses DECIMAL(15,2) DEFAULT 0,
    profit DECIMAL(15,2) GENERATED ALWAYS AS (revenue - expenses) STORED,
    utilization DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Office Settings (for GPS point)
CREATE TABLE office_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default office GPS coordinates (from Google Maps)
INSERT INTO office_settings (setting_key, setting_value) VALUES
('office_latitude', '-7.7326'),  -- Akan diupdate setelah cek Maps
('office_longitude', '110.3988'),
('office_radius', '20');  -- 20 meter radius

-- Insert default super admin (password: admin123 - harus diubah!)
INSERT INTO users (name, email, password, role, department, status) VALUES
('Super Admin', 'admin@kcm.co.id', '$2a$10$hashedpasswordhere', 'super_admin', 'Management', 'active');
```

## SERVER ENVIRONMENT (.env)
```
PORT=3000
NODE_ENV=development

# Database
DB_HOST=192.168.100.191
DB_PORT=3306
DB_USER=root
DB_PASS=qwerty123
DB_NAME=kcm_database

# JWT
JWT_SECRET=kcm_super_secret_key_2024_change_this_in_production
JWT_EXPIRES_IN=24h

# GPS Office Location
OFFICE_LAT=-7.7326
OFFICE_LNG=110.3988
OFFICE_RADIUS=20

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

## SECURITY YANG HARUS DITERAPKAN

### 1. Authentication & Authorization
- Password hashing dengan bcrypt (10 rounds)
- JWT token untuk session management
- Token expiry 24 jam
- Role-based access control (Super Admin, Admin, User)
- Middleware auth di semua protected routes

### 2. Input Validation
- Sanitize semua input user di backend (express-validator)
- Validate email format, phone number, etc.
- Prevent SQL injection dengan parameterized queries (mysql2/promise)
- Max length validation untuk semua string fields

### 3. Security Headers (Helmet)
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection

### 4. Rate Limiting
- 100 requests per 15 menit per IP
- Stricter limit untuk login: 5 attempts per 15 menit
- Block IP sementara setelah 5 failed login attempts

### 5. CORS Configuration
- Hanya allow origin: http://localhost:5173 (dev)
- Production: allow domain khusus

### 6. Data Protection
- Jangan return password hash di API response
- Sembunyikan sensitive data di logs
- Gunakan HTTPS di production

### 7. File Upload Security
- Validate file type (hanya gambar: jpg, png, webp)
- Max file size: 5MB
- Rename file dengan random string untuk prevent path traversal

### 8. SQL Injection Prevention
- Gunakan parameterized queries ATAU prepared statements
- JANGAN pernah concatenate user input ke SQL query
- mysql2/promise sudah support parameterized queries

## FITUR YANG HARUS DIBUAT

### 1. LOGIN (LoginView.vue)
Split layout. Form email + password. JWT token disimpan di httpOnly cookie atau localStorage. Role-based redirect (super_admin → admin dashboard, admin → admin dashboard, user → attendance page).

### 2. LANDING PAGE (LandingView.vue)
Berdasarkan ui/landing_page/code.html. Hero, statistik, tentang, layanan, portfolio preview, keunggulan, testimonial, FAQ, kontak, footer.

### 3. PORTFOLIO (PortfolioView.vue)
Berdasarkan ui/portfolio_showcase/code.html. Filter categories, masonry grid, lightbox modal.

### 4. ADMIN DASHBOARD (admin/DashboardView.vue)
Berdasarkan ui/dashboard_overview/code.html. Sidebar, KPI cards, charts, activity feed.

### 5. USER MANAGEMENT (admin/UsersView.vue)
Berdasarkan ui/user_management/code.html. CRUD users dengan modal forms.

### 6. PORTFOLIO MANAGEMENT (admin/PortfolioManageView.vue)
Berdasarkan ui/portfolio_management/code.html. Drag-drop upload, thumbnail grid, publish/draft toggle.

### 7. RAB BUILDER (admin/RabView.vue)
Berdasarkan ui/rab_builder/code.html. 4 tabs dengan tabel line items, auto-calculate subtotals, rembes tracking, cashbon form, belanja form.

### 8. FINANCIAL REPORTS (admin/FinancialView.vue)
Berdasarkan ui/financial_reports/code.html. Summary cards, charts, RAB vs Actual comparison, leakage tracker.

### 9. ATTENDANCE MANAGEMENT (admin/AttendanceView.vue)
Berdasarkan ui/attendance_management/code.html. Calendar view + table view, employee attendance history.

### 10. USER ATTENDANCE (user/AttendanceView.vue)
Berdasarkan ui/user_attendance_dashboard/code.html. Tombol HADIR/PULANG, GPS verification, real-time clock, calendar heatmap, history.

## GPS ATTENDANCE LOGIC

```javascript
// composables/useGps.js
import { ref } from 'vue'

export function useGps() {
  const position = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const officeLat = -7.7326  // Dari Google Maps
  const officeLng = 110.3988
  const radiusMeters = 20

  // Haversine formula hitung jarak
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000 // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  async function getCurrentPosition() {
    loading.value = true
    error.value = null
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          position.value = pos.coords
          const distance = calculateDistance(
            pos.coords.latitude, pos.coords.longitude,
            officeLat, officeLng
          )
          loading.value = false
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            distance: Math.round(distance),
            status: distance <= radiusMeters ? 'di_kantor' : 'luar_kantor'
          })
        },
        (err) => {
          error.value = err.message
          loading.value = false
          reject(err)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  return { position, error, loading, getCurrentPosition, calculateDistance }
}
```

## FRONTEND ROUTING
```javascript
// router/index.js
const routes = [
  { path: '/', component: LandingView },
  { path: '/login', component: LoginView },
  { path: '/portfolio', component: PortfolioView },
  { path: '/admin', component: DashboardView, meta: { requiresAuth: true, role: ['super_admin', 'admin'] } },
  { path: '/admin/users', component: UsersView, meta: { requiresAuth: true, role: ['super_admin'] } },
  { path: '/admin/portfolio', component: PortfolioManageView, meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/admin/rab', component: RabView, meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/admin/financial', component: FinancialView, meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/admin/attendance', component: AttendanceView, meta: { requiresAuth: true, role: ['super_admin', 'admin'] } },
  { path: '/user/attendance', component: UserAttendanceView, meta: { requiresAuth: true, role: ['user', 'admin', 'super_admin'] } },
]
```

## MULAI DARI:
1. Setup project structure (client/ dan server/)
2. Install dependencies (npm install)
3. Buat database schema (schema.sql)
4. Buat backend API (server.js + routes + controllers)
5. Buat frontend Vue (views + components)
6. Connect frontend ke backend
7. Test semua fitur

Langsung kerjakan semuanya. Jangan tanya-tanya lagi, langsung gas!
```

---

## Cara Pakai
1. Copy semua text di atas (dari ``` sampai ```)
2. Paste ke Antigravity/Gemini
3. Tekan Enter dan biarkan generate
4. Ikuti instruksi yang diberikan
# KCM — Perubahan & Penambahan Fitur
## Copy paste setelah prompt utama selesai di-generate

---

## PROMPT TAMBAHAN

```
Terapkan perubahan berikut pada project yang sudah dibuat:

## 1. SISTEM ABSENSI GPS — HARD BLOCK
- Range absensi: 20 meter dari titik kantor
- Jika user berada di LUAR radius 20m → TIDAK BISA absen (muncul error: "Anda berada di luar radius kantor. Jarak Anda: X meter dari kantor")
- Jika user berada di DALAM radius 20m → BISA absen (success)
- Simpan data: latitude, longitude, distance, status (di_kantor/luar_kantor), IP address, timestamp
- Tampilkan jarak real-time saat user mau absen

## 2. HAPUS OFFICE SUPPLIES (Belanja Kantor)
- Hapus semua fitur "Belanja Kantor" / "Office Supplies" dari seluruh halaman
- Di menu sidebar admin, hapus menu "Belanja Kantor"
- Di RAB builder, hapus tab "Belanja Kantor" — hanya ada 3 tab: Anggaran Pokok, Rembes, Cashbon
- Tabel cashbon tetap ada, form cashbon tetap ada

## 3. HAPUS GUEST LOGIN
- Hapus tombol "Masuk sebagai Guest" dari halaman login
- Semua user HARUS login dengan email & password yang didaftarkan oleh admin
- Tidak ada akses tanpa akun

## 4. ROLE — HANYA 3 ROLE
Hapus role lain, hanya ada:
- super_admin
- admin  
- staff

Ubah di database:
```sql
ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'staff') NOT NULL DEFAULT 'staff';
```

## 5. ROLE-BASED ACCESS — DETAIL

### SUPER ADMIN
- Akses penuh ke SEMUA menu
- Menu sidebar: Beranda, Users, Portfolio, RAB, Keuangan, Absensi, Settings
- Bisa menambah/mengedit/menghapus user
- Bisa mengelola portfolio (upload, edit, hapus)
- Bisa mengelola RAB, Rembes, Cashbon
- Bisa melihat laporan keuangan
- BISA mengatur kehadiran (edit, hapus, rekap absensi semua karyawan)

### ADMIN
- Menu sidebar: Beranda, Portfolio, RAB, Keuangan, Absensi (read-only)
- Bisa mengelola portfolio (upload, edit, hapus, publish/draft)
- Bisa mengelola RAB (buat, edit, hapus RAB, Rembes, Cashbon)
- Bisa melihat laporan keuangan (read-only)
- BISA MELIHAT REKAP ABSENSI SAJA — tidak bisa edit atau hapus absensi
- TIDAK bisa mengelola user

### STAFF (dulu "user")
- Tidak ada sidebar admin
- Halaman tunggal: absensi (check-in/check-out)
- Bisa melihat riwayat absensi sendiri
- Bisa melihat kalender absensi sendiri
- TIDAK bisa akses halaman admin manapun
- TIDAK bisa mengelola apapun

## 6. IMPLEMENTASI ROLE GUARD
Di frontend (Vue Router):
```javascript
// Route guard untuk role-based access
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }
  
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return next('/')  // Redirect ke halaman utama jika role tidak sesuai
  }
  
  next()
})

// Routes dengan role protection
const routes = [
  // Public routes (semua bisa akses)
  { path: '/', component: LandingView },
  { path: '/login', component: LoginView },
  { path: '/portfolio', component: PortfolioView },
  
  // Admin routes (hanya super_admin & admin)
  { 
    path: '/admin', 
    component: DashboardView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/portfolio', 
    component: PortfolioManageView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/rab', 
    component: RabView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/financial', 
    component: FinancialView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  
  // Super Admin only
  { 
    path: '/admin/users', 
    component: UsersView, 
    meta: { requiresAuth: true, roles: ['super_admin'] } 
  },
  
  // Attendance - super_admin bisa edit, admin hanya read-only, staff hanya absen sendiri
  { 
    path: '/admin/attendance', 
    component: AttendanceManageView, 
    meta: { requiresAuth: true, roles: ['super_admin'] } 
  },
  { 
    path: '/admin/attendance/rekap', 
    component: AttendanceRekapView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  
  // Staff only
  { 
    path: '/absensi', 
    component: StaffAttendanceView, 
    meta: { requiresAuth: true, roles: ['staff'] } 
  },
]
```

Di backend (Node.js middleware):
```javascript
// Role middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Anda tidak memiliki akses ke fitur ini' })
    }
    next()
  }
}

// Contoh penggunaan di routes
router.get('/users', auth, authorize('super_admin'), userController.getAll)
router.get('/attendance', auth, authorize('super_admin', 'admin'), attendanceController.getRekap)
router.post('/attendance/checkin', auth, authorize('staff', 'admin', 'super_admin'), attendanceController.checkIn)
router.delete('/attendance/:id', auth, authorize('super_admin'), attendanceController.delete)
```

## 7. SIDEBAR DINAMIS (Berdasarkan Role)

```javascript
// Menu items berdasarkan role
const menuItems = computed(() => {
  const role = auth.role
  
  const items = [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin', roles: ['super_admin', 'admin'] },
    { label: 'Users', icon: 'Users', path: '/admin/users', roles: ['super_admin'] },
    { label: 'Portfolio', icon: 'Image', path: '/admin/portfolio', roles: ['super_admin', 'admin'] },
    { label: 'RAB / Anggaran', icon: 'Calculator', path: '/admin/rab', roles: ['super_admin', 'admin'] },
    { label: 'Keuangan', icon: 'BarChart', path: '/admin/financial', roles: ['super_admin', 'admin'] },
    { label: 'Absensi', icon: 'CalendarCheck', path: '/admin/attendance', roles: ['super_admin'] },
    { label: 'Rekap Absensi', icon: 'FileText', path: '/admin/attendance/rekap', roles: ['admin'] },
    { label: 'Pengaturan', icon: 'Settings', path: '/admin/settings', roles: ['super_admin'] },
  ]
  
  return items.filter(item => item.roles.includes(role))
})
```

## 8. RINGKASAN PERUBAHAN DATABASE
```sql
-- Ubah role enum
ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'staff') NOT NULL DEFAULT 'staff';

-- Hapus tabel office_supplies (tidak dipakai)
DROP TABLE IF EXISTS office_supplies;

-- Hapus cashbon foreign key yang mungkin mengacu ke users dengan role lama
-- (tidak perlu, hanya logic role yang berubah)

-- Update user yang ada, ubah role 'user' menjadi 'staff'
UPDATE users SET role = 'staff' WHERE role = 'user';
```

## 9. TESTING VALIDASI
- Staff login → harus langsung ke halaman /absensi, bukan /admin
- Admin login → sidebar harus hanya: Dashboard, Portfolio, RAB, Keuangan, Rekap Absensi
- Super Admin login → sidebar lengkap
- Staff coba akses /admin → harus redirect ke /absensi
- Admin coba akses /admin/users → harus 403 Forbidden
- Absensi dari luar 20m → harus gagal dengan pesan error
- Guest login → sudah tidak ada tombolnya

Langsung terapkan semua perubahan di atas!
```

---

## Cara Pakai
1. Generate dulu project utama dengan prompt sebelumnya
2. Setelah selesai, paste prompt tambahan ini ke Antigravity
3. Biarkan dia update semua kode sesuai perubahan
# KCM — Perubahan v2 (Login, Responsive, Absensi Admin, Dummy Data)
## Copy paste setelah prompt sebelumnya

---

## PROMPT TAMBAHAN v2

```
Terapkan perubahan berikut pada project KCM:

## 1. LOGIN — USERNAME SAJA (BUKAN EMAIL)
Ubah sistem login dari email → username.

### Database:
```sql
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE NOT NULL AFTER name;
```

### Backend API:
```javascript
// Login dengan username
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body
  const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username])
  if (users.length === 0) return res.status(401).json({ error: 'Username tidak ditemukan' })
  const user = users[0]
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Password salah' })
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, user: { id: user.id, name: user.name, username: user.username, role: user.role } })
})
```

### Frontend LoginView:
```html
<!-- Ganti email input jadi username -->
<div>
  <label>Username</label>
  <input v-model="form.username" type="text" placeholder="Masukkan username" />
</div>
<div>
  <label>Password</label>
  <input v-model="form.password" type="password" placeholder="Masukkan password" />
</div>
```

### Default users:
```sql
INSERT INTO users (name, username, password, role, department, status) VALUES
('Super Admin', 'superadmin', '$2a$10$hashedpassword', 'super_admin', 'Management', 'active'),
('Admin Utama', 'admin', '$2a$10$hashedpassword', 'admin', 'Project', 'active'),
('Budi Santoso', 'budi', '$2a$10$hashedpassword', 'staff', 'Desain', 'active'),
('Rina Wati', 'rina', '$2a$10$hashedpassword', 'staff', 'Project', 'active'),
('Ahmad Kurnia', 'ahmad', '$2a$10$hashedpassword', 'admin', 'Operasional', 'active');
```

## 2. RESPONSIVE DESIGN — FIX TOTAL
Fix semua halaman agar responsive di HP dan tablet.

### Tailwind breakpoints yang harus dipakai:
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (sm:)
- Desktop: > 1024px (lg:)

### Yang harus di-fix:

#### a) Login Page
- Mobile: Form full-width, gambar di belakang atau hilang
- Logo & form center
- Button full-width

#### b) Landing Page
- Mobile: Hero text center, image below
- Stats: 2x2 grid bukan 4 kolom
- Services: 1 kolom scrollable
- Portfolio: 2 kolom bukan 3
- Contact: Form full-width, alamat di bawah
- Footer: Single column

#### c) Admin Sidebar
- Desktop: Sidebar tetap di kiri (260px)
- Mobile: Sidebar jadi drawer (slide in/out), hamburger menu di topbar
- Toggle button: hamburger icon di pojok kiri atas

```html
<!-- Responsive Sidebar -->
<aside :class="[
  'fixed inset-y-0 left-0 z-50 bg-maroon transition-transform duration-300',
  isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
]">
  <!-- Menu items -->
</aside>

<!-- Overlay for mobile -->
<div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>

<!-- Topbar -->
<header class="lg:ml-[260px]">
  <button @click="isOpen = !isOpen" class="lg:hidden">
    <MenuIcon />
  </button>
</header>
```

#### d) Admin Dashboard & Tables
- Mobile: Cards stack vertically (1 kolom)
- Tables: Horizontal scroll atau card view
- Charts: Full-width

#### e) Admin Attendance Page (Kalender + Tabel)
- Mobile: Kalender full-width, tabel jadi card view
- Side panel: Below kalender bukan beside

#### f) User Attendance Page
- Tombol absensi besar dan center
- Ringkasan 3 kolom → 1 kolom di mobile
- Kalender heatmap scrollable horizontal
- Riwayat jadi card bukan tabel

### CSS Tambahan:
```css
/* Safe area untuk iPhone (notch) */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Prevent horizontal scroll */
body {
  overflow-x: hidden;
}

/* Touch-friendly buttons (min 44px) */
button, a, input[type="submit"] {
  min-height: 44px;
}

/* Smooth scroll on mobile */
@media (max-width: 1024px) {
  html {
    scroll-behavior: smooth;
  }
}
```

## 3. HALAMAN ATTENDANCE ADMIN — BUAT DARI AWAL
Halaman admin untuk melihat rekap absensi belum ada. Buat sekarang.

### Route: /admin/attendance/rekap
### Hanya untuk: admin & super_admin

### Isi halaman:

#### Header:
- Judul "Rekap Absensi"
- Filter: date range picker (dari - sampai), dropdown karyawan, tombol "Export Excel"
- 4 Summary cards: Hadir, Tidak Hadir, Terlambat, Cuti

#### Tab View: Kalender / Tabel

**Kalender View:**
- Kalender bulanan, 7 kolom (Sen-Ming)
- Setiap hari: tanggal + dot warna per karyawan
  - Hijau = hadir
  - Merah = tidak hadir
  - Kuning = terlambat
  - Abu = libur
- Klik hari → panel samping muncul detail karyawan hari itu

**Tabel View:**
- Kolom: Tanggal, Karyawan, Jam Masuk, Jam Keluar, Durasi, Jarak, Lokasi, Status
- Status badge: Hijau "Di Kantor", Kuning "Remote", Merah "Tidak Hadir"
- Search & filter di atas tabel
- Pagination

#### Detail Modal:
- Klik baris → modal muncul
- Nama karyawan, foto, ringkasan bulanan
- Daftar absensi bulan ini

### Backend API:
```javascript
// GET /api/attendance/rekap — admin bisa lihat semua
router.get('/attendance/rekap', auth, authorize('super_admin', 'admin'), async (req, res) => {
  const { start, end, user_id } = req.query
  let query = `SELECT a.*, u.name, u.department 
               FROM attendance a 
               JOIN users u ON a.user_id = u.id 
               WHERE a.date BETWEEN ? AND ?`
  const params = [start, end]
  if (user_id) { query += ' AND a.user_id = ?'; params.push(user_id) }
  query += ' ORDER BY a.date DESC, a.check_in DESC'
  const [rows] = await db.query(query, params)
  res.json(rows)
})

// PUT /api/attendance/:id — hanya super_admin bisa edit
router.put('/attendance/:id', auth, authorize('super_admin'), async (req, res) => {
  const { check_in, check_out, status, notes } = req.body
  await db.query('UPDATE attendance SET check_in=?, check_out=?, status=? WHERE id=?',
    [check_in, check_out, status, req.params.id])
  res.json({ message: 'Absensi diupdate' })
})

// DELETE /api/attendance/:id — hanya super_admin
router.delete('/attendance/:id', auth, authorize('super_admin'), async (req, res) => {
  await db.query('DELETE FROM attendance WHERE id=?', [req.params.id])
  res.json({ message: 'Absensi dihapus' })
})
```

## 4. DUMMY DATA — SEED SEMUA TABEL
Masukkan data dummy realistis ke database. Jalankan script SQL berikut:

```sql
USE kcm_database;

-- ==========================================
-- USERS (5 users)
-- Password semua: password123 (hashed bcrypt)
-- ==========================================
INSERT INTO users (name, username, password, phone, role, department, status) VALUES
('Ahmad Kurnia', 'superadmin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '085868000012', 'super_admin', 'Management', 'active'),
('Rina Wati', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '081234567890', 'admin', 'Project', 'active'),
('Budi Santoso', 'budi', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '085712345678', 'staff', 'Desain', 'active'),
('Dewi Lestari', 'dewi', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '082134567891', 'staff', 'Desain', 'active'),
('Eko Prasetyo', 'eko', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '083456789012', 'staff', 'Proyek', 'active');

-- ==========================================
-- PORTFOLIO (8 proyek)
-- ==========================================
INSERT INTO portfolio (title, category, description, client_name, location, year, images, status) VALUES
('Villa Modern Jogja', 'residential', 'Desain interior modern minimalis untuk villa di Sleman. Menggunakan material kayu jati dan batu alam.', 'Budi Hartono', 'Sleman, Yogyakarta', 2024, '["villa1.jpg", "villa2.jpg"]', 'published'),
('Kantor Startup Tech', 'office', 'Renovasi kantor startup dengan konsep open space. Warna dominan putih dengan aksen kayu.', 'PT Tech Indonesia', 'Jakarta Selatan', 2024, '["office1.jpg"]', 'published'),
('Hotel Heritage Jogja', 'hotel', 'Redesain lobby dan 20 kamar hotel heritage bergaya Jawa modern.', 'Hotel Tugu', 'Malioboro, Yogyakarta', 2023, '["hotel1.jpg", "hotel2.jpg"]', 'published'),
('Kost Eksklusif Mahasiswa', 'kost', 'Pembangunan 15 unit kost eksklusif dengan furnished lengkap.', 'Andi Wijaya', 'Universitas Sanata Dharma', 2024, '["kost1.jpg"]', 'published'),
('RS Mitra Keluarga', 'rumah_sakit', 'Renovasi ruang tunggu dan 5 ruang rawat inap dengan desain healing environment.', 'RS Mitra Keluarga', 'Sleman, Yogyakarta', 2023, '["rs1.jpg", "rs2.jpg"]', 'published'),
('Rumah Minimalis 2 Lantai', 'residential', 'Desain interior lengkap rumah 120m2 2 lantai. Gaya Scandinavian modern.', 'Keluarga Raharjo', 'Bantul, Yogyakarta', 2024, '["rumah1.jpg"]', 'published'),
('Co-working Space KCM', 'office', 'Desain co-working space untuk komunitas kreatif. Industrial style dengan exposed brick.', 'Komunitas Kreatif Jogja', 'Tugu, Yogyakarta', 2024, '["cowork1.jpg", "cowork2.jpg"]', 'published'),
('Restoran Padang Modern', 'hotel', 'Renovasi restoran Padang dengan konsep modern tradisional.', 'RM Sederhana', 'Gejayan, Yogyakarta', 2023, '["resto1.jpg"]', 'draft');

-- ==========================================
-- RAB (4 Rencana Anggaran)
-- ==========================================
INSERT INTO rab (code, project_name, client, date, status, total_budget, created_by) VALUES
('KCM-RAB-2025-001', 'Villa Modern Jogja', 'Budi Hartono', '2025-01-15', 'selesai', 850000000, 1),
('KCM-RAB-2025-002', 'Kantor Startup Tech', 'PT Tech Indonesia', '2025-02-20', 'dikerjakan', 450000000, 1),
('KCM-RAB-2025-003', 'Kost Eksklusif Mahasiswa', 'Andi Wijaya', '2025-03-10', 'dikerjakan', 620000000, 1),
('KCM-RAB-2025-004', 'Rumah Minimalis 2 Lantai', 'Keluarga Raharjo', '2025-04-01', 'draft', 380000000, 1);

-- ==========================================
-- RAB ITEMS (per RAB)
-- ==========================================
-- RAB 1: Villa Modern
INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES
(1, 'bahan', 'Cat Tembok Dulux', 'Cat tembok premium warna putih', 'kg', 150, 85000),
(1, 'bahan', 'Keramik Lantai 60x60', 'Keramik granit motif marble', 'm2', 200, 175000),
(1, 'bahan', 'Panel Gypsum', 'Plafon gypsum 9mm', 'm2', 180, 85000),
(1, 'bahan', 'Kayu Jati Jepara', 'Pintu & furniture kayu jati', 'm3', 2.5, 45000000),
(1, 'bahan', 'Batu Alam Andesit', 'Wall cladding batu alam', 'm2', 45, 350000),
(1, 'pekerjaan', 'Tukang Bangunan', 'Upah tukang harian', 'hari', 120, 350000),
(1, 'pekerjaan', 'Tukang Kayu', 'Spesialis furniture custom', 'hari', 80, 400000),
(1, 'pekerjaan', 'Instalasi Listrik', 'Pekerjaan instalasi kabel & lampu', 'point', 25, 250000),
(1, 'pekerjaan', 'Plumbing', 'Instalasi air bersih & kotor', 'point', 15, 300000),
(1, 'perlengkapan', 'Lampu LED Downlight', 'Lampu LED 12W', 'pcs', 40, 125000),
(1, 'perlengkapan', 'Stop Kontak', 'Stop kontak Panasonic', 'pcs', 30, 45000),
(1, 'perlengkapan', 'Kran Air', 'Kran shower& wastafel', 'pcs', 8, 350000);

-- RAB 2: Kantor Startup
INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES
(2, 'bahan', 'Cat Tembok Nippon', 'Cat anti bakteri warna white', 'kg', 80, 95000),
(2, 'bahan', 'Vinyl Lantai', 'Vinyl plank wood pattern', 'm2', 150, 125000),
(2, 'bahan', 'Partisi Kaca', 'Partisi tempered glass 10mm', 'm2', 40, 850000),
(2, 'pekerjaan', 'Tukang Bangunan', 'Renovasi & finishing', 'hari', 60, 350000),
(2, 'pekerjaan', 'Instalasi Listrik', 'Kabel LAN & power outlet', 'point', 40, 200000),
(2, 'perlengkapan', 'Meja Kerja', 'Meja standing desk elektrik', 'pcs', 15, 2500000),
(2, 'perlengkapan', 'Kursi Ergonomis', 'Kursi kerja ergonomic', 'pcs', 15, 1800000);

-- RAB 3: Kost Eksklusif
INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES
(3, 'bahan', 'Cat Tembok', 'Cat tembok washable', 'kg', 200, 75000),
(3, 'bahan', 'Keramik Lantai', 'Keramik 40x40', 'm2', 300, 95000),
(3, 'bahan', 'Besi Beton', 'Beton tulangan 10mm', 'kg', 500, 14000),
(3, 'pekerjaan', 'Tukang Bangunan', 'Pembangunan 15 unit', 'hari', 200, 300000),
(3, 'pekerjaan', 'Tukang Kayu', 'Furniture built-in', 'hari', 50, 380000),
(3, 'perlengkapan', 'Spring Bed Single', 'Kasur 90x200', 'pcs', 15, 850000),
(3, 'perlengkapan', 'Lemari Pakaian', 'Lemari 2 pintu', 'pcs', 15, 750000);

-- RAB 4: Rumah Minimalis (draft)
INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES
(4, 'bahan', 'Cat Tembok', 'Cat premium putih susu', 'kg', 100, 85000),
(4, 'bahan', 'Lantai Parket', 'Parket vinyl anti air', 'm2', 120, 165000),
(4, 'pekerjaan', 'Tukang Interior', 'Pemasangan semua furniture', 'hari', 45, 350000);

-- ==========================================
-- REMBES (Leakage Tracking)
-- ==========================================
INSERT INTO rembes (rab_id, date, description, rab_amount, actual_amount, notes, status) VALUES
(1, '2025-03-15', 'Kayu Jati naik harga', 112500000, 125000000, 'Supplier naikkan harga 11%', 'melebihi'),
(1, '2025-04-01', 'Pekerjaan tambah 10 hari', 42000000, 45500000, 'Keterlambatan material', 'waspada'),
(2, '2025-04-10', 'Partisi kaca lebih mahal', 34000000, 36000000, 'Desain berubah sedikit', 'waspada'),
(2, '2025-04-20', 'Meja standing desk', 37500000, 37500000, 'Sesuai anggaran', 'aman'),
(3, '2025-05-01', 'Besi beton naik', 7000000, 7350000, 'Harga material naik 5%', 'aman');

-- ==========================================
-- CASHBON (5 cashbon)
-- ==========================================
INSERT INTO cashbon (user_id, date, recipient, description, amount, status, notes) VALUES
(1, '2025-04-05', 'Toko Bangunan Jaya', 'Pembelian cat & keramik villa', 25000000, 'approved', 'Cashbon proyek villa'),
(2, '2025-04-10', 'Supplier Partisi', 'DP partisi kaca kantor', 15000000, 'approved', 'DP 50% partisi'),
(3, '2025-04-15', 'Toko Mebel', 'Pembelian meja kerja', 18000000, 'pending', 'Menunggu approval'),
(1, '2025-05-01', 'Kurir Material', 'Ongkos kirim material', 2500000, 'approved', 'Ongkir villa Jogja'),
(2, '2025-05-10', 'Toko Elektronik', 'Pembelian lampu LED', 5000000, 'rejected', 'Melebihi budget');

-- ==========================================
-- ATTENDANCE (absensi 2 minggu terakhir)
-- ==========================================
INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date) VALUES
-- Minggu ini
(3, '2025-06-23 08:02:00', '2025-06-23 17:05:00', -7.7326, 110.3988, 5.2, 'di_kantor', '192.168.100.50', '2025-06-23'),
(4, '2025-06-23 07:58:00', '2025-06-23 17:10:00', -7.7325, 110.3987, 8.1, 'di_kantor', '192.168.100.51', '2025-06-23'),
(5, '2025-06-23 08:30:00', '2025-06-23 17:02:00', -7.7327, 110.3989, 12.3, 'di_kantor', '192.168.100.52', '2025-06-23'),
(3, '2025-06-24 08:05:00', '2025-06-24 17:00:00', -7.7326, 110.3988, 3.5, 'di_kantor', '192.168.100.50', '2025-06-24'),
(4, '2025-06-24 08:15:00', '2025-06-24 17:30:00', -7.7330, 110.3990, 48.7, 'luar_kantor', '192.168.100.51', '2025-06-24'),
(5, '2025-06-24 07:55:00', '2025-06-24 16:58:00', -7.7326, 110.3988, 2.1, 'di_kantor', '192.168.100.52', '2025-06-24'),
-- Minggu lalu
(3, '2025-06-16 08:00:00', '2025-06-16 17:00:00', -7.7326, 110.3988, 4.0, 'di_kantor', '192.168.100.50', '2025-06-16'),
(4, '2025-06-16 08:10:00', '2025-06-16 17:15:00', -7.7325, 110.3987, 7.5, 'di_kantor', '192.168.100.51', '2025-06-16'),
(5, NULL, NULL, NULL, NULL, NULL, 'luar_kantor', NULL, '2025-06-16'),  -- Tidak hadir
(3, '2025-06-17 08:02:00', '2025-06-17 17:05:00', -7.7326, 110.3988, 5.0, 'di_kantor', '192.168.100.50', '2025-06-17'),
(4, '2025-06-17 08:05:00', '2025-06-17 17:10:00', -7.7325, 110.3987, 9.0, 'di_kantor', '192.168.100.51', '2025-06-17'),
(5, '2025-06-17 07:50:00', '2025-06-17 16:55:00', -7.7326, 110.3988, 3.0, 'di_kantor', '192.168.100.52', '2025-06-17'),
(3, '2025-06-18 08:08:00', '2025-06-18 17:02:00', -7.7326, 110.3988, 6.2, 'di_kantor', '192.168.100.50', '2025-06-18'),
(4, '2025-06-18 08:20:00', '2025-06-18 17:20:00', -7.7328, 110.3989, 25.3, 'luar_kantor', '192.168.100.51', '2025-06-18'),
(5, '2025-06-18 08:00:00', '2025-06-18 17:00:00', -7.7326, 110.3988, 4.5, 'di_kantor', '192.168.100.52', '2025-06-18'),
(3, '2025-06-19 07:55:00', '2025-06-19 16:50:00', -7.7326, 110.3988, 3.8, 'di_kantor', '192.168.100.50', '2025-06-19'),
(4, '2025-06-19 08:02:00', '2025-06-19 17:05:00', -7.7325, 110.3987, 7.0, 'di_kantor', '192.168.100.51', '2025-06-19'),
(5, '2025-06-19 08:12:00', '2025-06-19 17:12:00', -7.7327, 110.3989, 15.0, 'di_kantor', '192.168.100.52', '2025-06-19'),
(3, '2025-06-20 08:00:00', '2025-06-20 17:00:00', -7.7326, 110.3988, 5.5, 'di_kantor', '192.168.100.50', '2025-06-20'),
(4, '2025-06-20 08:30:00', '2025-06-20 17:30:00', -7.7330, 110.3990, 52.0, 'luar_kantor', '192.168.100.51', '2025-06-20'),
(5, '2025-06-20 07:58:00', '2025-06-20 16:58:00', -7.7326, 110.3988, 2.8, 'di_kantor', '192.168.100.52', '2025-06-20');

-- ==========================================
-- FINANCIAL REPORTS (6 bulan)
-- ==========================================
INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES
('2025-01', 150000000, 98000000, 72.5),
('2025-02', 180000000, 120000000, 75.0),
('2025-03', 220000000, 165000000, 78.3),
('2025-04', 195000000, 140000000, 76.8),
('2025-05', 250000000, 185000000, 82.1),
('2025-06', 280000000, 195000000, 79.5);
```

## 5. AKUN DEFAULT (Login)
Buat script seeder yang jalan otomatis pertama kali server start:

```javascript
// server/database/seed.js
const bcrypt = require('bcryptjs')
const db = require('../config/db')

async function seed() {
  const [existing] = await db.query('SELECT COUNT(*) as count FROM users')
  if (existing[0].count > 0) return console.log('Database sudah terisi, skip seeding')
  
  console.log('Seeding database...')
  const hash = await bcrypt.hash('password123', 10)
  
  await db.query(`
    INSERT INTO users (name, username, password, phone, role, department, status) VALUES
    ('Ahmad Kurnia', 'superadmin', ?, '085868000012', 'super_admin', 'Management', 'active'),
    ('Rina Wati', 'admin', ?, '081234567890', 'admin', 'Project', 'active'),
    ('Budi Santoso', 'budi', ?, '085712345678', 'staff', 'Desain', 'active'),
    ('Dewi Lestari', 'dewi', ?, '082134567891', 'staff', 'Desain', 'active'),
    ('Eko Prasetyo', 'eko', ?, '083456789012', 'staff', 'Proyek', 'active')
  `, [hash, hash, hash, hash, hash])
  
  console.log('✓ 5 users berhasil ditambahkan')
  console.log('✓ Default login: superadmin/password123')
}

module.exports = seed
```

## AKUN DEFAULT
| Username | Password | Role |
|----------|----------|------|
| superadmin | password123 | Super Admin |
| admin | password123 | Admin |
| budi | password123 | Staff |
| dewi | password123 | Staff |
| eko | password123 | Staff |

## RINGKASAN PERUBAHAN v2
1. ✅ Login pakai username (bukan email)
2. ✅ Responsive total (HP, tablet, desktop)
3. ✅ Halaman rekap absensi admin dibuat
4. ✅ Sidebar responsive (drawer di mobile)
5. ✅ Dummy data lengkap (5 users, 8 portfolio, 4 RAB, 5 rembes, 5 cashbon, 20+ absensi, 6 laporan keuangan)
6. ✅ Seeder otomatis (jalan pertama kali server start)

Langsung terapkan semua perubahan!
```

---

## Cara Pakai
1. Generate project utama dengan prompt pertama
2. Update dengan prompt perubahan v1 (role, gps, hapus guest)
3. Update dengan prompt v2 ini (login, responsive, dummy data)
