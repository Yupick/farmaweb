# Configuración de WhatsApp con IA

Esta guía te ayudará a configurar y probar la integración de WhatsApp con IA en Farmacia Científica.

## 📋 Requisitos Previos

### Para Meta WhatsApp Cloud API:
1. Cuenta de Meta Business
2. App de Meta con WhatsApp Business API activado
3. Obtener:
   - **API Token** (Access Token permanente)
   - **Phone Number ID** (ID del número de WhatsApp)
   - **Verify Token** (un string secreto que defines tú)

### Para Twilio:
1. Cuenta de Twilio
2. WhatsApp Sandbox activado o número verificado
3. Obtener:
   - **Account SID**
   - **Auth Token**
   - **Número de WhatsApp** (formato: `whatsapp:+14155238886`)

## 🔧 Configuración en el Panel Admin

1. **Acceder al panel:** `http://localhost:3000/dashboard/config`

2. **Sección "Configuración de IA - Chatbot Administrativo":**
   - Configurar proveedor de IA (Groq/OpenAI)
   - Ingresar API Key
   - Definir System Prompt para admin

3. **Sección "Configuración de WhatsApp":**
   - Seleccionar proveedor (Meta o Twilio)
   - Ingresar número de WhatsApp de la farmacia
   - Completar credenciales según el proveedor:
     - **Meta:** API Token, Phone Number ID, Verify Token
     - **Twilio:** Account SID, Auth Token, Número de WhatsApp
   - Guardar configuración
   - Configurar System Prompt del chatbot cliente

## 🌐 Exponer Backend con HTTPS

WhatsApp requiere HTTPS para webhooks. Usa **ngrok**:

```bash
# Instalar ngrok si no lo tienes
brew install ngrok  # macOS
# o descarga desde https://ngrok.com/download

# Exponer puerto 3001
ngrok http 3001
```

Copia la URL HTTPS generada (ej: `https://abc123.ngrok.io`)

## 📱 Configurar Webhook en Meta

1. Ve a **Meta App Dashboard** → Tu App → WhatsApp → Configuration
2. En **Webhook**, haz clic en **Edit**
3. **Callback URL:** `https://abc123.ngrok.io/api/webhooks/whatsapp`
4. **Verify Token:** El mismo que configuraste en el panel admin
5. **Subscribe to:** messages
6. Guarda y verifica el webhook

## 📱 Configurar Webhook en Twilio

1. Ve a **Twilio Console** → Messaging → Settings → WhatsApp Sandbox Settings
2. **When a message comes in:** `https://abc123.ngrok.io/api/webhooks/whatsapp`
3. Método: **HTTP POST**
4. Guarda la configuración

## 🧪 Pruebas

### Prueba 1: Verificar Webhook (Solo Meta)
```bash
curl "http://localhost:3001/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=TU_VERIFY_TOKEN&hub.challenge=12345"
```
Debe devolver: `12345`

### Prueba 2: Enviar Mensaje de Prueba
```bash
# Login para obtener token
TOKEN=$(curl -sS -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@fciacientifica.com.ar","password":"cientifica123"}' | \
  jq -r '.token')

# Enviar mensaje de prueba
curl -X POST http://localhost:3001/api/webhooks/whatsapp/test \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "+5491112345678",
    "message": "Hola, este es un mensaje de prueba desde Farmacia Científica"
  }'
```

### Prueba 3: Mensaje Real desde WhatsApp

**Meta:**
- Envía un mensaje al número de WhatsApp configurado desde tu celular
- El sistema debe responder automáticamente

**Twilio:**
- Únete al sandbox: envía el código join a tu número sandbox
- Envía cualquier mensaje
- El bot debe responder con IA

## 📊 Monitoreo de Logs

```bash
# Backend logs
tail -f backend/backend.log

# Ver en tiempo real
./view-logs.sh
```

Busca:
- `📨 Webhook recibido:` - Mensaje entrante
- `✅ Mensaje parseado:` - Extracción exitosa
- `🤖 Consultando IA...` - Llamada al LLM
- `📤 Enviando respuesta...` - Envío de respuesta
- `✅ Mensaje procesado y enviado correctamente` - Todo OK

## 🐛 Troubleshooting

### "Token de verificación incorrecto"
- Verifica que el Verify Token en el panel admin coincida exactamente con el de Meta

### "Configuración de Meta WhatsApp incompleta"
- Asegúrate de haber guardado API Token y Phone Number ID en el panel admin

### "Error enviando mensaje vía Meta"
- Verifica que el Access Token sea permanente (no temporal)
- Confirma permisos de la app: `whatsapp_business_messaging`

### "Error enviando mensaje vía Twilio"
- Verifica Account SID y Auth Token
- Confirma formato del número: `whatsapp:+14155238886`

### "No se reciben mensajes"
- Verifica que ngrok esté corriendo
- Confirma que el webhook esté subscrito a "messages"
- Revisa logs de Meta/Twilio para ver si están enviando el webhook

## 🔐 Seguridad en Producción

1. **Validar origen del webhook:**
   - Meta: verificar firma X-Hub-Signature-256
   - Twilio: verificar firma X-Twilio-Signature

2. **Rate limiting:** Limitar solicitudes por número

3. **Almacenar tokens en variables de entorno** (no en BD)

4. **HTTPS obligatorio** con certificado válido

## 📚 Documentación Oficial

- [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Groq API](https://console.groq.com/docs)
- [OpenAI API](https://platform.openai.com/docs)

## ✅ Checklist de Producción

- [ ] Dominio con HTTPS configurado
- [ ] Variables de entorno en servidor
- [ ] Webhook verificado y funcionando
- [ ] System prompts optimizados
- [ ] Rate limiting implementado
- [ ] Monitoreo y alertas configuradas
- [ ] Backup de conversaciones
- [ ] Logs centralizados
