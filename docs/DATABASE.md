# 🗄️ DATABASE.md - Esquema de Base de Datos

**Versión:** 1.0  
**Última Actualización:** 10 de enero de 2026

---

## 📊 Diagrama ER (Entity Relationship)

```
┌──────────────────┐         ┌─────────────────────────┐
│     USERS        │         │      ROLES              │
├──────────────────┤         ├─────────────────────────┤
│ id (PK)          │───┐     │ id (PK)                 │
│ email            │   └──┬──│ name                    │
│ password_hash    │      │  │ permissions             │
│ role_id (FK)     │      │  │ created_at              │
│ status           │      │  │ updated_at              │
│ last_login       │      │  └─────────────────────────┘
│ created_at       │      │
│ updated_at       │      │
└──────────────────┘      │
         │                │
         └────────────────┘

┌──────────────────┐         ┌─────────────────────────┐
│     CONTENT      │         │   CONFIGURATIONS        │
├──────────────────┤         ├─────────────────────────┤
│ id (PK)          │         │ id (PK)                 │
│ type             │         │ key                     │
│ title            │         │ value                   │
│ description      │         │ group                   │
│ image_url        │         │ is_sensitive            │
│ position         │         │ created_at              │
│ is_active        │         │ updated_at              │
│ created_by (FK)  │         └─────────────────────────┘
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────────────┐  ┌─────────────────────────┐
│  CHAT_CONVERSATIONS      │  │    CHAT_MESSAGES        │
├──────────────────────────┤  ├─────────────────────────┤
│ id (PK)                  │  │ id (PK)                 │
│ phone_number             │  │ conversation_id (FK)    │
│ customer_id (FK)         │  │ sender                  │
│ status                   │  │ content                 │
│ last_message_at          │  │ timestamp               │
│ metadata                 │  │ type                    │
│ created_at               │  └─────────────────────────┘
│ updated_at               │
└──────────────────────────┘

┌──────────────────┐         ┌─────────────────────────┐
│    CUSTOMERS     │         │   ADMIN_CONVERSATIONS   │
├──────────────────┤         ├─────────────────────────┤
│ id (PK)          │         │ id (PK)                 │
│ phone_number     │         │ admin_id (FK)           │
│ name             │         │ conversation_data       │
│ email            │         │ created_at              │
│ address          │         │ updated_at              │
│ city             │         └─────────────────────────┘
│ state            │
│ created_at       │         ┌─────────────────────────┐
│ updated_at       │         │  ADMIN_AUDIT_LOG        │
└──────────────────┘         ├─────────────────────────┤
                             │ id (PK)                 │
                             │ admin_id (FK)           │
                             │ action                  │
                             │ resource                │
                             │ old_value               │
                             │ new_value               │
                             │ timestamp               │
                             └─────────────────────────┘
```

---

## 📋 Definición Detallada de Tablas

