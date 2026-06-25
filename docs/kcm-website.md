# Prompt Antigravity — Kurnia Cipta Mandiri (Vue + Node.js) v2
## Copy paste ke Antigravity (Gemini)

---

```
Buatkan website lengkap untuk perusahaan "Kurnia Cipta Mandiri" (KCM) menggunakan Vue.js 3 (frontend) dan Node.js/Express (backend) dengan MySQL database. Project disimpan di C:\laragon\www\kcm dengan UI design sebagai pedoman di C:\laragon\www\kcm\ui (baca semua file .html dan .png di folder ui untuk referensi design).

## TENTANG PERUSAHAAN
- Nama: Kurnia Cipta Mandiri (KCM)
- Slogan: "Ingin interior murah? KCM solusinya"
- Alamat: Jl. Kaliurang Jl. Candi Winangun km 12 No.24, Turen, Sardonoharjo, Kec. Ngaglik, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55581
- Telepon/WhatsApp: 085868000012
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

## STRUKTUR PROJECT
```
kcm/
├── docs/
│   ├── logo.png              (Logo KCM)
│   ├── kcm-logo.png
│   ├── kcm-perubahan.md
│   └── kcm-website.md
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
│   │   │   │   ├── AttendanceManageView.vue
│   │   │   │   └── AttendanceRekapView.vue
│   │   │   └── user/
│   │   │       └── StaffAttendanceView.vue
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
│   │   │   └── attendance/
│   │   │       ├── CheckInOutButton.vue
│   │   │       ├── GpsVerification.vue
│   │   │       ├── CalendarHeatmap.vue
│   │   │       └── AttendanceHistory.vue
│   │   │   └── rab/
│   │   │       ├── RabTable.vue
│   │   │       ├── RembesTable.vue
│   │   │       └── CashbonForm.vue
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
│   ├── .env                        (Environment Variables)
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
│   ├── utils/
│   │   ├── gps.js                  (Haversine formula)
│   │   ├── validators.js
│   │   └── helpers.js
│   └── database/
│       ├── schema.sql              (Database schema)
│       └── seed.js                 (Seeder script)
├── .gitignore
├── package.json                    (Root package for concurrently execution)
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

## DATABASE SCHEMA (schema.sql)

```sql
CREATE DATABASE IF NOT EXISTS kcm_database;
USE kcm_database;

-- Users table (tanpa kolom email, diganti dengan username)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('super_admin', 'admin', 'staff') DEFAULT 'staff',
    department VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    avatar VARCHAR(255),
    last_active DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
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
CREATE TABLE IF NOT EXISTS rab (
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
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- RAB Items
CREATE TABLE IF NOT EXISTS rab_items (
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
CREATE TABLE IF NOT EXISTS rembes (
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
CREATE TABLE IF NOT EXISTS cashbon (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    check_in DATETIME,
    check_out DATETIME,
    duration TIME,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    distance DECIMAL(10,2),
    status ENUM('di_kantor', 'luar_kantor') DEFAULT 'di_kantor',
    ip_address VARCHAR(45),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Financial Reports
CREATE TABLE IF NOT EXISTS financial_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    period VARCHAR(20),
    revenue DECIMAL(15,2) DEFAULT 0,
    expenses DECIMAL(15,2) DEFAULT 0,
    profit DECIMAL(15,2) GENERATED ALWAYS AS (revenue - expenses) STORED,
    utilization DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Office Settings (for GPS geofence settings)
CREATE TABLE IF NOT EXISTS office_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default office GPS coordinates (centered around KCM Yogyakarta: -7.7326, 110.3988)
INSERT INTO office_settings (setting_key, setting_value) VALUES
('office_latitude', '-7.7326'),
('office_longitude', '110.3988'),
('office_radius', '20')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
```

## SERVER ENVIRONMENT (.env)
```
PORT=3000
NODE_ENV=development

# Database Configuration (Remote STB Host)
DB_HOST=192.168.100.191
DB_PORT=3306
DB_USER=root
DB_PASS=qwerty123
DB_NAME=kcm_database

# JWT Settings
JWT_SECRET=kcm_super_secret_key_2024_change_this_in_production
JWT_EXPIRES_IN=24h

# GPS Office Location
OFFICE_LAT=-7.7326
OFFICE_LNG=110.3988
OFFICE_RADIUS=20

# Security Settings
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS Origin
CORS_ORIGIN=http://localhost:5173
```

## SECURITY YANG HARUS DITERAPKAN

