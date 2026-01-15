# 🧪 GUÍA COMPLETA: Testing WhatsApp en Vivo

**Fecha:** 15 de enero de 2026  
**Versión:** 2.0 (Con validación de firmas)  
**Estado:** Listo para producción

---

## 📋 Requisitos Previos

- [ ] Acceso a cuenta Meta Business o Twilio
- [ ] `ngrok` instalado (`brew install ngrok` en Mac)
- [ ] Backend ejecutándose (`./start-services.sh`)
- [ ] Credenciales configuradas en admin panel
- [ ] Número de WhatsApp de prueba

---

## 🚀 Paso 1: Exponer Backend con ngrok

### 1.1 Instalar ngrok
```bash
# Mac
brew install ngrok

# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok-v3-stable-linux-amd64.zip | unzip -
sudo mv ngrok /usr/local/bin

# Windows
# Descargar desde https://ngrok.com/download
```

### 1.2 Ejecutar ngrok
```bash
# Abrir terminal nueva
ngrok http 3001
```

**Resultado esperado:**
```
Session Status                online
Account                       <tu-email>
Version                       3.x.x
Region                        us (United States)
Forwarding                    https://abc123.ngrok.io -> http://localhost:3001
```

**⚠️ IMPORTANTE:** Copiar la URL HTTPS (`https://abc123.ngrok.io`)

---

## 🔧 Paso 2: Configurar Credenciales en Admin Panel

### 2.1 Acceder al panel
```
http://localhost:3000/dashboard/config
```

**Credenciales:**
- Email: `admin@fciacientifica.com.ar`
- Password: `cientifica123`

### 2.2 Llenar Configuración de WhatsApp

#### **Opción A: Meta WhatsApp Cloud API**

1. **Proveedor:** Seleccionar `Meta (WhatsApp Cloud API)`
2. **Número de WhatsApp:** Tu número empresarial (ej: `+5491234567`)
3. **API Token:** Token permanente de Meta Business Manager
   - Obtener en: https://developers.facebook.com → App Dashboard → Settings → System User
4. **Phone Number ID:** ID del número de teléfono
   - Obtener en: https://developers.facebook.com → WhatsApp Business → API Setup
5. **Verify Token:** Token secreto que TÚ defines (ej: `mi_token_secreto_2024`)

**Guardar configuración** con botón único de WhatsApp.

#### **Opción B: Twilio**

1. **Proveedor:** Seleccionar `Twilio`
2. **Número de WhatsApp:** Número de Twilio (ej: `+14155238886`)
3. **Account SID:** De https://console.twilio.com
4. **Auth Token:** De https://console.twilio.com
5. **Número de Twilio:** Desde Messaging → Try it out

**Guardar configuración.**

---

## 🔐 Paso 3: Configurar Webhook en Proveedor

### **Para Meta (Recomendado)**

1. Ir a: https://developers.facebook.com → App Dashboard
2. Buscar **WhatsApp → Configuration**
3. Sección **Webhook:**
   - **Callback URL:** `https://abc123.ngrok.io/api/webhooks/whatsapp` (reemplazar ngrok URL)
   - **Verify Token:** El mismo que pusiste en admin (`mi_token_secreto_2024`)
   - **Subscribe to events:** Seleccionar:
     - `messages` ✅
     - `message_status` (opcional)
     - `message_template_status_update` (opcional)
4. **Guardar** cambios

### **Para Twilio**

1. Ir a: https://console.twilio.com → Messaging → WhatsApp
2. **Sandbox Settings:**
   - **When a message comes in:** `https://abc123.ngrok.io/api/webhooks/whatsapp`
   - **Method:** HTTP POST
3. **Guardar**

---

## ✅ Paso 4: Verificar Webhook

### 4.1 Usar script de test (Recomendado)
```bash
./test-whatsapp.sh
```

**Debería mostrar:**
```
✅ Login exitoso
✅ Configuración de WhatsApp correcta
✅ Webhook verificado
✅ Mensaje de prueba enviado
✅ Webhook entrante simulado
```

### 4.2 Verificación manual con curl

#### Verificar conexión (GET)
```bash
curl -X GET "https://abc123.ngrok.io/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=mi_token_secreto_2024&hub.challenge=test_challenge_123"
```

**Respuesta esperada:**
```
test_challenge_123
```

#### Simular mensaje entrante (POST)
```bash
curl -X POST https://abc123.ngrok.io/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -H "x-hub-signature-256: sha256=<firma>" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "123456",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "5491234567",
            "phone_number_id": "123456789"
          },
          "messages": [{
            "from": "5491234567",
            "id": "wamid.123",
            "timestamp": "1673898307",
            "text": {
              "body": "Hola, ¿tienen ivermectina?"
            },
            "type": "text"
          }]
        }
      }]
    }]
  }'
```

