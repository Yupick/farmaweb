-- Migración: Agregar campos de display a tabla content
-- Descripción: Agregar columnas para controlar dónde se muestran las páginas (modal, footer, menu)

-- Agregar columnas de display si no existen
ALTER TABLE content ADD COLUMN IF NOT EXISTS data TEXT;
ALTER TABLE content ADD COLUMN IF NOT EXISTS display_modal BOOLEAN DEFAULT 0;
ALTER TABLE content ADD COLUMN IF NOT EXISTS display_footer BOOLEAN DEFAULT 0;
ALTER TABLE content ADD COLUMN IF NOT EXISTS display_menu BOOLEAN DEFAULT 0;

-- Crear índices para mejor rendimiento en queries de filtrado
CREATE INDEX IF NOT EXISTS idx_content_display_menu ON content(display_menu);
CREATE INDEX IF NOT EXISTS idx_content_display_footer ON content(display_footer);
CREATE INDEX IF NOT EXISTS idx_content_display_modal ON content(display_modal);
