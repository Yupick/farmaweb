# Guía Rápida de Pruebas - FASE 2, 3 y 4

## 🚀 Inicio Rápido

### 1. Instalación de Dependencias

```bash
# Backend
cd backend
npm install nodemailer axios

# Frontend (ya incluido)
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

```bash
# backend/.env
GROQ_API_KEY=gsk_... # https://console.groq.com
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_BUSINESS_ACCOUNT_ID=...
EMAIL_SERVICE=gmail
EMAIL_USER=admin@fciacientifica.com.ar
EMAIL_PASSWORD=app_password_here
```

### 3. Iniciar Servidor

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

---

## ✅ Pruebas de Endpoints

### FASE 2 - Content Management

#### 1. Crear Contenido (Admin)

```bash
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "hero",
    "title": "Bienvenido a Farmacia Científica",
    "description": "Tu farmacia de confianza",
    "image_url": "https://example.com/image.jpg"
  }'
```

#### 2. Obtener Todo Contenido (Público)

```bash
curl http://localhost:5000/api/content
```

#### 3. Filtrar por Tipo

```bash
curl http://localhost:5000/api/content/type/hero
curl http://localhost:5000/api/content/type/featured
```

**Tipos Válidos**: `hero`, `banner`, `featured`, `carousel`, `testimonial`

---

### FASE 3 - Chatbot

#### 1. Enviar Mensaje (WhatsApp)

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+5492944123456",
    "userName": "Juan",
    "message": "¿Cuáles son los horarios?"
  }'
```

**Respuesta Esperada**:
```json
{
  "conversationId": 1,
  "userMessage": "¿Cuáles son los horarios?",
  "botResponse": "Nuestro horario de atención es de lunes a viernes 8:00 AM - 6:00 PM...",
  "timestamp": "2026-01-10T15:30:00Z"
}
```

#### 2. Obtener Conversaciones (Admin)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/chat
```

#### 3. Obtener Mensajes de Conversación (Admin)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/chat/1/messages
```

#### 4. Temas Que el Chatbot Entiende

- "¿Cuáles son los horarios?" → Respuesta de horarios
- "¿Dónde están?" → Dirección y ubicación
- "¿Qué productos tiene?" → Info de productos
- "¿Hacen envíos?" → Info de delivery
- "Quiero reservar un producto" → Info de reservaciones
- "¿Cómo me contacto?" → Contactos

---

### FASE 4 - Integraciones

#### A. Instagram

```bash
# Obtener perfil
curl http://localhost:5000/api/instagram/profile

# Obtener feed actual
curl http://localhost:5000/api/instagram/feed?limit=9

# Sincronizar feed (admin)
curl -X POST http://localhost:5000/api/instagram/sync \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### B. Email

```bash
# Enviar email de prueba (admin)
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "to": "cliente@example.com",
    "subject": "Prueba de Email",
    "message": "Este es un email de prueba"
  }'

# Obtener logs (admin)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/email/logs
```

#### C. Reservaciones

```bash
# Crear reserva (público desde WhatsApp/Web)
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+5492944123456",
    "email": "cliente@example.com",
    "productId": 1,
    "quantity": 2,
    "notes": "Urgente"
  }'

# Obtener reservas (admin)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/reservations

# Actualizar estado (admin)
curl -X PUT http://localhost:5000/api/reservations/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "confirmed"}'

# Estadísticas (admin)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/reservations/stats
```

**Estados Válidos**: `pending`, `confirmed`, `completed`, `cancelled`

#### D. Búsqueda de Productos

```bash
# Búsqueda básica
curl "http://localhost:5000/api/search/products?q=paracetamol"

# Búsqueda avanzada con filtros
curl "http://localhost:5000/api/search/products?q=vitamina&category=suplementos&minPrice=100&maxPrice=500&sort=price_asc&page=1&limit=20"

# Por categoría
curl http://localhost:5000/api/search/category/medicamentos

# Productos destacados
curl http://localhost:5000/api/search/featured

# Por marca
curl "http://localhost:5000/api/search/brand?brand=Gador"

# Categorías disponibles
curl http://localhost:5000/api/search/categories

