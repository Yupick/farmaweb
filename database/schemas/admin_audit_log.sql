# Schema: Admin Audit Log
# Descripción: Log de todas las acciones administrativas
# Uso: Auditoría y compliance

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id TEXT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON admin_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON admin_audit_log(resource_type, resource_id);
