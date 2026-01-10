# Schema: Admin Conversations
# Descripción: Conversaciones del chatbot administrativo
# Uso: Chat entre admin y IA dentro del panel

CREATE TABLE IF NOT EXISTS admin_conversations (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    conversation_data TEXT NOT NULL,
    system_prompt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_admin_conversations_admin ON admin_conversations(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_conversations_created ON admin_conversations(created_at);
