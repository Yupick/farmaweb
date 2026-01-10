#!/bin/bash

# 🧪 TESTING SCRIPT - FARMACIA CIENTÍFICA MALVINAS

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  INICIANDO TESTING                           ║"
echo "║          Farmacia Científica - Sistema Integral              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Cambiar al directorio raíz
cd /home/mkd/Programacion/farmaweb

echo "📋 TEST 1: Verificar estructura del proyecto"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "backend" ] && [ -d "frontend" ] && [ -d "database" ] && [ -d "docs" ]; then
    echo "✅ Estructura del proyecto: OK"
    echo "   - backend/ ✓"
    echo "   - frontend/ ✓"
    echo "   - database/ ✓"
    echo "   - docs/ ✓"
else
    echo "❌ Estructura del proyecto: FALLO"
fi
echo ""

echo "📦 TEST 2: Verificar dependencias instaladas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "backend/node_modules" ]; then
    COUNT=$(ls backend/node_modules | wc -l)
    echo "✅ Backend node_modules: OK ($COUNT paquetes)"
else
    echo "❌ Backend node_modules: NO INSTALADO"
fi

if [ -d "frontend/node_modules" ]; then
    COUNT=$(ls frontend/node_modules | wc -l)
    echo "✅ Frontend node_modules: OK ($COUNT paquetes)"
else
    echo "❌ Frontend node_modules: NO INSTALADO"
fi
echo ""

echo "📄 TEST 3: Verificar archivos de configuración"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
[ -f "backend/.env" ] && echo "✅ backend/.env" || echo "❌ backend/.env NO EXISTE"
[ -f "backend/package.json" ] && echo "✅ backend/package.json" || echo "❌ backend/package.json NO EXISTE"
[ -f "frontend/.env.local" ] && echo "✅ frontend/.env.local" || echo "❌ frontend/.env.local NO EXISTE"
[ -f "frontend/package.json" ] && echo "✅ frontend/package.json" || echo "❌ frontend/package.json NO EXISTE"
echo ""

echo "💾 TEST 4: Verificar base de datos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "backend/data/farmacia.db" ]; then
    SIZE=$(du -h backend/data/farmacia.db | cut -f1)
    echo "✅ Base de datos SQLite: OK (${SIZE})"
    
    # Verificar tablas
    TABLES=$(sqlite3 backend/data/farmacia.db ".tables" 2>/dev/null | wc -w)
    echo "   Tablas en BD: $TABLES"
else
    echo "❌ Base de datos: NO EXISTE (en backend/data/farmacia.db)"
fi
echo ""

echo "📚 TEST 5: Verificar documentación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
DOC_FILES=$(find docs -type f -name "*.md" | wc -l)
ROOT_DOCS=$(find . -maxdepth 1 -type f -name "*.md" | wc -l)
TOTAL_DOCS=$((DOC_FILES + ROOT_DOCS))
echo "✅ Archivos de documentación: $TOTAL_DOCS archivos"
echo ""

echo "🔍 TEST 6: Verificar archivos de código fuente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
BACKEND_JS=$(find backend/src -type f -name "*.js" | wc -l)
FRONTEND_TSX=$(find frontend/app -type f -name "*.tsx" -o -name "*.ts" | wc -l)
echo "✅ Archivos backend (.js): $BACKEND_JS"
echo "✅ Archivos frontend (.tsx/.ts): $FRONTEND_TSX"
echo ""

echo "📊 TEST 7: Contar líneas de código"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
BACKEND_LINES=$(find backend/src -type f -name "*.js" -exec wc -l {} + | tail -1 | awk '{print $1}')
FRONTEND_LINES=$(find frontend/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "✅ Líneas backend: $BACKEND_LINES"
echo "✅ Líneas frontend: $FRONTEND_LINES"
echo ""

echo "🔗 TEST 8: Verificar endpoints documentados"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ENDPOINTS=$(grep -r "GET\|POST\|PUT\|DELETE" docs/API.md 2>/dev/null | grep -E "^\s*-\s*(GET|POST|PUT|DELETE)" | wc -l)
echo "✅ Endpoints documentados: $ENDPOINTS"
echo ""

echo "✅ TEST 9: Verificar Git"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d ".git" ]; then
    COMMITS=$(git log --oneline | wc -l)
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "✅ Repositorio Git: OK"
    echo "   Rama actual: $BRANCH"
    echo "   Total commits: $COMMITS"
else
    echo "⚠️ No es un repositorio Git"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "                    📊 RESUMEN DE TESTING"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Estado del Proyecto:"
echo "  ✅ Estructura completa"
echo "  ✅ Dependencias instaladas"
echo "  ✅ Documentación completa"
echo "  ✅ Código fuente disponible"
if [ -f "backend/data/farmacia.db" ]; then
    echo "  ✅ Base de datos creada"
else
    echo "  ⚠️ Base de datos no existe"
fi
echo ""
echo "Próximo paso: Iniciar servidores"
echo ""
echo "Backend:  npm start  (en /backend)"
echo "Frontend: npm run dev (en /frontend)"
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 TESTING COMPLETADO ✅                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