---

## 📱 Paso 5: Prueba End-to-End (Real)

### 5.1 Enviar mensaje desde WhatsApp

1. Abrir WhatsApp en teléfono
2. Enviar mensaje al número de la farmacia
3. **Esperar respuesta (30-60 segundos)**

### 5.2 Ver en logs

```bash
./view-logs.sh
# O
tail -f backend/backend.log
```

**Debería ver:**
```
📨 Webhook recibido: {...}
✅ Firma de Meta verificada
→ Mensaje procesado: "¿Tienen ivermectina?"
→ Llamando LLM (Groq/OpenAI)...
← Respuesta de IA: "Sí, tenemos ivermectina..."
→ Enviando a WhatsApp...
✅ Mensaje enviado a +5491234567
```

### 5.3 Verificar en BD

```bash
sqlite3 backend/data/farmaweb.db "SELECT * FROM chat_conversations LIMIT 1;"
sqlite3 backend/data/farmaweb.db "SELECT * FROM chat_messages LIMIT 5;"
```

---

## 🐛 Troubleshooting

### ❌ "Verificación fallida"
**Causa:** Verify token incorrecto o webhook URL mal configurada  
**Solución:** 
- Comprobar token en admin panel
- Verificar URL ngrok es correcta y activa (`ngrok http 3001`)
- Probar sin Bearer token en URL

### ❌ "Firma de webhook inválida"
**Causa:** X-Hub-Signature-256 incorrecta o token de verificación cambiado  
**Solución:**
- Asegurar que `meta_verify_token` en BD coincida con Meta Dashboard
- Comprobar que ngrok reenvia el header `x-hub-signature-256`

### ❌ "Sin respuesta de WhatsApp"
**Causa:** LLM no configurada o sin balance  
**Solución:**
- Verificar API key de Groq/OpenAI válida
- Comprobar límites de API (balance, rate limit)
- Ver logs: `./view-logs.sh`

### ❌ "ngrok connection refused"
**Causa:** Backend no está ejecutándose  
**Solución:**
```bash
./start-services.sh
# Esperar 3-5 segundos
ngrok http 3001
```

---

## 🔄 Actualizar webhook en producción

Si cambias la URL ngrok:

1. **Detener servicios:**
   ```bash
   ./stop-services.sh
   ```

2. **Iniciar nuevamente:**
   ```bash
   ./start-services.sh
   ngrok http 3001  # Nueva URL ngrok
   ```

3. **Actualizar en Meta/Twilio:**
   - Dashboard → WhatsApp → Configuration
   - Cambiar Callback URL
   - Verificar nuevamente

---

## 📊 Monitoreo en Producción

### Métricas recomendadas a trackear:
- ✅ Mensajes recibidos/día
- ✅ Tiempo promedio de respuesta
- ✅ Tasa de errores de LLM
- ✅ Conversaciones activas

### Ver estadísticas:
```bash
# Mensajes hoy
sqlite3 backend/data/farmaweb.db "SELECT COUNT(*) FROM chat_messages WHERE DATE(created_at) = DATE('now', 'localtime');"

# Conversaciones únicas
sqlite3 backend/data/farmaweb.db "SELECT COUNT(DISTINCT phone_number) FROM chat_conversations;"

# Errores
tail -f backend/backend.log | grep "ERROR\|❌"
```

---

## 🔐 Checklist de Seguridad Pre-Producción

- [ ] Verify token es fuerte y aleatorio
- [ ] X-Hub-Signature-256 se valida en cada request
- [ ] Rate limiting configurado (próxima versión)
- [ ] API keys de LLM en variables de entorno (NO en código)
- [ ] Logs no exponen datos sensibles
- [ ] Backups de BD son automáticos
- [ ] Dominio HTTPS real (NO ngrok)
- [ ] Firewall restringe acceso a API internas

---

## 📞 Contacto y Soporte

**Documentación oficial:**
- Meta: https://developers.facebook.com/docs/whatsapp/cloud-api
- Twilio: https://www.twilio.com/docs/whatsapp

**En caso de problemas:**
1. Revisar logs: `./view-logs.sh`
2. Ejecutar test: `./test-whatsapp.sh`
3. Consultar GitHub Issues: https://github.com/Yupick/farmaweb/issues

---

**Última actualización:** 15 de enero de 2026  
**Versión:** 2.0 (Con validación de firmas y CI/CD)  
**Status:** ✅ Listo para producción
