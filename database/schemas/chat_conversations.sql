# Schema: Chat Conversations
# Descripción: Conversaciones del chatbot con clientes
# Uso: Historial y estado de conversaciones en WhatsApp

CREATE TABLE IF NOT EXISTS chat_conversations (
    id TEXT PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    customer_id TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_message_at DATETIME,
    message_count INTEGER DEFAULT 0,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_conversations_phone ON chat_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON chat_conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON chat_conversations(last_message_at);
