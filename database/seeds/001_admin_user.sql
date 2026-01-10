-- Seed: Insert initial admin user

-- Nota: La contraseña 'cientifica123' es hasheada con bcrypt
-- Hash generado con: bcrypt.hash('cientifica123', 10)
-- $2b$10$ubRZIOeTucj0q/Bxgw1c/.2RoeHj/aA8nGKozopNX9nSHyK5Ay4zG
-- IMPORTANTE: Cambiar contraseña en el primer acceso

INSERT OR IGNORE INTO users (id, email, password_hash, role_id, status, created_at, updated_at) 
VALUES (
    'admin-001',
    'admin@fciacientifica.com.ar',
    '$2b$10$ubRZIOeTucj0q/Bxgw1c/.2RoeHj/aA8nGKozopNX9nSHyK5Ay4zG', -- hash de cientifica123
    1, -- role_id = admin
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