### 1. USERS (Usuarios del Sistema)

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- UUID
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,    -- bcrypt hash
    role_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active',    -- active, inactive, suspended
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
```

**Campos:**
- `id`: Identificador único (UUID v4)
- `email`: Correo electrónico único para login
- `password_hash`: Contraseña hasheada con bcrypt
- `role_id`: Referencia al rol del usuario
- `status`: Estado del usuario (activo/inactivo/suspendido)
- `last_login`: Última fecha de acceso
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

---

### 2. ROLES (Roles del Sistema)

```sql
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,       -- admin, moderador, usuario
    description TEXT,
    permissions TEXT,                       -- JSON array de permisos
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserciones iniciales
INSERT INTO roles (name, permissions) VALUES 
('admin', '["all"]'),
('moderador', '["content:read", "content:create", "content:update", "users:read"]'),
('usuario', '["content:read"]');
```

**Roles Predefinidos:**
- `admin`: Acceso total al sistema
- `moderador`: Gestión de contenido y lectura de usuarios
- `usuario`: Solo lectura de contenido público

---

### 3. CONTENT (Contenido de Landing Page)

```sql
CREATE TABLE content (
    id TEXT PRIMARY KEY,                    -- UUID
    type VARCHAR(100) NOT NULL,             -- hero, banner, featured, carousel
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    image_alt_text VARCHAR(255),
    position INTEGER DEFAULT 0,             -- Orden de visualización
    is_active BOOLEAN DEFAULT TRUE,
    metadata TEXT,                          -- JSON con datos adicionales
    created_by TEXT NOT NULL,
    updated_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_is_active ON content(is_active);
CREATE INDEX idx_content_position ON content(position);
```

**Tipos de Contenido:**
- `hero`: Encabezado principal
- `banner`: Banner configurable
- `featured`: Imagen destacada
- `carousel`: Items del carrusel
- `section`: Sección personalizada

---

### 4. CONFIGURATIONS (Configuraciones del Sistema)

```sql
CREATE TABLE configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,                             -- JSON para valores complejos
    group VARCHAR(100),                     -- llm, whatsapp, instagram, theme
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,     -- Para API keys
    data_type VARCHAR(50),                  -- string, json, number, boolean
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_config_key ON configurations(key);
CREATE INDEX idx_config_group ON configurations(group);
```

**Grupos de Configuración:**
- `llm`: Configuración de LLM (Groq/OpenAI)
- `whatsapp`: Configuración de WhatsApp
- `instagram`: Credenciales de Instagram
- `theme`: Tema activo de la landing page
- `pharmacy`: Información de la farmacia
- `chatbot`: System prompts y configuraciones

---

### 5. CHAT_CONVERSATIONS (Conversaciones del Chatbot)

```sql
CREATE TABLE chat_conversations (
    id TEXT PRIMARY KEY,                    -- UUID
    phone_number VARCHAR(20) NOT NULL,      -- +54 9 XXXXXXXXX
    customer_id TEXT,                       -- NULL si es primer contacto
    status VARCHAR(50) DEFAULT 'active',    -- active, closed, archived
    last_message_at DATETIME,
    message_count INTEGER DEFAULT 0,
    metadata TEXT,                          -- JSON (contexto, tema, etc)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Índices
CREATE INDEX idx_conversations_phone ON chat_conversations(phone_number);
CREATE INDEX idx_conversations_customer_id ON chat_conversations(customer_id);
CREATE INDEX idx_conversations_status ON chat_conversations(status);
CREATE INDEX idx_conversations_last_message ON chat_conversations(last_message_at);
```

---

### 6. CHAT_MESSAGES (Mensajes del Chatbot)

```sql
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY,                    -- UUID
    conversation_id TEXT NOT NULL,
    sender VARCHAR(50) NOT NULL,            -- user, bot, admin
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',-- text, image, document
    media_url TEXT,                         -- Para images/documents
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER,                    -- Para tracking de LLM
    metadata TEXT,                          -- JSON adicional
    
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
);

-- Índices
CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_messages_sender ON chat_messages(sender);
CREATE INDEX idx_messages_timestamp ON chat_messages(timestamp);
```

---

### 7. CUSTOMERS (Clientes/Pacientes)

```sql
CREATE TABLE customers (
    id TEXT PRIMARY KEY,                    -- UUID
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_contact_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(name);
```

---

### 8. ADMIN_CONVERSATIONS (Conversaciones del Chatbot Administrativo)

```sql
CREATE TABLE admin_conversations (
    id TEXT PRIMARY KEY,                    -- UUID
    admin_id TEXT NOT NULL,
    conversation_data TEXT NOT NULL,        -- JSON array de mensajes
    system_prompt TEXT,                     -- System prompt utilizado
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_admin_conversations_admin ON admin_conversations(admin_id);
```

---

### 9. ADMIN_AUDIT_LOG (Log de Auditoría de Administradores)

```sql
CREATE TABLE admin_audit_log (
    id TEXT PRIMARY KEY,                    -- UUID
    admin_id TEXT NOT NULL,
    action VARCHAR(100) NOT NULL,           -- create, update, delete, login, config_change
    resource_type VARCHAR(100),             -- user, content, config, chatbot
    resource_id TEXT,
    old_value TEXT,                         -- JSON de valores anteriores
    new_value TEXT,                         -- JSON de valores nuevos
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_action ON admin_audit_log(action);
CREATE INDEX idx_audit_timestamp ON admin_audit_log(timestamp);
CREATE INDEX idx_audit_resource ON admin_audit_log(resource_type, resource_id);
```

---

### 10. PRODUCTS (Preparación para Tienda - Fase 5)

```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,                    -- UUID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    category_id TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔑 Estrategia de Seguridad de BD

### Contraseña Inicial
```
Usuario: admin
Password: cientifica123

Hash (bcrypt):
$2b$10$9mR4K8.8k8k8k8k8k8k8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8
```

**Cambio Recomendado:** Primera entrada al sistema

### Campos Sensibles
- `password_hash`: Nunca exponerlo en API
- API keys en `configurations.is_sensitive = TRUE`
- Logs de auditoría inmutable

### Backups
- Diariamente
- Almacenamiento cifrado
- Retención mínimo 30 días

---

## 📈 Consideraciones de Escalabilidad

### Índices Estratégicos
- Búsquedas por email, phone, id
- Filtros por status, fecha
- Ordering por timestamp

### Particionamiento (Futuro)
```sql
-- Por año de conversaciones
PARTITION BY RANGE (YEAR(created_at))
```

### Migración a PostgreSQL
```
SQLite ➜ PostgreSQL
- UUID nativa
- JSON mejorado
- Mejor concurrencia
```

---

## 🔄 Relaciones y Constraints

```
users → roles (N:1)
users → content (1:N) [created_by, updated_by]
customers → chat_conversations (1:N)
chat_conversations → chat_messages (1:N)
users → chat_conversations (1:N) [indirect via customer lookup]
users → admin_conversations (1:N)
users → admin_audit_log (1:N)
```

---

## 📊 Ejemplo de Datos Iniciales

```sql
-- Usuario Admin
INSERT INTO users (id, email, password_hash, role_id, status)
VALUES (
    'uuid-admin-1',
    'admin@fciacientifica.com.ar',
    '$2b$10$...',  -- hash de cientifica123
    1,
    'active'
);

-- Rol Admin
INSERT INTO roles (name, permissions)
VALUES ('admin', '["all"]');

-- Configuraciones por defecto
INSERT INTO configurations (key, value, group)
VALUES 
    ('theme.current', '{"id":"default","name":"Light"}', 'theme'),
    ('pharmacy.name', 'Farmacia Científica Malvinas', 'pharmacy'),
    ('pharmacy.phone', '+54 9 XXXXXXXXX', 'pharmacy'),
    ('llm.provider', 'groq', 'llm'),
    ('whatsapp.enabled', 'false', 'whatsapp');
```

---

**Última Actualización:** 10 de enero de 2026

