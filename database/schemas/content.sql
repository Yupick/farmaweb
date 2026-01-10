# Schema: Content
# Descripción: Contenido dinámico de la landing page
# Uso: Almacena hero, banners, imágenes destacadas, carruseles

CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    image_alt_text VARCHAR(255),
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata TEXT,
    created_by TEXT NOT NULL,
    updated_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_is_active ON content(is_active);
CREATE INDEX IF NOT EXISTS idx_content_position ON content(position);
CREATE INDEX IF NOT EXISTS idx_content_created_by ON content(created_by);
