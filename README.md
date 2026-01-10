# Landing Page + Sistema de Administración + Chatbot para Farmacia Científica Malvinas

**Diseñador y Administrador Principal:** Cristian Saqueta Melo  
**Email:** csmelo@nightslayer.com.ar  
**Fecha de Inicio:** 10 de enero de 2026

---

## 📋 Descripción del Proyecto

Sistema integral para la Farmacia Científica Malvinas que integra:
- **Landing Page dinámica** con contenido editable y páginas internas
- **Panel de Administración** robusto con gestión completa de contenidos
- **Chatbot inteligente WhatsApp** con IA (Groq/OpenAI) - ✅ **IMPLEMENTADO**
- **Chatbot Administrativo** con acceso a base de datos
- **Integración con Instagram** para mostrar últimos posts
- **Sistema de páginas dinámicas** con opciones de modal, menú y footer
- **Base de datos** SQLite con modelos de usuario, productos, conversaciones y configuraciones
- **Preparación para tienda online** con estructura de roles y productos

### 🆕 Características Destacadas

- 🤖 **IA Configurable**: Soporte para Groq y OpenAI con modelos personalizables
- 💬 **WhatsApp Multi-Proveedor**: Meta Cloud API y Twilio integrados
- 🎨 **Contenido Dinámico**: Sistema de gestión de contenido con asistente IA
- 🔐 **Sistema de Autenticación**: JWT con roles y permisos
- 📱 **Responsive Design**: Interfaz adaptable a todos los dispositivos

---

## 🎯 Credenciales Iniciales

```
Usuario: admin
Contraseña: cientifica123 (encriptada)
```

---

## 📁 Estructura del Proyecto

```
farmaweb/
├── frontend/                 # Aplicación React/Next.js
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas/vistas
│   │   ├── theme/           # Temas dinámicos
│   │   ├── services/        # APIs y servicios
│   │   └── utils/           # Utilidades
│   └── package.json
├── backend/                  # API Node.js/Express o FastAPI
│   ├── src/
│   │   ├── models/          # Modelos de BD
│   │   ├── routes/          # Rutas de API
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── middleware/       # Autenticación, validación
│   │   ├── services/         # Servicios (LLM, Instagram, etc)
│   │   └── config/          # Configuraciones
│   └── package.json
├── chatbot/                  # Lógica del chatbot
│   ├── whatsapp/            # Integración WhatsApp
│   ├── llm/                 # Provisión de LLM (Groq, OpenAI)
│   ├── handlers/            # Manejadores de mensajes
│   └── config/              # Configuraciones específicas
├── database/                 # Esquemas y migraciones
│   ├── schemas/             # Definiciones de tablas
│   ├── migrations/          # Cambios de BD
│   └── seeds/               # Datos iniciales
├── docs/                     # Documentación
│   ├── ROADMAP.md           # Plan de desarrollo
│   ├── ARCHITECTURE.md      # Arquitectura técnica
│   ├── API.md               # Documentación de API
│   ├── DATABASE.md          # Esquema de BD
│   └── SETUP.md             # Guía de instalación
└── README.md                # Este archivo
```

---

## 🚀 Fases de Desarrollo

### Fase 1: Estructura Básica ✅ (Próxima)
- Sistema de login con JWT
- Panel de administración básico
- Gestión de usuarios y roles
- Configuración de themes

### Fase 2: Landing Page Dinámica
- Portada con datos de la farmacia
- Carrusel de imágenes
- Slider/Banner configurable
- Integración con Instagram

### Fase 3: Chatbot WhatsApp
- Integración con WhatsApp API
- Configuración de LLM (Groq/OpenAI)
- Almacenamiento de conversaciones
- Conexión con lista de precios

### Fase 4: Chatbot Administrativo
- Chat dentro del panel de administración
- Acceso a base de datos
- Gestión de configuraciones

### Fase 5: Preparación para Tienda Online
- Extensión de roles de usuarios
- Gestión de productos y stock
- Sistema de pedidos

---

## � Inicio Rápido

### 1. Instalar Dependencias e Iniciar Servicios

```bash
# Iniciar backend y frontend automáticamente
./start-services.sh

# Los servicios estarán disponibles en:
# - Backend:  http://localhost:3001
# - Frontend: http://localhost:3000
```

### 2. Configurar WhatsApp con IA

```bash
# Opción A: Configuración rápida desde terminal
./setup-whatsapp.sh

# Opción B: Configuración desde panel admin
# 1. Accede a http://localhost:3000/login
# 2. Usuario: admin@fciacientifica.com.ar
# 3. Contraseña: cientifica123
# 4. Ve a Configuraciones → WhatsApp
```

### 3. Exponer Backend para WhatsApp

```bash
# Instalar ngrok (si no lo tienes)
brew install ngrok  # macOS
# o descarga desde https://ngrok.com

# Exponer puerto 3001
ngrok http 3001
```

### 4. Probar Integración

```bash
# Test completo de WhatsApp
./test-whatsapp.sh

# Ver logs en tiempo real
./view-logs.sh
```

---

## 📚 Documentación

Consulta los siguientes documentos para más información:

- [ROADMAP.md](docs/ROADMAP.md) - Plan detallado de desarrollo
- [WHATSAPP_SETUP.md](docs/WHATSAPP_SETUP.md) - **Guía completa de WhatsApp** ⭐
- [WHATSAPP_ARCHITECTURE.md](docs/WHATSAPP_ARCHITECTURE.md) - Arquitectura de WhatsApp + IA
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitectura técnica del sistema
- [DATABASE.md](docs/DATABASE.md) - Esquema de base de datos
- [API.md](docs/API.md) - Documentación de endpoints
- [SETUP.md](docs/SETUP.md) - Guía de instalación detallada

---

## 🔧 Scripts Disponibles

```bash
./start-services.sh        # Inicia backend y frontend
./stop-services.sh         # Detiene todos los servicios
./view-logs.sh             # Ver logs en tiempo real
./setup-whatsapp.sh        # Configuración rápida de WhatsApp
./test-whatsapp.sh         # Pruebas de integración WhatsApp
./test_project.sh          # Tests del proyecto
```

---

## 🛠️ Requisitos Técnicos

### Frontend
- React 18+ o Next.js 13+
- TypeScript
- Tailwind CSS o styled-components
- Sistema de temas dinámicos

### Backend
- Node.js 18+ con Express.js O Python 3.10+ con FastAPI
- JWT para autenticación
- SQLite con ORM (Sequelize, TypeORM, SQLAlchemy)

### ChatBot
- WhatsApp Business API o Twilio
- Groq AI o OpenAI API
- Almacenamiento de contexto conversacional

### Seguridad
- Hash de contraseñas con bcrypt
- Validación de JWT
- CORS configurado
- Encriptación de datos sensibles

---

## 👤 Administrador Principal

**Cristian Saqueta Melo**  
Designer & Administrator  
Email: csmelo@nightslayer.com.ar

---

## 📅 Última Actualización

10 de enero de 2026

---

## 📝 Notas Importantes

- Documentar cada fase con entregables claros
- Mantener modularidad para facilitar futuras extensiones
- El sistema debe estar preparado para escalar hacia una tienda online
- Todas las integraciones (Instagram, WhatsApp, LLM) deben ser configurables
- Preservar la estructura para futuras integraciones

