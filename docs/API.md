# 📡 API.md - Documentación de Endpoints

**Versión:** 1.0  
**Última Actualización:** 10 de enero de 2026  
**Base URL:** `http://localhost:3001/api` (Desarrollo)

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer {JWT_TOKEN}
```

### Obtener JWT
**POST** `/auth/login`
```json
{
  "email": "admin@farmamalvinas.com",
  "password": "cientifica123"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-admin-1",
    "email": "admin@farmamalvinas.com",
    "role": "admin"
  },
  "expiresIn": 86400
}
```

---

## 👥 Endpoints de Autenticación

### POST `/auth/login`
Inicio de sesión de usuario

**Body:**
```json
{
  "email": "admin@farmamalvinas.com",
  "password": "cientifica123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": { ... }
}
```

**Errores:**
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Email o contraseña vacíos

---

### POST `/auth/logout`
Cierre de sesión

**Headers:** Requiere `Authorization`

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST `/auth/refresh-token`
Renovar JWT (usar refresh token)

**Body:**
```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "token": "NEW_JWT_TOKEN",
  "expiresIn": 86400
}
```

---

### POST `/auth/change-password`
Cambiar contraseña del usuario

**Headers:** Requiere `Authorization`

**Body:**
```json
{
  "currentPassword": "cientifica123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 👤 Endpoints de Usuarios

### GET `/users`
Listar todos los usuarios (solo admin)

**Query Parameters:**
- `role`: Filtrar por rol (admin, moderador, usuario)
- `status`: Filtrar por estado (active, inactive)
- `page`: Número de página (default: 1)
- `limit`: Resultados por página (default: 10)

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "email": "user@email.com",
      "role": "admin",
      "status": "active",
      "lastLogin": "2026-01-10T14:30:00Z",
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### GET `/users/:id`
Obtener un usuario por ID

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "email": "user@email.com",
    "role": "admin",
    "status": "active",
    "lastLogin": "2026-01-10T14:30:00Z",
    "createdAt": "2026-01-01T10:00:00Z"
  }
}
```

---

### POST `/users`
Crear un nuevo usuario (solo admin)

**Body:**
```json
{
  "email": "newuser@email.com",
  "password": "SecurePassword123",
  "role": "moderador",
  "status": "active"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-new",
    "email": "newuser@email.com",
    "role": "moderador",
    "status": "active"
  }
}
```

---

### PUT `/users/:id`
Actualizar un usuario (solo admin)

**Body:**
```json
{
  "email": "updated@email.com",
  "role": "moderador",
  "status": "inactive"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

---

### DELETE `/users/:id`
Eliminar un usuario (solo admin)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 📝 Endpoints de Contenido

### GET `/content`
Listar todo el contenido (público)

**Query Parameters:**
- `type`: Filtrar por tipo (hero, banner, featured, carousel)
- `active`: Solo activo (true/false)
- `page`: Número de página
- `limit`: Resultados por página

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-content-1",
      "type": "hero",
      "title": "Bienvenido a Farmacia Científica Malvinas",
      "description": "Tu farmacia de confianza...",
      "imageUrl": "https://...",
      "position": 0,
      "isActive": true,
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET `/content/:id`
Obtener un contenido específico

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-content-1",
    "type": "hero",
    "title": "...",
    "description": "...",
    "imageUrl": "...",
    "metadata": { ... }
  }
}
```

---

### POST `/content`
Crear contenido (moderador+)

**Body:**
```json
{
  "type": "banner",
  "title": "Promoción Especial",
  "description": "Descuento en medicamentos...",
  "imageUrl": "https://...",
  "position": 1,
  "isActive": true,
  "metadata": {
    "link": "https://...",
    "backgroundColor": "#ffffff"
  }
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Content created successfully",
  "data": { ... }
}
```

---

### PUT `/content/:id`
Actualizar contenido (moderador+)

**Body:**
```json
{
  "title": "Nuevo Título",
  "description": "Nueva descripción",
  "isActive": true
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Content updated successfully",
  "data": { ... }
}
```

---

### DELETE `/content/:id`
Eliminar contenido (admin)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Content deleted successfully"
}
```

---

## ⚙️ Endpoints de Configuración

### GET `/config`
Obtener configuraciones (solo admin)

**Query Parameters:**
- `group`: Filtrar por grupo (llm, whatsapp, instagram, theme)

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "theme.current": "default",
    "llm.provider": "groq",
    "llm.apiKey": "***MASKED***",
    "pharmacy.name": "Farmacia Científica Malvinas",
    "pharmacy.phone": "+54 9 XXXXXXXXX"
  }
}
```

---

### GET `/config/:key`
Obtener una configuración específica

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "key": "llm.provider",
    "value": "groq",
    "group": "llm",
    "description": "Proveedor de LLM"
  }
}
```

---

### POST `/config`
Crear o actualizar configuración (solo admin)

**Body:**
```json
{
  "key": "llm.apiKey",
  "value": "gsk_xxxxxxxxxxxx",
  "group": "llm",
  "isSensitive": true
}
```

**Respuesta (201/200):**
```json
{
  "success": true,
  "message": "Configuration saved successfully",
  "data": { ... }
}
```

---

### PUT `/config/:key`
Actualizar una configuración

**Body:**
```json
{
  "value": "new_value"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Configuration updated",
  "data": { ... }
}
```

---

## 💬 Endpoints del Chatbot

### GET `/chatbot/conversations`
Listar conversaciones (solo admin)

