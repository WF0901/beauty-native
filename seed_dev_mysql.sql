USE beauty_mvp;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE operation_log;
TRUNCATE TABLE service_order;
TRUNCATE TABLE service_item;
TRUNCATE TABLE customer;
TRUNCATE TABLE staff;
TRUNCATE TABLE store;
TRUNCATE TABLE merchant;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO merchant (
  id,
  name,
  contact_name,
  contact_phone,
  package_start,
  package_end,
  status
) VALUES (
  1,
  '有赞测试美容',
  '张三',
  '13800001111',
  '2026-08-01 00:00:00',
  '2026-12-31 23:59:59',
  'active'
);

INSERT INTO store (
  id,
  merchant_id,
  name,
  address,
  phone,
  business_hours
) VALUES (
  1,
  1,
  '杭州西湖店',
  '杭州市西湖区文三路100号',
  '0571-88881234',
  JSON_OBJECT(
    'monday', '09:00-21:00',
    'tuesday', '09:00-21:00',
    'wednesday', '09:00-21:00',
    'thursday', '09:00-21:00',
    'friday', '09:00-21:00',
    'saturday', '09:00-21:00',
    'sunday', '09:00-21:00'
  )
);

INSERT INTO staff (
  id,
  merchant_id,
  store_id,
  name,
  phone,
  role,
  password_hash,
  is_active
) VALUES
-- password_hash 为开发占位值；后端框架确定后，用 BCrypt 重新生成 123456 的真实哈希。
(
  1,
  1,
  1,
  '李店长',
  '13900002222',
  'admin',
  '$2b$10$KYVbZ5JFVfqu0oV98LnF5eTk4QTe2e4PQG7QNYfhumEpGdi/867AO',
  1
),
(
  2,
  1,
  1,
  '王技师',
  '13700003333',
  'technician',
  '$2b$10$KYVbZ5JFVfqu0oV98LnF5eTk4QTe2e4PQG7QNYfhumEpGdi/867AO',
  1
);

INSERT INTO customer (
  id,
  merchant_id,
  home_store_id,
  name,
  phone,
  gender,
  total_spent,
  last_visit_at
) VALUES (
  1,
  1,
  1,
  '赵女士',
  '13600004444',
  'female',
  0,
  NULL
);

INSERT INTO service_item (
  id,
  merchant_id,
  store_id,
  name,
  price,
  duration_minutes,
  image_url,
  is_online
) VALUES
(
  1,
  1,
  1,
  '面部深层清洁',
  12800,
  60,
  'https://example.com/images/face_clean.jpg',
  1
),
(
  2,
  1,
  1,
  '肩颈舒缓推拿',
  16800,
  90,
  'https://example.com/images/neck_massage.jpg',
  1
);

INSERT INTO service_order (
  id,
  merchant_id,
  store_id,
  customer_id,
  service_item_id,
  technician_id,
  appointment_start_at,
  appointment_end_at,
  status,
  payment_status,
  source,
  payment_method,
  total_amount,
  paid_amount,
  discount_amount,
  remark
) VALUES (
  1,
  1,
  1,
  1,
  1,
  2,
  '2026-08-14 10:00:00',
  '2026-08-14 11:00:00',
  'pending',
  'unpaid',
  'mini_program',
  'offline',
  12800,
  0,
  0,
  '顾客对酒精过敏，请使用无酒精产品'
);

INSERT INTO operation_log (
  merchant_id,
  service_order_id,
  operator_staff_id,
  action,
  old_value,
  new_value
) VALUES (
  1,
  1,
  1,
  'create',
  NULL,
  JSON_OBJECT('status', 'pending', 'source', 'mini_program')
);
