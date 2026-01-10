# 🏗️ ARCHITECTURE.md - Arquitectura Técnica del Sistema

**Versión:** 1.0  
**Última Actualización:** 10 de enero de 2026

---

## 📐 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Next.js)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Landing Page  │  Admin Dashboard  │  Components Base   │   │
│  │  Theme System  │  User Management  │  Auth Provider     │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 │ JWT Token
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Auth Controller │ Content Controller │ User Controller │   │
│  │  LLM Service     │ Instagram Service  │ WhatsApp Service│   │
│  │  Middleware      │ Error Handler      │ Validator       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────────┘
                 │
       ┌─────────┼─────────┬──────────┐
       │         │         │          │
       ▼         ▼         ▼          ▼
   ┌────────────────┐ ┌─────────────────────┐
   │   SQLite       │ │ External APIs       │
   │   Database     │ │ ├─ WhatsApp         │
   │                │ │ ├─ Instagram        │
   │ ├─ Users       │ │ ├─ Groq/OpenAI      │
   │ ├─ Content     │ │ └─ Twilio           │
   │ ├─ Config      │ │                     │
   │ ├─ Chats       │ └─────────────────────┘
   │ └─ Logs        │
   └────────────────┘

┌────────────────────────────────────────────────────────────────┐
│              CHATBOT LAYER (WhatsApp Integration)              │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Message Handler │ LLM Router │ Context Manager        │   │
│  │  State Machine   │ Response Builder │ Data Storage      │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Datos Principales

### 1. Flujo de Autenticación
```
Usuario
   │
   ├─ Ingresa credenciales
   │
   ▼
Frontend (Login Form)
   │
   ├─ Validación local
   │
   ▼
Backend (POST /auth/login)
   │
   ├─ Verificar usuario
   ├─ Comparar password (bcrypt)
   ├─ Generar JWT
   │
   ▼
Frontend (Almacenar JWT)
   │
   ├─ localStorage o cookie
   │
   ▼
Dashboard Admin (Acceso permitido)
```

### 2. Flujo de Conversación del Chatbot
```
Usuario WhatsApp
   │
   ├─ Envía mensaje
   │
   ▼
Webhook WhatsApp → Backend
   │
   ├─ Validar token
   ├─ Extraer número de teléfono
   ├─ Buscar cliente en BD
   │
   ▼
LLM Service (Groq/OpenAI)
   │
   ├─ Obtener configuración del chatbot
   ├─ Preparar system prompt
   ├─ Enviar mensaje + contexto
   ├─ Recibir respuesta
   │
   ▼
Message Handler
   │
   ├─ Guardar en BD
   ├─ Procesar data de cliente
   │
   ▼
WhatsApp API
   │
   ├─ Enviar respuesta
   │
   ▼
Usuario WhatsApp (Recibe respuesta)
```

### 3. Flujo de Gestión de Contenido (Admin)
```
Admin Panel
   │
   ├─ Crea/Edita contenido
   │
   ▼
Frontend Form
   │
   ├─ Validación
   │
   ▼
Backend (POST/PUT /content)
   │
   ├─ Validar JWT
   ├─ Verificar permisos
   ├─ Guardar en BD
   │
   ▼
Frontend (Update UI)
   │
   ├─ Landing page refleja cambios
   │
   ▼
Usuarios finales (Ven contenido actualizado)
```

---

## 🔐 Seguridad

### Autenticación
- **Método:** JWT (JSON Web Token)
- **Almacenamiento:** HttpOnly Cookies (seguro contra XSS)
- **Expiración:** 24 horas (con refresh token de 7 días)
- **Validación:** Verificada en cada request al backend

### Autorización
- **Rol-Based Access Control (RBAC):**
  - `admin` - Acceso total
  - `moderador` - Gestión de contenido
  - `usuario` - Solo lectura de datos públicos

### Contraseñas
- **Hash:** bcrypt con salt rounds = 10
- **Validación:** Mínimo 8 caracteres, complejidad requerida

### API Keys Externas
- **Almacenamiento:** Variables de entorno (.env)
- **Nunca en:** Frontend, repositorio git, logs
- **Rotación:** Cambio periódico recomendado

