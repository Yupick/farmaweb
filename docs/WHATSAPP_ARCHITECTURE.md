# 🤖 Arquitectura de WhatsApp + IA

## Flujo Completo de Mensajes

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO EN WHATSAPP                         │
│                    Envía: "¿Cuál es el horario?"                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Mensaje vía WhatsApp
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PROVEEDOR (Meta o Twilio)                        │
│  • Meta: WhatsApp Cloud API                                         │
│  • Twilio: WhatsApp Business API                                    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP POST Webhook
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Webhook Endpoint                       │
│              POST /api/webhooks/whatsapp                            │
│                                                                     │
│  whatsappController.handleIncomingMessage()                         │
│  ├─ Responde 200 OK inmediatamente                                 │
│  └─ Procesa mensaje asíncronamente:                                │
│                                                                     │
│     1. Parse mensaje según proveedor                                │
│        ├─ Meta: parseMetaWebhook()                                 │
│        └─ Twilio: parseTwilioWebhook()                             │
│                                                                     │
│     2. Buscar/Crear conversación                                    │
│        chatService.getConversationByPhone()                         │
│                                                                     │
│     3. Guardar mensaje del usuario                                  │
│        chatService.saveMessage()                                    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICIO DE IA (LLM)                             │
│              chatService.getAIResponseFromLLM()                     │
│                                                                     │
│  llmService.getAIResponse()                                         │
│  ├─ Lee configuración: proveedor, modelo, API key                  │
│  ├─ Lee system prompt específico para WhatsApp                     │
│  ├─ Consulta historial de conversación                             │
│  └─ Llama a Groq o OpenAI API                                      │
│                                                                     │
│  Respuesta: "Nuestro horario es de 8:00 a 20:00 hs..."            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Envío de Respuesta                     │
│                                                                     │
│  whatsappService.sendWhatsAppMessage()                              │
│  ├─ Lee configuración del proveedor                                │
│  └─ Envía según proveedor:                                         │
│     ├─ Meta: POST graph.facebook.com                               │
│     └─ Twilio: POST api.twilio.com                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP POST con respuesta
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PROVEEDOR (Meta o Twilio)                        │
│              Entrega mensaje al usuario                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO EN WHATSAPP                         │
│              Recibe: "Nuestro horario es..."                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Componentes Implementados

### 1. **whatsappService.js** (Servicio Principal)
- `getWhatsAppConfig()` - Lee credenciales de la BD
- `sendWhatsAppMessage()` - Enrutador según proveedor
- `sendMetaMessage()` - Envío vía Meta Cloud API
- `sendTwilioMessage()` - Envío vía Twilio
- `verifyWebhookToken()` - Verificación de webhook (Meta)
- `parseMetaWebhook()` - Extrae datos de webhook Meta
- `parseTwilioWebhook()` - Extrae datos de webhook Twilio

### 2. **whatsappController.js** (Controlador HTTP)
- `verifyWebhook()` - GET /api/webhooks/whatsapp (Meta)
- `handleIncomingMessage()` - POST /api/webhooks/whatsapp
- `processMessageAsync()` - Procesamiento asíncrono con IA
- `sendTestMessage()` - Endpoint de prueba manual

### 3. **routes/whatsapp.js** (Rutas)
- `GET /api/webhooks/whatsapp` - Verificación
- `POST /api/webhooks/whatsapp` - Mensajes entrantes
- `POST /api/webhooks/whatsapp/test` - Pruebas (autenticado)

### 4. **Configuraciones en BD**
```
whatsapp_provider          → 'meta' o 'twilio'
whatsapp_phone_number      → Número de la farmacia
whatsapp_system_prompt     → Prompt específico para clientes

# Meta
meta_api_token             → Access Token
meta_phone_id              → Phone Number ID
meta_verify_token          → Verify Token

# Twilio
twilio_account_sid         → Account SID
twilio_auth_token          → Auth Token
twilio_whatsapp_number     → Número de Twilio
```

## Seguridad y Mejoras Futuras

### ✅ Implementado
- Respuesta inmediata 200 OK al proveedor
- Procesamiento asíncrono de mensajes
- Persistencia de conversaciones
- Integración con LLM configurable
- Soporte multi-proveedor

### 🔜 Pendiente (Producción)
- Validación de firma de webhook (X-Hub-Signature-256, X-Twilio-Signature)
- Rate limiting por número de teléfono
- Circuit breaker para LLM
- Reintentos con backoff exponencial
- Métricas y monitoreo
- Caché de respuestas frecuentes
- Detección de spam/abuso
- Respuestas con templates de WhatsApp
- Soporte para mensajes multimedia
- Botones interactivos (Meta)

## Variables de Entorno Recomendadas

```bash
# .env (Producción)
WHATSAPP_PROVIDER=meta
WHATSAPP_PHONE_NUMBER=+5491112345678

# Meta
META_API_TOKEN=EAAxxxxxxxxxx
META_PHONE_ID=123456789012345
META_VERIFY_TOKEN=mi_token_secreto_seguro

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# LLM
GROQ_API_KEY=gsk_xxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxx
```

## Logs de Ejemplo

```
[2026-01-10T20:30:00.000Z] POST /api/webhooks/whatsapp
📨 Webhook recibido: {"entry":[{"changes":[{"value":{"messages":[...]}}]}]}
✅ Mensaje parseado: {from: "5491112345678", text: "hola"}
📝 Nueva conversación creada para 5491112345678
🤖 Consultando IA...
📤 Enviando respuesta a 5491112345678...
✅ Mensaje enviado vía Meta WhatsApp
✅ Mensaje procesado y enviado correctamente
```

## Testing

### Prueba Local
```bash
./test-whatsapp.sh
```

### Prueba con ngrok
```bash
# Terminal 1: Levantar servicios
./start-services.sh

# Terminal 2: Exponer con ngrok
ngrok http 3001

# Terminal 3: Monitorear logs
tail -f backend/backend.log
```

### Envío Manual
```bash
curl -X POST http://localhost:3001/api/webhooks/whatsapp/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"to":"+5491112345678","message":"Test"}'
```