### 1. Authentication & Authorization
- Password hashing menggunakan bcryptjs (10 rounds)
- JWT token untuk session management disimpan di localStorage
- Role-based access control (Super Admin, Admin, Staff)
- Middleware auth di seluruh protected routes

### 2. Input Validation & Protection
- Validasi input di backend (express-validator)
- Mencegah SQL injection dengan parameterized queries (mysql2/promise)
- Rate limiting 100 requests per 15 menit per IP (login dibatasi lebih ketat)

### 3. File Upload Security
- Validasi tipe file (hanya gambar: jpg, png, webp)
- Max file size: 5MB
- Rename file dengan string acak untuk mencegah path traversal.

## FITUR YANG HARUS DIBUAT

### 1. LOGIN (LoginView.vue)
- Login menggunakan username (bukan email). Form input username + password. JWT disimpan di localStorage.
- Role-based redirect (super_admin & admin → admin dashboard, staff → /absensi).

### 2. LANDING PAGE & PORTFOLIO VIEW
- Landing page memuat Hero Section dengan background gambar premium, Services KCM, masonry grid Portfolio preview, dan WhatsApp direct contact form.
- Portfolio showcase memuat filter kategori (residential, office, hotel, kost, rumah_sakit) dan modal lightbox.

### 3. ADMIN DASHBOARD & USER CRUD
- Dashboard overview menyajikan KPIs (total proyek, total RAB, kehadiran hari ini, dll.), grafik revenue vs expenses, and feed aktivitas terbaru.
- Halaman Users CRUD hanya untuk Super Admin (CRUD user dengan modal dialog). Role user dipetakan ke 'staff', 'admin', atau 'super_admin'.

### 4. RESPONSIVE DESIGN & SIDEBAR (DRAWER)
- Desain fully responsive di HP (<640px), tablet (640px - 1024px), dan desktop (>1024px).
- Pada tablet/mobile, Sidebar disembunyikan dalam drawer menu (slide in/out dengan overlay gelap).
- Menampilkan tombol hamburger menu di topbar mobile untuk memicu drawer sidebar.

### 5. RAB BUILDER (admin/RabView.vue)
- 3 Tabs saja: RAB/Anggaran Pokok (rincian bahan, pekerjaan, perlengkapan), Rembes (pelacakan selisih anggaran vs realisasi), dan Persetujuan Cashbon. Fitur Belanja Kantor/Office Supplies dihapus sepenuhnya.

### 6. FINANCIAL REPORTS & LEAKAGE TRACKER
- Laporan Keuangan memuat summary cards, revenue vs expenses monthly charts, profit margins, dan Leakage Tracker (rincian rembesan dengan status 'waspada' atau 'melebihi' anggaran).

### 7. ATTENDANCE MANAGEMENT (AttendanceManageView.vue)
- Super Admin saja. Menampilkan data presensi harian lengkap, bisa mengedit catatan check-in/out, dan menghapus log absensi.

### 8. REDESIGNED ATTENDANCE REKAP (AttendanceRekapView.vue)
- Admin & Super Admin. Dilengkapi Date Range Picker, Dropdown filter karyawan, 4 Summary Cards (Hadir, Terlambat, Tidak Hadir, Cuti), Tab View (Kalender Bulanan dengan dot kehadiran per karyawan / Tabel Detail), Panel Detail Harian di samping, dan tombol ekspor data ke Excel/CSV.

### 9. ABSENSI STAF (user/StaffAttendanceView.vue)
- Halaman tunggal untuk Staff. Tombol absensi check-in/out berbasis GPS geofence.
- Geofence Hard Block: Jika jarak GPS staff > 20 meter dari koordinat kantor, tombol absensi dinonaktifkan / memunculkan error: "Anda berada di luar radius kantor. Jarak Anda: X meter dari kantor".
- Dilengkapi tombol form Pengajuan Cashbon Lapangan dan riwayat absensi.

## DUMMY DATA SEEDER (seed.js)
Seed 5 akun default, 8 portfolio, 4 RAB beserta items, 5 data rembes, 5 cashbon, riwayat absensi 2 minggu terakhir, dan laporan keuangan 6 bulan terakhir.

### AKUN DEFAULT
| Username | Password | Role | Department |
|----------|----------|------|------------|
| superadmin | password123 | Super Admin | Management |
| admin | password123 | Admin | Project |
| budi | password123 | Staff | Desain |
| dewi | password123 | Staff | Desain |
| eko | password123 | Staff | Proyek |

```
Langsung terapkan semua fitur di atas!
```
