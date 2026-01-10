# Schema: Roles
# Descripción: Define los roles disponibles en el sistema
# Uso: Asigna permisos y acceso a usuarios

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserciones iniciales
INSERT OR IGNORE INTO roles (name, description, permissions) VALUES 
(
    'admin',
    'Acceso total al sistema',
    '["all"]'
),
(
    'moderador',
    'Gestión de contenido',
    '["content:read", "content:create", "content:update", "content:delete", "users:read", "config:read"]'
),
(
    'usuario',
    'Solo lectura de contenido público',
    '["content:read"]'
);
