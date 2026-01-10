# Schema: Chat Messages
# Descripción: Mensajes individuales de conversaciones
# Uso: Historial detallado de chats con LLM

CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    media_url TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER,
    metadata TEXT,
    
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON chat_messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON chat_messages(timestamp);
