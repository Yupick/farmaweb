# Landing Page + Sistema de Administración + Chatbot para Farmacia Científica Malvinas

**Diseñador y Administrador Principal:** Cristian Saqueta Melo  
**Email:** csmelo@nightslayer.com.ar  
**Fecha de Inicio:** 10 de enero de 2026

---

## 📋 Descripción del Proyecto

Sistema integral para la Farmacia Científica Malvinas que integra:
- **Landing Page dinámica** con soporte de themes y carruseles
- **Panel de Administración** robusto y flexible
- **Chatbot inteligente** en WhatsApp con LLM configurable (Groq/OpenAI)
- **Integración con Instagram** para mostrar últimos posts
- **Base de datos** SQLite con modelos de usuario, productos, conversaciones y configuraciones
- **Preparación para tienda online** con estructura de roles y productos

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

## 📚 Documentación

Consulta los siguientes documentos para más información:

- [ROADMAP.md](docs/ROADMAP.md) - Plan detallado de desarrollo
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitectura técnica del sistema
- [DATABASE.md](docs/DATABASE.md) - Esquema de base de datos
- [API.md](docs/API.md) - Documentación de endpoints
- [SETUP.md](docs/SETUP.md) - Guía de instalación

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

