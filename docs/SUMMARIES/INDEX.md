# 📑 INDEX.md - Índice Completo de Documentación

**Proyecto:** Farmacia Científica Malvinas - Landing Page + Admin + Chatbot  
**Fecha:** 10 de enero de 2026  
**Versión:** 1.0.0

---

## 🚀 INICIO RÁPIDO

Para nuevos miembros del equipo, comienza por:
1. Leer [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) (10 min)
2. Consultar [README.md](README.md) (5 min)
3. Revisar [SETUP.md](docs/SETUP.md) para instalar (30 min)
4. Acceder a [ROADMAP.md](docs/ROADMAP.md) para detalles (20 min)

---

## 📚 Documentación Principal

### 1. [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)
**Resumen ejecutivo del proyecto**
- Objetivo general
- Lo completado
- Plan de 5 fases
- Stack tecnológico
- Métricas y entregables
- Estimaciones
- **Ideal para:** Gerentes, stakeholders, revisión rápida

### 2. [README.md](README.md)
**Descripción general del proyecto**
- Descripción de componentes
- Estructura del proyecto
- Fases de desarrollo
- Requisitos técnicos
- Administrador principal
- **Ideal para:** Nuevo desarrolladores, overview rápido

### 3. [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md)
**Checklist de completitud y tracking**
- Fases completadas
- Tareas por fase
- Status de desarrollo
- Próximos pasos
- **Ideal para:** Project managers, tracking de progreso

---

## 🗺️ Documentación de Fases

### [docs/ROADMAP.md](docs/ROADMAP.md)
**Plan detallado de desarrollo (11 semanas)**
- 5 fases documentadas
- Tareas técnicas específicas
- Entregables por fase
- Criterios de aceptación
- Timeline estimado
- Riesgos y mitigaciones
- **Secciones principales:**
  - Fase 1: Estructura Básica (2 semanas)
  - Fase 2: Landing Page Dinámica (2 semanas)
  - Fase 3: Chatbot WhatsApp (3 semanas)
  - Fase 4: Chatbot Administrativo (2 semanas)
  - Fase 5: Preparación Tienda Online (2 semanas)

---

## 🏗️ Documentación Técnica

### [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
**Arquitectura técnica del sistema**
- Diagrama de arquitectura general
- Flujos de datos principales
- Seguridad y autenticación
- Estructura de carpetas detallada
- APIs externas integradas
- Escalabilidad
- **Secciones:**
  - Diagrama ER
  - Flujos de autenticación, chatbot, contenido
  - Sistema de temas
  - CI/CD (futuro)
  - Testing strategy
  - Monitoreo

### [docs/DATABASE.md](docs/DATABASE.md)
**Esquema completo de base de datos**
- Diagrama ER con 10 tablas
- Definición detallada de cada tabla
- Campos y tipos de datos
- Índices y relaciones
- Estrategia de seguridad
- Datos iniciales
- Preparación para escalabilidad
- **Tablas:**
  1. users (autenticación)
  2. roles (control de acceso)
  3. configurations (ajustes)
  4. content (landing page)
  5. customers (clientes)
  6. chat_conversations (chats)
  7. chat_messages (mensajes)
  8. admin_conversations (IA admin)
  9. admin_audit_log (auditoría)
  10. products (futura tienda)

### [docs/API.md](docs/API.md)
**Documentación de API REST**
- 25+ endpoints documentados
- Autenticación JWT
- Códigos de error
- Rate limiting
- Ejemplos de CURL
- **Grupos de endpoints:**
  - Autenticación (4 endpoints)
  - Usuarios (5 endpoints)
  - Contenido (5 endpoints)
  - Configuración (4 endpoints)
  - Chatbot (4 endpoints)
  - Farmacia (2 endpoints)
  - Instagram (1 endpoint)
  - Tienda (9 endpoints - Fase 5+)

---

## 🛠️ Guías de Instalación y Setup

### [docs/SETUP.md](docs/SETUP.md)
**Guía paso a paso de instalación**
- Requisitos previos
- Instalación local (4 pasos)
- Credenciales iniciales
- Instalación con Docker
- Migraciones de BD
- Instalación de dependencias por fase
- Verificación de estructura
- Solución de problemas
- Siguientes pasos
- Tips de desarrollo

---

## 📦 Archivos de Configuración

### Backend
- [backend/.env.example](backend/.env.example) - Variables de entorno (25 variables)
  - Servidor (NODE_ENV, PORT, HOST)
  - Base de datos (DB_PATH, DB_DIALECT)
  - JWT (JWT_SECRET, JWT_EXPIRATION)
  - Integraciones (WhatsApp, Groq, OpenAI, Instagram)
  - Email y logging

### Frontend
- [frontend/.env.example](frontend/.env.example) - Variables del cliente
  - URL de API
  - Entorno y logging
  - Información de la app

