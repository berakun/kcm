-- Salary settings tables for KCM
-- Replaces localStorage with persistent DB storage

CREATE TABLE IF NOT EXISTS salary_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_key VARCHAR(32) NOT NULL UNIQUE COMMENT 'super_admin, admin, staff, _rates',
  gaji_pokok INT DEFAULT 0,
  makan_transport INT DEFAULT 0,
  tunjangan_kesehatan INT DEFAULT 0,
  tunjangan_jabatan INT DEFAULT 0,
  tunjangan_hari_raya INT DEFAULT 0,
  -- rates fields (only used for role_key = '_rates')
  lembur_jam INT DEFAULT 0,
  lembur_hari INT DEFAULT 0,
  libur_per_hari INT DEFAULT 0,
  terlambat INT DEFAULT 0,
  absen_setengah INT DEFAULT 0,
  tidak_hadir INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT DEFAULT NULL COMMENT 'user_id who last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS employee_salary_overrides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  gaji_pokok INT DEFAULT NULL COMMENT 'NULL = use role default',
  makan_transport INT DEFAULT NULL,
  cuti INT DEFAULT NULL,
  libur_tahunan INT DEFAULT NULL,
  tunjangan_kesehatan INT DEFAULT NULL,
  tunjangan_jabatan INT DEFAULT NULL,
  tunjangan_hari_raya INT DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT DEFAULT NULL COMMENT 'user_id who last updated',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default salary settings
INSERT INTO salary_settings (role_key, gaji_pokok, makan_transport, tunjangan_kesehatan, tunjangan_jabatan, tunjangan_hari_raya, lembur_jam, lembur_hari, libur_per_hari, terlambat, absen_setengah, tidak_hadir) VALUES
('super_admin', 4500000, 800000, 0, 0, 0, 0, 0, 25000, 5000, 40000, 80000),
('admin',       3500000, 700000, 0, 0, 0, 0, 0, 25000, 5000, 40000, 80000),
('staff',       2500000, 625000, 0, 0, 0, 0, 0, 25000, 5000, 40000, 80000),
('_rates',      0,       0,      0, 0, 0, 0, 0, 25000, 5000, 40000, 80000)
ON DUPLICATE KEY UPDATE role_key = role_key;
