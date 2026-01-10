#!/bin/bash

# Configuración rápida de WhatsApp desde terminal
# Este script te guiará para configurar WhatsApp en la base de datos

DB_PATH="./backend/data/farmaweb.db"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         💬 CONFIGURACIÓN RÁPIDA DE WHATSAPP                   ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -f "$DB_PATH" ]; then
  echo "❌ Base de datos no encontrada en: $DB_PATH"
  echo "   Ejecuta primero: ./start-services.sh"
  exit 1
fi

echo "📝 Ingresa los datos de configuración de WhatsApp:"
echo ""

# Proveedor
echo "1. Proveedor de WhatsApp:"
echo "   [1] Meta (WhatsApp Cloud API)"
echo "   [2] Twilio"
read -p "   Elige opción (1/2): " provider_option

case $provider_option in
  1) PROVIDER="meta" ;;
  2) PROVIDER="twilio" ;;
  *) echo "❌ Opción inválida"; exit 1 ;;
esac

# Número de WhatsApp
read -p "2. Número de WhatsApp de la farmacia (ej: +5491112345678): " PHONE_NUMBER

if [ "$PROVIDER" == "meta" ]; then
  echo ""
  echo "📱 Configuración de Meta WhatsApp Cloud API:"
  read -p "   API Token (Access Token): " META_API_TOKEN
  read -p "   Phone Number ID: " META_PHONE_ID
  read -p "   Verify Token (define uno secreto): " META_VERIFY_TOKEN
  
  # Guardar en BD
  sqlite3 "$DB_PATH" <<SQL
UPDATE configurations SET value='$PROVIDER' WHERE key='whatsapp_provider';
UPDATE configurations SET value='$PHONE_NUMBER' WHERE key='whatsapp_phone_number';
UPDATE configurations SET value='$META_API_TOKEN' WHERE key='meta_api_token';
UPDATE configurations SET value='$META_PHONE_ID' WHERE key='meta_phone_id';
UPDATE configurations SET value='$META_VERIFY_TOKEN' WHERE key='meta_verify_token';
SQL

else
  echo ""
  echo "📱 Configuración de Twilio WhatsApp:"
  read -p "   Account SID: " TWILIO_ACCOUNT_SID
  read -p "   Auth Token: " TWILIO_AUTH_TOKEN
  read -p "   Número de WhatsApp de Twilio (ej: whatsapp:+14155238886): " TWILIO_WHATSAPP_NUMBER
  
  # Guardar en BD
  sqlite3 "$DB_PATH" <<SQL
UPDATE configurations SET value='$PROVIDER' WHERE key='whatsapp_provider';
UPDATE configurations SET value='$PHONE_NUMBER' WHERE key='whatsapp_phone_number';
UPDATE configurations SET value='$TWILIO_ACCOUNT_SID' WHERE key='twilio_account_sid';
UPDATE configurations SET value='$TWILIO_AUTH_TOKEN' WHERE key='twilio_auth_token';
UPDATE configurations SET value='$TWILIO_WHATSAPP_NUMBER' WHERE key='twilio_whatsapp_number';
SQL

fi

echo ""
echo "✅ Configuración guardada exitosamente en la base de datos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 Próximos pasos:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Exponer backend con HTTPS (ngrok):"
echo "   ngrok http 3001"
echo ""
echo "2. Configurar webhook en $PROVIDER:"

if [ "$PROVIDER" == "meta" ]; then
  echo "   • URL: https://TU_DOMINIO.ngrok.io/api/webhooks/whatsapp"
  echo "   • Verify Token: $META_VERIFY_TOKEN"
  echo "   • Subscribe to: messages"
else
  echo "   • URL: https://TU_DOMINIO.ngrok.io/api/webhooks/whatsapp"
  echo "   • Método: HTTP POST"
fi

echo ""
echo "3. Probar integración:"
echo "   ./test-whatsapp.sh"
echo ""
echo "4. Ver documentación completa:"
echo "   cat docs/WHATSAPP_SETUP.md"
echo ""