### CORS
- Configurado solo para dominios permitidos
- Métodos: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

---

## 📦 Estructura de Carpetas Detallada

### Frontend
```
frontend/
├── public/                      # Assets estáticos
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Admin/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   └── ChatBot.tsx
│   │   ├── Landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Carousel.tsx
│   │   │   ├── Banner.tsx
│   │   │   └── Instagram.tsx
│   │   └── Common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── pages/                   # Páginas principales
│   │   ├── index.tsx            # Landing page
│   │   ├── login.tsx            # Login
│   │   ├── admin/
│   │   │   ├── dashboard.tsx
│   │   │   ├── users.tsx
│   │   │   ├── content.tsx
│   │   │   ├── chatbot.tsx
│   │   │   └── settings.tsx
│   │   └── 404.tsx
│   ├── theme/                   # Sistema de temas
│   │   ├── themes.ts            # Definiciones de temas
│   │   ├── ThemeProvider.tsx
│   │   └── useTheme.ts
│   ├── services/                # Servicios de API
│   │   ├── api.ts               # Cliente HTTP
│   │   ├── authService.ts
│   │   ├── contentService.ts
│   │   ├── userService.ts
│   │   └── chatbotService.ts
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useForm.ts
│   ├── utils/                   # Utilidades
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   └── types/                   # TypeScript types
│       ├── auth.ts
│       ├── user.ts
│       └── content.ts
├── .env.example                 # Variables de entorno de ejemplo
├── package.json
├── tsconfig.json
└── next.config.js
```

### Backend
```
backend/
├── src/
│   ├── models/                  # Modelos de BD (ORM)
│   │   ├── User.ts
│   │   ├── Content.ts
│   │   ├── ChatConversation.ts
│   │   ├── Config.ts
│   │   └── index.ts
│   ├── routes/                  # Rutas de API
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── content.routes.ts
│   │   ├── chat.routes.ts
│   │   └── index.ts
│   ├── controllers/             # Lógica de negocio
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── contentController.ts
│   │   └── chatController.ts
│   ├── services/                # Servicios de lógica
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── contentService.ts
│   │   ├── whatsappService.ts
│   │   ├── llmService.ts
│   │   ├── instagramService.ts
│   │   └── index.ts
│   ├── middleware/              # Middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── validator.ts
│   │   └── logger.ts
│   ├── config/                  # Configuraciones
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   ├── env.ts
│   │   └── index.ts
│   ├── types/                   # TypeScript types
│   │   ├── express.d.ts
│   │   ├── models.ts
│   │   └── services.ts
│   ├── utils/                   # Utilidades
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── error.ts
│   └── app.ts                   # Configuración de Express
├── database/                    # Migrations y seeds
│   ├── migrations/
│   ├── seeders/
│   └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
└── server.ts                    # Punto de entrada
```

### Chatbot
```
chatbot/
├── src/
│   ├── whatsapp/
│   │   ├── webhookHandler.ts    # Webhook receptor
│   │   ├── messageHandler.ts    # Procesador de mensajes
│   │   └── apiClient.ts         # Cliente WhatsApp API
│   ├── llm/
│   │   ├── groqProvider.ts      # Proveedor Groq
│   │   ├── openaiProvider.ts    # Proveedor OpenAI
│   │   └── baseProvider.ts      # Interfaz base
│   ├── handlers/
│   │   ├── textHandler.ts
│   │   ├── mediaHandler.ts
│   │   ├── locationHandler.ts
│   │   └── contactHandler.ts
│   ├── context/
│   │   ├── contextManager.ts    # Manejo de contexto
│   │   ├── stateManager.ts      # Máquina de estados
│   │   └── memoryStore.ts       # Almacenamiento temporal
│   ├── services/
│   │   ├── customerService.ts   # Gestión de clientes
│   │   ├── productService.ts    # Información de productos
│   │   └── scheduleService.ts   # Horarios
│   ├── config/
│   │   ├── prompts.ts           # System prompts configurables
│   │   └── index.ts
│   └── utils/
│       ├── validators.ts
│       └── formatters.ts
└── package.json
```

