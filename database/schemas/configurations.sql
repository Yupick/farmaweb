# Schema: Configurations
# Descripción: Almacena configuraciones del sistema
# Uso: Temas, API keys, configuraciones de servicios

CREATE TABLE IF NOT EXISTS configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    group_name VARCHAR(100),
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    data_type VARCHAR(50) DEFAULT 'string',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_config_key ON configurations(key);
CREATE INDEX IF NOT EXISTS idx_config_group ON configurations(group_name);

-- Configuraciones iniciales
INSERT OR IGNORE INTO configurations (key, value, group_name, description, data_type) VALUES
('theme.current', 'default', 'theme', 'Tema activo de la landing page', 'string'),
('pharmacy.name', 'Farmacia Científica Malvinas', 'pharmacy', 'Nombre de la farmacia', 'string'),
('pharmacy.phone', '+54 9 XXXXXXXXX', 'pharmacy', 'Teléfono de contacto', 'string'),
('pharmacy.email', 'info@farmamalvinas.com', 'pharmacy', 'Email de contacto', 'string'),
('pharmacy.address', '', 'pharmacy', 'Dirección física', 'string'),
('pharmacy.city', '', 'pharmacy', 'Ciudad', 'string'),
('pharmacy.state', '', 'pharmacy', 'Provincia/Estado', 'string'),
('llm.provider', 'groq', 'llm', 'Proveedor de LLM (groq u openai)', 'string'),
('llm.model', 'mixtral-8x7b-32768', 'llm', 'Modelo a utilizar', 'string'),
('llm.apiKey', '', 'llm', 'API Key del proveedor LLM', 'string'),
('whatsapp.enabled', 'false', 'whatsapp', 'Habilitar integración WhatsApp', 'boolean'),
('whatsapp.businessAccountId', '', 'whatsapp', 'ID de cuenta de negocio WhatsApp', 'string'),
('whatsapp.accessToken', '', 'whatsapp', 'Access token de WhatsApp', 'string'),
('instagram.enabled', 'false', 'instagram', 'Habilitar integración Instagram', 'boolean'),
('instagram.businessAccountId', '', 'instagram', 'ID de cuenta de negocio Instagram', 'string'),
('instagram.accessToken', '', 'instagram', 'Access token de Instagram', 'string'),
('chatbot.systemPrompt', 'Eres un asistente de farmacia amable y útil. Ayuda a los clientes con información sobre medicamentos, horarios y ubicación.', 'chatbot', 'System prompt para el chatbot de WhatsApp', 'string'),
('chatbot.adminSystemPrompt', 'Eres un asistente administrativo para la farmacia. Ayuda al gerente a consultar datos del sistema y gestionar configuraciones.', 'chatbot', 'System prompt para el chatbot administrativo', 'string');