# Productos relacionados
curl http://localhost:5000/api/search/suggestions/5
```

**Parámetros**:
- `q` - Término de búsqueda
- `category` - Categoría
- `minPrice` / `maxPrice` - Rango de precio
- `sort` - `price_asc`, `price_desc`, `name`, `popular`, `newest`
- `page` - Número de página
- `limit` - Resultados por página (máx 100)

---

## 🎯 Flujo de Usuario Típico

### 1. Cliente Visitando Landing Page
```
1. GET /api/content → Carga hero, banners, featured
2. Frontend renderiza landing page
3. Usuario interactúa con carousel/galería
```

### 2. Cliente Chateando por WhatsApp
```
1. Cliente envía: "¿Tienen vitamina C?"
2. POST /api/chat/message
3. LLM responde con información de productos
4. Conversación guardada en BD
5. Admin ve en dashboard `/dashboard/chat`
```

### 3. Cliente Haciendo Reservación
```
1. Cliente solicita: "Quiero reservar vitamina C"
2. POST /api/reservations con datos
3. Email de confirmación enviado automáticamente
4. Admin ve en `/api/reservations`
5. Admin confirma y cliente recibe notificación
```

### 4. Admin Actualizando Contenido
```
1. Admin login → /dashboard/content
2. Crea nuevo contenido hero/banner
3. POST /api/content
4. Landing page se actualiza automáticamente
```

---

## 🔧 Troubleshooting

### Error: "Groq API key not configured"
✓ Solución: Agregar `GROQ_API_KEY` en `.env`

### Error: "Instagram credentials not configured"  
✓ Solución: Agregar `INSTAGRAM_ACCESS_TOKEN` y `INSTAGRAM_BUSINESS_ACCOUNT_ID`

### Error: "Email service not initialized"
✓ Solución: Configurar `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`

### Chat no responde
✓ Solución: 
- Verificar `GROQ_API_KEY` válido
- Si falla, usa fallback FAQ
- Revisar logs del servidor

### Búsqueda lenta
✓ Solución:
- Se crean índices automáticamente en BD
- Ejecutar: `npm run db:seed` para datos de prueba

---

## 📊 Base de Datos

### Crear Productos de Prueba

```sql
INSERT INTO products (name, description, sku, category, brand, price, stock, featured) VALUES
  ('Paracetamol 500mg', 'Analgésico y antipirético', 'PARACETAMOL500', 'medicamentos', 'Gador', 45.50, 100, 1),
  ('Vitamina C 1000mg', 'Suplemento de Vitamina C', 'VITC1000', 'suplementos', 'Centrum', 120.00, 50, 1),
  ('Ibuprofeno 400mg', 'Antiinflamatorio', 'IBU400', 'medicamentos', 'Actron', 65.00, 75, 0);
```

### Ver Conversaciones

```sql
SELECT * FROM chat_conversations;
SELECT * FROM chat_messages WHERE conversation_id = 1;
```

### Ver Reservaciones

```sql
SELECT * FROM reservations;
SELECT * FROM reservations WHERE status = 'pending';
```

---

## 🎨 Interfaces Web

### Frontend URLs

| Página | URL | Acceso |
|--------|-----|--------|
| Landing | http://localhost:3000/ | Público |
| Login | http://localhost:3000/login | Público |
| Dashboard | http://localhost:3000/dashboard | Admin |
| Content Manager | http://localhost:3000/dashboard/content | Admin |
| Chat | http://localhost:3000/dashboard/chat | Admin |

---

## 📱 Códigos HTTP Esperados

| Status | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no existe |
| 500 | Server Error - Error en servidor |

---

## ⏱️ Tiempos de Respuesta Esperados

- GET content: < 100ms
- POST chat message: < 2000ms (incluye IA)
- GET reservations: < 200ms
- Search products: < 500ms
- Email send: < 3000ms

---

## 📝 Ejemplo de Flujo Completo

```bash
# 1. Login y obtener token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fciacientifica.com.ar","password":"admin123"}' \
  | jq -r '.token')

# 2. Crear contenido nuevo
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"hero","title":"Nueva Oferta","description":"Vitaminas en promoción","image_url":"https://..."}'

# 3. Cliente entra a landing page
# http://localhost:3000 → Ve el nuevo contenido

# 4. Cliente chatea
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+549...","userName":"Juan","message":"¿Tienen promoción?"}'

# 5. Admin ve conversación
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/chat

# 6. Cliente reserva producto
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+549...","email":"juan@...","productId":1,"quantity":2}'

# 7. Email confirmación enviado automáticamente
```

---

*Versión: 1.0*  
*Última actualización: 10 Enero 2026*
