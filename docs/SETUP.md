# 🚀 SETUP.md - Guía de Instalación

**Versión:** 1.0  
**Última Actualización:** 10 de enero de 2026  
**Tiempo Estimado:** 30 minutos

---

## 📋 Requisitos Previos

### Software Requerido
- **Node.js** 18+ y npm 9+ ([descargar](https://nodejs.org/))
- **Git** ([descargar](https://git-scm.com/))
- **SQLite 3** (incluido en Node.js)
- **Editor de Código:** VS Code recomendado

### Cuentas Externas Necesarias (Fases posteriores)
- WhatsApp Business Account
- API Key de Groq o OpenAI
- Token de acceso a Instagram
- Twilio Account (alternativa a WhatsApp)

---

## 🔧 Instalación Local

### Paso 1: Clonar Repositorio

```bash
cd /home/mkd/Programacion
git clone https://github.com/tuuser/farmaweb.git
cd farmaweb
```

### Paso 2: Instalar Backend

```bash
cd backend
npm install

# Copiar variables de entorno
cp .env.example .env

# Crear base de datos
npm run db:init

# Inicializar usuario admin
npm run db:seed
```

**Variables de .env (backend):**
```env
# Servidor
NODE_ENV=development
PORT=3001
HOST=localhost

# Base de datos
DB_PATH=./database/farmaweb.db
DB_DIALECT=sqlite

# JWT
JWT_SECRET=tu_super_secreto_aqui_cambiar_en_produccion
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### Paso 3: Instalar Frontend

```bash
cd ../frontend
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

**Variables de .env.local (frontend):**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
REACT_APP_LOG_LEVEL=debug
```

### Paso 4: Ejecutar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Debería mostrar:
```
✅ Server running on http://localhost:3001
✅ Database connected
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Debería mostrar:
```
✅ Application ready on http://localhost:3000
```

---

## 🔑 Credenciales Iniciales

Una vez instalado, puedes acceder con:

```
📧 Email: admin@fciacientifica.com.ar
🔐 Contraseña: cientifica123
```

**⚠️ IMPORTANTE:** Cambiar contraseña en primer acceso

---

## 📁 Estructura Post-Instalación

```
farmaweb/
├── backend/
│   ├── database/
│   │   └── farmaweb.db              ✅ Creada durante npm run db:init
│   ├── src/
│   ├── .env                         ✅ Configurada
│   └── node_modules/
├── frontend/
│   ├── .env.local                   ✅ Configurada
│   ├── public/
│   ├── src/
│   └── node_modules/
└── docs/
```

---

## ✅ Verificación de Instalación

### 1. Probar Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@farmamalvinas.com",
    "password": "cientifica123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-1",
    "email": "admin@farmamalvinas.com",
    "role": "admin"
  }
}
```

### 2. Probar Acceso a Landing Page

Abre en el navegador: `http://localhost:3000`

Debería cargar la landing page base.

### 3. Acceder a Admin

1. Ir a `http://localhost:3000/admin`
2. Ingresar credenciales
3. Debería aparecer el dashboard

---

## 🐳 Instalación con Docker (Opcional)

### Paso 1: Crear docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      DB_PATH: /app/database/farmaweb.db
      JWT_SECRET: tu_secreto_aqui
    volumes:
      - ./backend:/app
      - ./database:/app/database
    command: npm run dev

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api
    volumes:
      - ./frontend:/app
    command: npm run dev

  # SQLite se maneja directamente en backend
```

### Paso 2: Construir e Iniciar

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🔄 Migraciones de Base de Datos

### Primera vez
```bash
cd backend
npm run db:init    # Crea tablas
npm run db:seed    # Inserta datos iniciales
```

### Después de cambios en schema
```bash
# Backup
npm run db:backup

# Migrar
npm run db:migrate

# Restaurar si es necesario
npm run db:restore
```

---

## 📦 Instalación de Dependencias Específicas

### Para Fase 2 (Instagram Integration)
```bash
cd backend
npm install axios dotenv
```

### Para Fase 3 (Chatbot WhatsApp)
```bash
cd backend
npm install twilio axios dotenv

# O para WhatsApp Business API
npm install whatsapp-web.js
```

### Para Fase 3 (LLM Integration)
```bash
cd backend
# Groq
npm install @groq/sdk

# OpenAI
npm install openai
```

---

## 🧪 Verificar Estructura Correcta

```bash
# Verificar backend
cd backend
npm run lint        # Si está configurado
npm run build       # Si se necesita compilar TypeScript

# Verificar frontend
cd ../frontend
npm run lint        # Si está configurado
npm run build       # Build de producción
```

---

## 🚀 Siguientes Pasos

1. **Cambiar contraseña admin**
   - Acceder a `/admin/settings`
   - Cambiar contraseña inicial

2. **Configurar tema**
   - Ir a Admin → Configuración
   - Seleccionar tema preferido

3. **Agregar información de farmacia**
   - Admin → Configuración → Información de Farmacia
   - Completar datos de contacto y horarios

4. **Crear contenido inicial**
   - Admin → Contenido
   - Crear secciones para landing page

5. **Para Fase 2 - Configurar Instagram**
   - Admin → Configuración → Instagram
   - Ingresar Business Account ID y Access Token

6. **Para Fase 3 - Configurar WhatsApp**
   - Admin → Configuración → WhatsApp
   - Ingresar credenciales de Twilio o WhatsApp Business API

---

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3001 already in use"
```bash
# Cambiar puerto en .env
PORT=3002

# O matar proceso existente
lsof -i :3001
kill -9 <PID>
```

### Error: "Database locked"
```bash
# SQLite está siendo usado por otro proceso
# Solución: Reiniciar backend
npm run dev
```

### Error de CORS
```
# Verificar que CORS_ORIGIN en backend sea correcto
CORS_ORIGIN=http://localhost:3000
```

### Frontend no se conecta a backend
```bash
# Verificar que API URL es correcta
REACT_APP_API_URL=http://localhost:3001/api

# Verificar que backend está corriendo
curl http://localhost:3001/api/health
```

---

## 📚 Documentación Adicional

- [README.md](../README.md) - Descripción general del proyecto
- [ROADMAP.md](ROADMAP.md) - Plan de desarrollo
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura técnica
- [DATABASE.md](DATABASE.md) - Esquema de BD
- [API.md](API.md) - Documentación de endpoints

---

## 💡 Consejos de Desarrollo

### Debugging Backend
```bash
# Habilitar debugging completo
DEBUG=* npm run dev

# O usar debugger de Node.js
node --inspect backend/server.ts
```

### Debugging Frontend
```bash
# Usar React Developer Tools en Chrome
# Instalar extensión: React Developer Tools
```

### Hot Reload
- Backend: nodemon configurado (reinicia al cambiar archivos)
- Frontend: Webpack dev server (actualiza automáticamente)

### Testing
```bash
# Backend
npm test

# Frontend
npm test -- --watch
```

---

## 🔒 Seguridad en Desarrollo

⚠️ **Nunca en Producción:**
- Usar credenciales reales en variables de entorno locales
- Compartir archivo `.env` por repositorio
- Usar JWT_SECRET simple
- Dejar debug habilitado

**Recomendaciones:**
1. Cambiar contraseña admin inmediatamente
2. Generar JWT_SECRET fuerte: `openssl rand -base64 32`
3. Usar `.env.local` y `.env` en `.gitignore`
4. Validar todas las entradas de usuario

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar esta guía
2. Verificar [GitHub Issues](https://github.com/tuuser/farmaweb/issues)
3. Contactar: csmelo@nightslayer.com.ar

---

**Última Actualización:** 10 de enero de 2026

