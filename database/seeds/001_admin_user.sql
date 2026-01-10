-- Seed: Insert initial admin user

-- Nota: La contraseña 'cientifica123' es hasheada con bcrypt
-- Hash generado con: bcrypt.hash('cientifica123', 10)
-- $2b$10$9mR4K8.8k8k8k8k8k8k8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8
-- IMPORTANTE: Cambiar contraseña en el primer acceso

INSERT OR IGNORE INTO users (id, email, password_hash, role_id, status, created_at, updated_at) 
VALUES (
    'admin-001',
    'admin@farmamalvinas.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeT5u8D7IceIVO', -- hash de cientifica123
    1, -- role_id = admin
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