### Database
```
database/
├── schemas/
│   ├── users.sql
│   ├── content.sql
│   ├── chatbot.sql
│   ├── config.sql
│   └── index.sql
├── migrations/
│   ├── 001_init_users.sql
│   ├── 002_init_content.sql
│   ├── 003_init_chatbot.sql
│   └── 004_init_config.sql
├── seeds/
│   ├── users.sql                # Usuario admin inicial
│   ├── config.sql               # Configuraciones por defecto
│   └── index.sql
└── README.md
```

---

## 🌐 APIs Externas Integradas

### WhatsApp Business API
```
Endpoint: https://graph.instagram.com/v18.0/
Métodos:
  - POST /messages            # Enviar mensaje
  - GET /messages             # Obtener historial (webhook)
  
Autenticación: Bearer Token (almacenado en env)
Rate Limit: Verificado en cada integración
```

### Groq AI
```
Endpoint: https://api.groq.com/
Método: POST /chat/completions
Headers: Authorization: Bearer {API_KEY}
Rate Limit: Según plan (considerar fallback)
```

### OpenAI
```
Endpoint: https://api.openai.com/v1/
Método: POST /chat/completions
Headers: Authorization: Bearer {API_KEY}
Models: gpt-3.5-turbo, gpt-4 (configurable)
```

### Instagram
```
Endpoint: https://graph.instagram.com/v18.0/
Método: GET /me/media
Parámetros: fields=id,caption,media_type,media_url
Caché: 1 hora
```

---

## 🔌 Integraciones Detalladas

### Sistema de Temas
```typescript
// Estructura de tema
interface Theme {
  id: string;
  name: string;
  primary: string;      // Color primario
  secondary: string;    // Color secundario
  background: string;   // Fondo
  text: string;         // Texto
  accent: string;       // Acentos
  isDark: boolean;      // Modo oscuro
  logo?: string;        // URL del logo
  banner?: string;      // URL del banner
}
```

### Sistema de Autenticación
```typescript
// JWT Payload
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'moderador' | 'usuario';
  iat: number;          // Issued at
  exp: number;          // Expiration
}
```

---

## 📊 Flujo de CI/CD (Futuro)

```
GitHub Push
   │
   ├─ GitHub Actions
   │
   ├─ Tests
   ├─ Linting
   ├─ Build
   │
   ├─ Si success:
   │   ├─ Deploy Frontend → Vercel/Netlify
   │   ├─ Deploy Backend → Railway/Render
   │   └─ Notificar admins
   │
   └─ Si failure:
       └─ Notificar desarrolladores
```

---

## 🧪 Estrategia de Testing

### Frontend
- Unit tests: Jest + React Testing Library
- E2E tests: Cypress
- Coverage mínimo: 80%

### Backend
- Unit tests: Jest
- Integration tests: Supertest
- Coverage mínimo: 85%

### Chatbot
- Unit tests: Jest
- Mock de APIs externas
- Testing de prompts

---

## 📈 Escalabilidad

### Base de Datos
- Actualmente: SQLite (desarrollo)
- Próximo paso: PostgreSQL (producción)
- Índices en campos frecuentes
- Caché con Redis

### Backend
- Stateless (fácil de escalar)
- Load balancer con nginx
- Environment variables para configuración

### Frontend
- CDN para assets estáticos
- Compresión Gzip
- Lazy loading de componentes

---

## 🚀 Despliegue

### Local (Desarrollo)
```bash
# Frontend
npm run dev

# Backend
npm run start:dev

# Base de datos
npm run db:init
```

### Staging
```bash
Docker Compose para servicio completo
Base de datos separada
Variables de entorno de staging
```

### Producción
```bash
Frontend: Vercel/Netlify (autodeployment)
Backend: Railway/Render (con monitoreo)
Base de datos: Managed PostgreSQL
CDN: Cloudflare
```

---

## 🔍 Monitoreo

- Logs: Winston/Morgan
- APM: New Relic o Datadog
- Uptime: StatusPage.io
- Errores: Sentry

---

**Última Actualización:** 10 de enero de 2026

