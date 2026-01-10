#!/bin/bash

# 🚀 START SERVICES SCRIPT
# Levanta todos los servicios del proyecto Farmacia Científica Malvinas
# Uso: ./start-services.sh

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🚀 INICIANDO SERVICIOS - FARMACIA CIENTÍFICA          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Verificar que estamos en el directorio correcto
if [ ! -f "README.md" ] && [ ! -f "docs/README.md" ]; then
    print_error "No se encontró el archivo README.md. Asegúrate de ejecutar este script desde la raíz del proyecto."
    exit 1
fi

print_info "Ubicación del proyecto: $SCRIPT_DIR"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_status "Node.js detectado: $(node --version)"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_status "npm detectado: $(npm --version)"
echo ""

# 1. Inicializar base de datos si es necesario
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 PASO 1: Base de Datos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f "backend/data/farmacia.db" ]; then
    print_info "Inicializando base de datos..."
    cd backend
    if [ -f "scripts/initDatabase.js" ]; then
        node scripts/initDatabase.js || print_warning "Error inicializando BD, continuando..."
    else
        mkdir -p data
        sqlite3 data/farmacia.db ".tables" > /dev/null 2>&1 || print_warning "sqlite3 no disponible"
    fi
    cd ..
    print_status "Base de datos lista"
else
    print_status "Base de datos ya existe"
fi
echo ""

# 2. Iniciar Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 PASO 2: Backend (Puerto 3001)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d "backend/node_modules" ]; then
    print_info "Instalando dependencias del backend..."
    cd backend
    npm install --silent
    cd ..
    print_status "Dependencias del backend instaladas"
else
    print_status "Dependencias del backend ya instaladas"
fi

print_info "Iniciando servidor backend..."
cd backend
nohup npm start > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
sleep 3
if ps -p $BACKEND_PID > /dev/null; then
    print_status "Backend iniciado (PID: $BACKEND_PID)"
    echo "   Log: backend/backend.log"
else
    print_error "No se pudo iniciar el backend"
    exit 1
fi
echo ""

# 3. Iniciar Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 PASO 3: Frontend (Puerto 3000)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d "frontend/node_modules" ]; then
    print_info "Instalando dependencias del frontend..."
    cd frontend
    npm install --silent
    cd ..
    print_status "Dependencias del frontend instaladas"
else
    print_status "Dependencias del frontend ya instaladas"
fi

print_info "Iniciando aplicación frontend..."
cd frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Esperar a que el frontend esté listo
sleep 4
if ps -p $FRONTEND_PID > /dev/null; then
    print_status "Frontend iniciado (PID: $FRONTEND_PID)"
    echo "   Log: frontend/frontend.log"
else
    print_error "No se pudo iniciar el frontend"
    exit 1
fi
echo ""

# 4. Guardar PIDs para posterior uso
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Resumen final
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           ✅ SERVICIOS INICIADOS EXITOSAMENTE                ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 SERVICIOS ACTIVOS:"
echo "   🔧 Backend:  http://localhost:3001 (PID: $BACKEND_PID)"
echo "   🎨 Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "🔐 CREDENCIALES DE ADMIN:"
echo "   Email:      admin@fciacientifica.com.ar"
echo "   Contraseña: cientifica123"
echo ""
echo "📋 LOGS:"
echo "   Backend:  tail -f backend/backend.log"
echo "   Frontend: tail -f frontend/frontend.log"
echo ""
echo "🛑 Para detener servicios ejecuta: ./stop-services.sh"
echo ""
