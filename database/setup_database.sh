#!/bin/bash
# Script de inicialización de base de datos SQLite
# Uso: bash setup_database.sh

set -e

echo "🚀 Iniciando configuración de base de datos para Farmacia Científica Malvinas..."

DB_PATH="./database/farmaweb.db"
SCHEMAS_DIR="./database/schemas"
SEEDS_DIR="./database/seeds"

# Crear directorio si no existe
mkdir -p ./database

# Eliminar BD antigua si existe (comentar si quieres preservarla)
# rm -f "$DB_PATH"

echo "📁 Creando esquemas..."

# Ejecutar esquemas en orden
for schema in roles users configurations content customers chat_conversations chat_messages admin_conversations admin_audit_log products; do
    if [ -f "$SCHEMAS_DIR/${schema}.sql" ]; then
        echo "  ✓ Cargando $schema..."
        sqlite3 "$DB_PATH" < "$SCHEMAS_DIR/${schema}.sql"
    fi
done

echo "🌱 Insertando datos iniciales..."

# Ejecutar seeds en orden
for seed in 001_admin_user 002_configurations 003_pharmacy_info; do
    if [ -f "$SEEDS_DIR/${seed}.sql" ]; then
        echo "  ✓ Ejecutando $seed..."
        sqlite3 "$DB_PATH" < "$SEEDS_DIR/${seed}.sql"
    fi
done

echo "✅ Base de datos inicializada correctamente en $DB_PATH"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Copiar .env.example a .env"
echo "  2. Configurar variables de entorno"
echo "  3. Ejecutar: npm run dev"
echo ""
echo "🔑 Credenciales iniciales:"
echo "  Email: admin@fciacientifica.com.ar"
echo "  Contraseña: cientifica123"
echo ""