### Proyecto
- [.gitignore](.gitignore) - Archivos a ignorar
  - node_modules, .env, *.db
  - IDEs, logs, temporales
  - Datos sensibles

---

## 🗄️ Estructura de Base de Datos

### Archivos de Esquemas
Ubicación: `/database/schemas/`

1. [database/schemas/roles.sql](database/schemas/roles.sql)
2. [database/schemas/users.sql](database/schemas/users.sql)
3. [database/schemas/configurations.sql](database/schemas/configurations.sql)
4. [database/schemas/content.sql](database/schemas/content.sql)
5. [database/schemas/customers.sql](database/schemas/customers.sql)
6. [database/schemas/chat_conversations.sql](database/schemas/chat_conversations.sql)
7. [database/schemas/chat_messages.sql](database/schemas/chat_messages.sql)
8. [database/schemas/admin_conversations.sql](database/schemas/admin_conversations.sql)
9. [database/schemas/admin_audit_log.sql](database/schemas/admin_audit_log.sql)
10. [database/schemas/products.sql](database/schemas/products.sql)

### Archivos de Seeds (Datos Iniciales)
Ubicación: `/database/seeds/`

1. [database/seeds/001_admin_user.sql](database/seeds/001_admin_user.sql)
   - Usuario admin: admin@fciacientifica.com.ar
   - Contraseña: cientifica123 (hasheada)

2. [database/seeds/002_configurations.sql](database/seeds/002_configurations.sql)
   - Configuraciones por defecto

3. [database/seeds/003_pharmacy_info.sql](database/seeds/003_pharmacy_info.sql)
   - Información de la farmacia

### Script de Inicialización
- [database/setup_database.sh](database/setup_database.sh)
  - Crea esquemas
  - Inserta datos iniciales
  - Genera base de datos SQLite

---

## 🎯 Por Rol

### Para Administrador/Product Manager
1. Leer [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) - Visión completa
2. Revisar [docs/ROADMAP.md](docs/ROADMAP.md) - Plan detallado
3. Consultar [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md) - Status