**Query Parameters:**
- `status`: active, closed, archived
- `phone`: Filtrar por número
- `page`: Página
- `limit`: Límite

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-conv-1",
      "phoneNumber": "+54 9 1234567890",
      "customerId": "uuid-customer-1",
      "status": "active",
      "messageCount": 15,
      "lastMessageAt": "2026-01-10T14:30:00Z",
      "createdAt": "2026-01-05T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET `/chatbot/conversations/:id`
Obtener una conversación con historial

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-conv-1",
    "phoneNumber": "+54 9 1234567890",
    "customer": {
      "id": "uuid-customer-1",
      "name": "Juan García",
      "email": "juan@email.com",
      "address": "Calle Principal 123"
    },
    "messages": [
      {
        "id": "uuid-msg-1",
        "sender": "user",
        "content": "¿Tienen ibuprofeno?",
        "timestamp": "2026-01-10T14:00:00Z",
        "type": "text"
      },
      {
        "id": "uuid-msg-2",
        "sender": "bot",
        "content": "Sí, tenemos ibuprofeno 400mg...",
        "timestamp": "2026-01-10T14:00:05Z",
        "type": "text"
      }
    ],
    "status": "active",
    "createdAt": "2026-01-05T10:00:00Z"
  }
}
```

---

### POST `/chatbot/webhook/whatsapp`
Webhook para recibir mensajes de WhatsApp

**Headers:**
```
X-Hub-Signature: sha1=xxxxxxxxxxxx
```

**Body (enviado por WhatsApp):**
```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "5491234567890",
                "type": "text",
                "text": {
                  "body": "¿Tienen medicinas?"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Webhook received"
}
```

---

### POST `/chatbot/admin/chat`
Chat administrativo (solo admin)

**Body:**
```json
{
  "message": "¿Cuáles son las conversaciones de hoy?"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "response": "Hoy hay 5 conversaciones activas...",
    "conversationId": "uuid-admin-conv-1"
  }
}
```

---

### GET `/chatbot/admin/chat/:conversationId`
Obtener historial de chat administrativo

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid-admin-conv-1",
    "messages": [
      {
        "role": "user",
        "content": "¿Cuáles son los productos más vendidos?"
      },
      {
        "role": "assistant",
        "content": "Los productos más vendidos son..."
      }
    ]
  }
}
```

---

## 🏥 Endpoints de Farmacia (Próximas Fases)

### GET `/pharmacy/info`
Información de la farmacia (público)

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "name": "Farmacia Científica Malvinas",
    "phone": "+54 9 XXXXXXXXX",
    "email": "info@farmamalvinas.com",
    "address": "Calle Principal 123",
    "city": "Buenos Aires",
    "schedules": {
      "monday": "08:00-20:00",
      "tuesday": "08:00-20:00",
      "wednesday": "08:00-20:00",
      "thursday": "08:00-20:00",
      "friday": "08:00-20:00",
      "saturday": "09:00-19:00",
      "sunday": "closed"
    }
  }
}
```

---

### GET `/pharmacy/schedules`
Horarios de la farmacia

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "isOpen": true,
    "currentTime": "14:30",
    "schedules": { ... }
  }
}
```

---

## 🛒 Endpoints de Tienda (Fase 5+)

### GET `/products`
Listar productos (público)

### GET `/products/:id`
Obtener un producto

### POST `/products`
Crear producto (admin)

### PUT `/products/:id`
Actualizar producto (admin)

### DELETE `/products/:id`
Eliminar producto (admin)

---

## 🔍 Endpoints de Instagram

### GET `/instagram/posts`
Obtener últimos posts de Instagram (público)

**Query Parameters:**
- `limit`: Número de posts (default: 6)

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "17923455...",
        "caption": "Nueva promoción...",
        "mediaType": "IMAGE",
        "mediaUrl": "https://...",
        "timestamp": "2026-01-10T12:00:00Z"
      }
    ],
    "cached": true,
    "cacheExpires": "2026-01-10T13:00:00Z"
  }
}
```

---

## ❌ Códigos de Error

| Código | Descripción | Solución |
|--------|-------------|----------|
| 200 | OK - Solicitud exitosa | - |
| 201 | Created - Recurso creado | - |
| 400 | Bad Request - Datos inválidos | Verificar body de la solicitud |
| 401 | Unauthorized - Sin autenticación | Incluir token JWT |
| 403 | Forbidden - Sin permisos | Verificar rol del usuario |
| 404 | Not Found - Recurso no existe | Verificar ID |
| 422 | Unprocessable Entity - Validación | Verificar formato de datos |
| 429 | Too Many Requests - Rate limit | Esperar antes de reintentar |
| 500 | Internal Server Error | Contactar soporte |

---

## 🔄 Rate Limiting

- Límite global: 1000 requests por hora
- Login: 5 intentos por 15 minutos
- Webhook WhatsApp: Sin límite (confiable)
- Configuraciones: 100 cambios por hora

---

## 📚 Ejemplos de CURL

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@farmamalvinas.com",
    "password": "cientifica123"
  }'
```

### Crear Contenido
```bash
curl -X POST http://localhost:3001/api/content \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "banner",
    "title": "Promoción",
    "imageUrl": "https://..."
  }'
```

### Obtener Conversaciones
```bash
curl -X GET "http://localhost:3001/api/chatbot/conversations?status=active" \
  -H "Authorization: Bearer JWT_TOKEN"
```

---

**Última Actualización:** 10 de enero de 2026

