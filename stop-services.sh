#!/bin/bash

# 🛑 STOP SERVICES SCRIPT
# Detiene todos los servicios del proyecto Farmacia Científica Malvinas
# Uso: ./stop-services.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🛑 DETENIENDO SERVICIOS - FARMACIA CIENTÍFICA          ║"
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

# Variables
BACKEND_PID_FILE=".backend.pid"
FRONTEND_PID_FILE=".frontend.pid"

# Función para detener un servicio
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            print_info "Deteniendo $service_name (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
            
            # Esperar a que el proceso termine
            local count=0
            while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 10 ]; do
                sleep 0.5
                count=$((count + 1))
            done
            
            # Si aún sigue corriendo, forzar terminación
            if ps -p "$pid" > /dev/null 2>&1; then
                print_warning "Forzando terminación de $service_name..."
                kill -9 "$pid" 2>/dev/null || true
                sleep 1
            fi
            
            # Verificar que se detuvo
            if ps -p "$pid" > /dev/null 2>&1; then
                print_error "No se pudo detener $service_name"
                return 1
            else
                print_status "$service_name detenido"
                rm -f "$pid_file"
                return 0
            fi
        else
            print_warning "$service_name no está corriendo (PID: $pid)"
            rm -f "$pid_file"
            return 0
        fi
    else
        print_warning "No se encontró archivo de PID para $service_name"
        return 0
    fi
}

# Función alternativa: matar por puerto
kill_by_port() {
    local port=$1
    local service_name=$2
    
    print_info "Buscando proceso en puerto $port..."
    local pid=$(lsof -t -i ":$port" 2>/dev/null || netstat -tulpn 2>/dev/null | grep ":$port " | awk '{print $NF}' | cut -d'/' -f1)
    
    if [ -n "$pid" ] && [ "$pid" != "-" ]; then
        print_info "Encontrado $service_name (PID: $pid), deteniendo..."
        kill "$pid" 2>/dev/null || true
        sleep 1
        
        if ! ps -p "$pid" > /dev/null 2>&1; then
            print_status "$service_name detenido"
            return 0
        else
            kill -9 "$pid" 2>/dev/null || true
            print_status "$service_name forzadamente detenido"
            return 0
        fi
    else
        print_warning "No se encontró proceso en puerto $port"
        return 0
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Deteniendo servicios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Contadores
STOPPED=0
FAILED=0

# Detener Backend
echo "🔧 Backend (Puerto 3001)"
if stop_service "Backend" "$BACKEND_PID_FILE"; then
    STOPPED=$((STOPPED + 1))
else
    # Intenta por puerto como fallback
    kill_by_port 3001 "Backend" && STOPPED=$((STOPPED + 1)) || FAILED=$((FAILED + 1))
fi
echo ""

# Detener Frontend
echo "🎨 Frontend (Puerto 3000)"
if stop_service "Frontend" "$FRONTEND_PID_FILE"; then
    STOPPED=$((STOPPED + 1))
else
    # Intenta por puerto como fallback
    kill_by_port 3000 "Frontend" && STOPPED=$((STOPPED + 1)) || FAILED=$((FAILED + 1))
fi
echo ""

# Limpiar archivos temporales
rm -f .backend.pid .frontend.pid 2>/dev/null || true

# Resumen final
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
if [ $FAILED -eq 0 ]; then
    echo "║        ✅ SERVICIOS DETENIDOS EXITOSAMENTE                  ║"
else
    echo "║        ⚠️  ALGUNOS SERVICIOS TUVIERON PROBLEMAS             ║"
fi
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ $FAILED -eq 0 ]; then
    print_status "Todos los servicios se detuvieron correctamente"
    print_info "Puedes ejecutar './start-services.sh' para iniciar nuevamente"
else
    print_warning "Se encontraron $FAILED problema(s) al detener servicios"
fi
echo ""

# Status final de puertos
echo "🔍 Verificando puertos:"
echo "   Puerto 3000 (Frontend): " $(lsof -i :3000 &>/dev/null && echo "EN USO" || echo "✓ Disponible")
echo "   Puerto 3001 (Backend):  " $(lsof -i :3001 &>/dev/null && echo "EN USO" || echo "✓ Disponible")
echo ""