### Para Desarrollador Backend
1. Leer [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Estructura
2. Estudiar [docs/DATABASE.md](docs/DATABASE.md) - Base de datos
3. Consultar [docs/API.md](docs/API.md) - Endpoints
4. Ejecutar [docs/SETUP.md](docs/SETUP.md) - Instalación

### Para Desarrollador Frontend
1. Revisar [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitectura
2. Leer [docs/API.md](docs/API.md) - Endpoints
3. Consultar [README.md](README.md) - Componentes
4. Ejecutar [docs/SETUP.md](docs/SETUP.md) - Instalación

### Para DevOps/Infra
1. Revisar [docs/SETUP.md](docs/SETUP.md) - Instalación
2. Consultar [backend/.env.example](backend/.env.example) - Configuración
3. Leer [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Despliegue

### Para Nuevos Miembros del Equipo
1. **Día 1:** [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)
2. **Día 1:** [README.md](README.md)
3. **Día 2:** [docs/SETUP.md](docs/SETUP.md) - Instalar local
4. **Día 2:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
5. **Día 3:** [docs/ROADMAP.md](docs/ROADMAP.md) - Plan
6. **Día 3:** [docs/DATABASE.md](docs/DATABASE.md) - Datos
7. **Día 4:** [docs/API.md](docs/API.md) - APIs

---

## 📊 Estadísticas de Documentación

| Documento | Tipo | Líneas | Status |
|-----------|------|--------|--------|
| EXECUTIVE_SUMMARY.md | Resumen | 550 | ✅ Completo |
| README.md | General | 150 | ✅ Completo |
| PROJECT_CHECKLIST.md | Tracking | 280 | ✅ Completo |
| ROADMAP.md | Plan | 450 | ✅ Completo |
| ARCHITECTURE.md | Técnico | 550 | ✅ Completo |
| DATABASE.md | Técnico | 450 | ✅ Completo |
| API.md | Técnico | 600 | ✅ Completo |
| SETUP.md | Guía | 350 | ✅ Completo |
| **TOTAL** | | **3,380** | **✅ Completo** |

---

## 🔗 Enlaces Rápidos

### Documentación
- [Resumen Ejecutivo](EXECUTIVE_SUMMARY.md) - Visión general
- [Descripción General](README.md) - Overview del proyecto
- [Checklist](PROJECT_CHECKLIST.md) - Status y tracking
- [Roadmap](docs/ROADMAP.md) - Plan de desarrollo

### Técnica
- [Arquitectura](docs/ARCHITECTURE.md) - Diseño del sistema
- [Base de Datos](docs/DATABASE.md) - Esquemas y tablas
- [API](docs/API.md) - Endpoints REST
- [Instalación](docs/SETUP.md) - Setup local

### Configuración
- [Backend Config](backend/.env.example) - Variables backend
- [Frontend Config](frontend/.env.example) - Variables frontend
- [Git Ignore](.gitignore) - Archivos ignorados

### Base de Datos
- [Esquemas](database/schemas/) - 10 archivos SQL
- [Seeds](database/seeds/) - 3 archivos de datos
- [Setup Script](database/setup_database.sh) - Inicialización

---

## ✅ Checklist de Lectura Recomendada

### Día 1 - Orientación (2 horas)
- [ ] Leer EXECUTIVE_SUMMARY.md (30 min)
- [ ] Leer README.md (15 min)
- [ ] Revisar estructura de carpetas (15 min)
- [ ] Instalación inicial (60 min)

### Día 2 - Arquitectura (3 horas)
- [ ] Leer ARCHITECTURE.md (60 min)
- [ ] Leer DATABASE.md (60 min)
- [ ] Revisar esquemas SQL (30 min)

### Día 3 - APIs y Features (3 horas)
- [ ] Leer API.md (90 min)
- [ ] Revisar ROADMAP.md - Fase 1 (60 min)

### Día 4 - Profundo (4 horas)
- [ ] Estudiar ROADMAP.md completo (120 min)
- [ ] Revisar PROJECT_CHECKLIST.md (60 min)
- [ ] Planificación de próximos pasos (60 min)

---

## 🎓 Aprendizaje por Tópico

### Autenticación
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#-seguridad) - Diseño
- [docs/API.md](docs/API.md#-autenticación) - Endpoints
- [docs/DATABASE.md](docs/DATABASE.md#-esquema-users) - BD
- [docs/SETUP.md](docs/SETUP.md#-credenciales-iniciales) - Credenciales

### Landing Page
- [docs/ROADMAP.md](docs/ROADMAP.md#-fase-2-landing-page-dinámica) - Requerimientos
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#-flujos-de-datos-principales) - Flujo
- [docs/API.md](docs/API.md#-endpoints-de-contenido) - APIs
- [docs/DATABASE.md](docs/DATABASE.md#-3-content-contenido-de-landing-page) - BD

### Chatbot WhatsApp
- [docs/ROADMAP.md](docs/ROADMAP.md#-fase-3-chatbot-principal-usuarios-vía-whatsapp) - Requerimientos
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#-2-flujo-de-conversación-del-chatbot) - Flujo
- [docs/API.md](docs/API.md#-endpoints-del-chatbot) - APIs
- [docs/DATABASE.md](docs/DATABASE.md#-5-chat_conversations) - BD

### Tienda Online (Fase 5)
- [docs/ROADMAP.md](docs/ROADMAP.md#-fase-5-preparación-para-tienda-online) - Plan
- [docs/DATABASE.md](docs/DATABASE.md#-10-products) - Schema
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#-integraciones-detalladas) - Diseño

---

## 🔍 Buscar Información Específica

### ¿Qué es el proyecto?
→ [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md#-objetivo-general)

### ¿Cuál es el cronograma?
→ [docs/ROADMAP.md](docs/ROADMAP.md#-timeline-estimado)

### ¿Cómo instalo?
→ [docs/SETUP.md](docs/SETUP.md#-instalación-local)

### ¿Cómo es la arquitectura?
→ [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#-diagrama-de-arquitectura-general)

### ¿Qué tablas tiene la BD?
→ [docs/DATABASE.md](docs/DATABASE.md#-definición-detallada-de-tablas)

### ¿Qué endpoints existen?
→ [docs/API.md](docs/API.md#-autenticación)

### ¿Cuál es el stack tecnológico?
→ [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md#-stack-tecnológico-recomendado)

### ¿Cuáles son los riesgos?
→ [docs/ROADMAP.md](docs/ROADMAP.md#-riesgos-y-mitigaciones)

### ¿Qué falta por hacer?
→ [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md)

### ¿Cómo agrego una nueva tabla?
→ [docs/DATABASE.md](docs/DATABASE.md#-consideraciones-de-escalabilidad)

---

## 📞 Contacto y Soporte

**Administrador Principal:**
- Nombre: Cristian Saqueta Melo
- Email: csmelo@nightslayer.com.ar

**Documentación:**
- Revisión: 10 de enero de 2026
- Versión: 1.0.0
- Estado: ✅ Completa

---

## 🎯 Próximos Pasos

1. **Crear repositorio Git**
   ```bash
   cd /home/mkd/Programacion/farmaweb
   git init
   ```

2. **Hacer primer commit**
   ```bash
   git add .
   git commit -m "Initial commit: Docs and structure"
   ```

3. **Instalar dependencias (Fase 1)**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Inicializar BD**
   ```bash
   cd ../database && bash setup_database.sh
   ```

5. **Leer [docs/ROADMAP.md](docs/ROADMAP.md) para Fase 1**

---

**Última Actualización:** 10 de enero de 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para Desarrollo

