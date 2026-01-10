#!/bin/bash

# Script de prueba para WhatsApp Integration
# Asume que los servicios están corriendo

API_URL="http://localhost:3001"
ADMIN_EMAIL="admin@fciacientifica.com.ar"
ADMIN_PASSWORD="cientifica123"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🧪 TEST WHATSAPP INTEGRATION                          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Login
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 PASO 1: Autenticación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TOKEN=$(curl -sS -X POST "$API_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | \
  sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener token"
  exit 1
fi

echo "✅ Token obtenido"
echo ""

# 2. Verificar configuración de WhatsApp
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PASO 2: Verificar configuración de WhatsApp"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CONFIG=$(curl -sS "$API_URL/api/config")

PROVIDER=$(echo "$CONFIG" | grep -o '"whatsapp_provider":"[^"]*"' | cut -d'"' -f4)
PHONE=$(echo "$CONFIG" | grep -o '"whatsapp_phone_number":"[^"]*"' | cut -d'"' -f4)

echo "Proveedor: ${PROVIDER:-no configurado}"
echo "Número: ${PHONE:-no configurado}"

if [ -z "$PROVIDER" ] || [ "$PROVIDER" == "null" ]; then
  echo "⚠️  WhatsApp no está configurado. Configúralo desde el panel admin."
  echo ""
fi

# 3. Test webhook verification (Meta)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 PASO 3: Test verificación de webhook (Meta)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VERIFY_TOKEN=$(echo "$CONFIG" | grep -o '"meta_verify_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$VERIFY_TOKEN" ] && [ "$VERIFY_TOKEN" != "null" ]; then
  CHALLENGE="test_challenge_12345"
  VERIFY_RESULT=$(curl -sS "$API_URL/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=$VERIFY_TOKEN&hub.challenge=$CHALLENGE")
  
  if [ "$VERIFY_RESULT" == "$CHALLENGE" ]; then
    echo "✅ Verificación de webhook exitosa"
  else
    echo "❌ Verificación de webhook fallida"
    echo "   Esperado: $CHALLENGE"
    echo "   Recibido: $VERIFY_RESULT"
  fi
else
  echo "⚠️  Verify Token no configurado (solo para Meta)"
fi

echo ""

# 4. Test endpoint de prueba
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 PASO 4: Test envío de mensaje"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$PHONE" ] && [ "$PHONE" != "null" ]; then
  echo "Intentando enviar mensaje de prueba a: $PHONE"
  
  TEST_RESULT=$(curl -sS -X POST "$API_URL/api/webhooks/whatsapp/test" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"to\":\"$PHONE\",\"message\":\"🧪 Test desde script - $(date)\"}")
  
  if echo "$TEST_RESULT" | grep -q "success"; then
    echo "✅ Mensaje de prueba enviado correctamente"
    echo "   Respuesta: $TEST_RESULT"
  else
    echo "❌ Error enviando mensaje de prueba"
    echo "   Respuesta: $TEST_RESULT"
  fi
else
  echo "⚠️  Número de WhatsApp no configurado, omitiendo test de envío"
fi

echo ""

# 5. Simular webhook entrante (Meta)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📨 PASO 5: Simular webhook entrante (Meta)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$PROVIDER" == "meta" ]; then
  echo "Simulando mensaje entrante de Meta..."
  
  WEBHOOK_PAYLOAD='{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "15551234567",
            "phone_number_id": "PHONE_NUMBER_ID"
          },
          "contacts": [{
            "profile": {
              "name": "Test User"
            },
            "wa_id": "5491112345678"
          }],
          "messages": [{
            "from": "5491112345678",
            "id": "wamid.test123",
            "timestamp": "'$(date +%s)'",
            "text": {
              "body": "Hola, necesito información sobre horarios"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }'
  
  WEBHOOK_RESULT=$(curl -sS -X POST "$API_URL/api/webhooks/whatsapp" \
    -H 'Content-Type: application/json' \
    -d "$WEBHOOK_PAYLOAD")
  
  if [ "$WEBHOOK_RESULT" == "EVENT_RECEIVED" ]; then
    echo "✅ Webhook procesado correctamente"
    echo "   El mensaje se está procesando de forma asíncrona..."
    echo "   Verifica los logs para ver la respuesta de IA"
  else
    echo "❌ Error procesando webhook"
    echo "   Respuesta: $WEBHOOK_RESULT"
  fi
else
  echo "⚠️  Proveedor no es Meta, omitiendo simulación"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         ✅ TESTS COMPLETADOS                                  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Revisa los logs para más detalles:"
echo "   tail -f backend/backend.log"
echo ""
