CREATE DATABASE IF NOT EXISTS kcm_database;
USE kcm_database;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS office_settings;
DROP TABLE IF EXISTS financial_reports;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS cashbon;
DROP TABLE IF EXISTS rembes;
DROP TABLE IF EXISTS rab_items;
DROP TABLE IF EXISTS rab;
DROP TABLE IF EXISTS portfolio;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
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

-- Office Settings
CREATE TABLE IF NOT EXISTS office_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    to_supplier VARCHAR(200),
    date DATE,
    phone VARCHAR(20),
    attn VARCHAR(100),
    rab_id INT,
    items JSON,
    projects TEXT,
    material_ref TEXT,
    total DECIMAL(15,2) DEFAULT 0,
    ppn DECIMAL(15,2) DEFAULT 0,
    grand_total DECIMAL(15,2) DEFAULT 0,
    in_words TEXT,
    note TEXT,
    deliver_by DATE,
    deliver_to VARCHAR(200),
    ordered_by VARCHAR(100),
    purchasing VARCHAR(100),
    prepared_by VARCHAR(100),
    approved_by VARCHAR(100) DEFAULT 'Anriko K, ST.',
    term_of_payment VARCHAR(200) DEFAULT 'Anriko K, ST.',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rab_id) REFERENCES rab(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default office GPS coordinates (from Google Maps link, centered around KCM Yogyakarta: -7.7326, 110.3988)
INSERT INTO office_settings (setting_key, setting_value) VALUES
('office_latitude', '-7.7326'),
('office_longitude', '110.3988'),
('office_radius', '20')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Insert default users
-- password is 'password123' (bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)
INSERT INTO users (name, username, password, role, department, status) VALUES
('Ahmad Kurnia', 'superadmin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'super_admin', 'Management', 'active'),
('Rina Wati', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'Project', 'active'),
('Budi Santoso', 'budi', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'staff', 'Desain', 'active'),
('Dewi Lestari', 'dewi', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'staff', 'Desain', 'active'),
('Eko Prasetyo', 'eko', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'staff', 'Proyek', 'active')
ON DUPLICATE KEY UPDATE name = VALUES(name);
