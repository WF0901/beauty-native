CREATE DATABASE IF NOT EXISTS beauty_mvp
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE beauty_mvp;

CREATE TABLE merchant (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(50) NULL,
  contact_phone VARCHAR(20) NULL,
  package_start DATETIME NULL,
  package_end DATETIME NULL,
  status ENUM('trial', 'active', 'expired', 'disabled') NOT NULL DEFAULT 'trial',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_merchant_status_package_end (status, package_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE store (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  merchant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  business_hours JSON NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_store_merchant (merchant_id),
  CONSTRAINT fk_store_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE staff (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  merchant_id BIGINT UNSIGNED NOT NULL,
  store_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role ENUM('admin', 'receptionist', 'technician') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_staff_merchant_phone (merchant_id, phone),
  KEY idx_staff_merchant_store_role (merchant_id, store_id, role),
  CONSTRAINT fk_staff_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant (id),
  CONSTRAINT fk_staff_store
    FOREIGN KEY (store_id) REFERENCES store (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE customer (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  merchant_id BIGINT UNSIGNED NOT NULL,
  home_store_id BIGINT UNSIGNED NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('unknown', 'female', 'male', 'other') NOT NULL DEFAULT 'unknown',
  total_spent BIGINT UNSIGNED NOT NULL DEFAULT 0,
  last_visit_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_customer_merchant_phone (merchant_id, phone),
  KEY idx_customer_merchant_name (merchant_id, name),
  KEY idx_customer_home_store (home_store_id),
  CONSTRAINT fk_customer_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant (id),
  CONSTRAINT fk_customer_home_store
    FOREIGN KEY (home_store_id) REFERENCES store (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE service_item (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  merchant_id BIGINT UNSIGNED NOT NULL,
  store_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  price BIGINT UNSIGNED NOT NULL DEFAULT 0,
  duration_minutes INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NULL,
  is_online TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_service_item_merchant_store_online (merchant_id, store_id, is_online),
  CONSTRAINT fk_service_item_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant (id),
  CONSTRAINT fk_service_item_store
    FOREIGN KEY (store_id) REFERENCES store (id),
  CONSTRAINT chk_service_item_duration
    CHECK (duration_minutes > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE service_order (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  merchant_id BIGINT UNSIGNED NOT NULL,
  store_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  service_item_id BIGINT UNSIGNED NOT NULL,
  technician_id BIGINT UNSIGNED NOT NULL,
  appointment_start_at DATETIME NOT NULL,
  appointment_end_at DATETIME NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  payment_status ENUM('unpaid', 'deposit_paid', 'paid') NOT NULL DEFAULT 'unpaid',
  source ENUM('mini_program', 'admin_manual') NOT NULL DEFAULT 'admin_manual',
  payment_method ENUM('offline', 'wechat', 'card', 'balance') NOT NULL DEFAULT 'offline',
  total_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  paid_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  discount_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  remark VARCHAR(500) NULL,
  cancelled_reason VARCHAR(500) NULL,
  verified_at DATETIME NULL,
  verified_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_calendar (merchant_id, store_id, appointment_start_at),
  KEY idx_order_customer (merchant_id, customer_id),
  KEY idx_order_status_time (merchant_id, status, appointment_start_at),
  KEY idx_order_technician_time (merchant_id, technician_id, appointment_start_at),
  KEY idx_order_verified_by (verified_by),
  CONSTRAINT fk_order_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant (id),
  CONSTRAINT fk_order_store
    FOREIGN KEY (store_id) REFERENCES store (id),
  CONSTRAINT fk_order_customer
    FOREIGN KEY (customer_id) REFERENCES customer (id),
  CONSTRAINT fk_order_service_item
    FOREIGN KEY (service_item_id) REFERENCES service_item (id),
  CONSTRAINT fk_order_technician
    FOREIGN KEY (technician_id) REFERENCES staff (id),
  CONSTRAINT fk_order_verified_by
    FOREIGN KEY (verified_by) REFERENCES staff (id),
  CONSTRAINT chk_order_time_range
    CHECK (appointment_end_at > appointment_start_at),
  CONSTRAINT chk_order_amount
    CHECK (total_amount >= paid_amount + discount_amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE operation_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  merchant_id BIGINT UNSIGNED NOT NULL,
  service_order_id BIGINT UNSIGNED NULL,
  operator_staff_id BIGINT UNSIGNED NULL,
  action ENUM('create', 'reschedule', 'cancel', 'verify') NOT NULL,
  old_value JSON NULL,
  new_value JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_log_merchant_order_time (merchant_id, service_order_id, created_at),
  KEY idx_log_operator_time (operator_staff_id, created_at),
  CONSTRAINT fk_log_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant (id),
  CONSTRAINT fk_log_service_order
    FOREIGN KEY (service_order_id) REFERENCES service_order (id),
  CONSTRAINT fk_log_operator_staff
    FOREIGN KEY (operator_staff_id) REFERENCES staff (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
