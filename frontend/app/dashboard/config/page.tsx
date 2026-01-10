'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

interface Config {
  [key: string]: string
}

// Modelos disponibles por proveedor
const MODELS = {
  groq: [
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Recomendado)' },
    { id: 'llama2-70b-4096', name: 'Llama 2 70B' },
  ],
  openai: [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Recomendado)' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  ]
};

export default function Config() {
  const { token } = useAuth()
  const [config, setConfig] = useState<Config>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // LLM Admin settings
  const [adminProvider, setAdminProvider] = useState<'groq' | 'openai'>('groq')
  const [adminModel, setAdminModel] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [adminSystemPrompt, setAdminSystemPrompt] = useState('')
  
  // Chatbot WhatsApp settings
  const [whatsappSystemPrompt, setWhatsappSystemPrompt] = useState('')
  
  // WhatsApp Provider settings
  const [whatsappProvider, setWhatsappProvider] = useState<'meta' | 'twilio'>('meta')
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState('')
  const [metaApiToken, setMetaApiToken] = useState('')
  const [metaPhoneId, setMetaPhoneId] = useState('')
  const [metaVerifyToken, setMetaVerifyToken] = useState('')
  const [twilioAccountSid, setTwilioAccountSid] = useState('')
  const [twilioAuthToken, setTwilioAuthToken] = useState('')
  const [twilioWhatsappNumber, setTwilioWhatsappNumber] = useState('')

  // General settings
  const [pharmacyName, setPharmacyName] = useState('')
  const [pharmacySlogan, setPharmacySlogan] = useState('')
  const [pharmacyEmail, setPharmacyEmail] = useState('')
  const [pharmacyPhone, setPharmacyPhone] = useState('')
  const [pharmacyWhatsapp, setPharmacyWhatsapp] = useState('')
  const [pharmacyAddress, setPharmacyAddress] = useState('')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/config`)
      setConfig(response.data)
      
      // Initialize LLM settings for admin chatbot
      setAdminProvider((response.data['llm_provider'] || 'groq') as 'groq' | 'openai')
      
      const provider = (response.data['llm_provider'] || 'groq') as 'groq' | 'openai'
      const modelKey = `llm_model_${provider}`
      setAdminModel(response.data[modelKey] || MODELS[provider][0].id)
      
      setGroqKey(response.data['groq_api_key'] || '')
      setOpenaiKey(response.data['openai_api_key'] || '')
      setAdminSystemPrompt(response.data['llm_system_prompt'] || '')
      
      // Initialize WhatsApp chatbot system prompt
      setWhatsappSystemPrompt(response.data['whatsapp_system_prompt'] || '')
      
      // Initialize WhatsApp Provider settings
      setWhatsappProvider((response.data['whatsapp_provider'] || 'meta') as 'meta' | 'twilio')
      setWhatsappPhoneNumber(response.data['whatsapp_phone_number'] || '')
      setMetaApiToken(response.data['meta_api_token'] || '')
      setMetaPhoneId(response.data['meta_phone_id'] || '')
      setMetaVerifyToken(response.data['meta_verify_token'] || '')
      setTwilioAccountSid(response.data['twilio_account_sid'] || '')
      setTwilioAuthToken(response.data['twilio_auth_token'] || '')
      setTwilioWhatsappNumber(response.data['twilio_whatsapp_number'] || '')

      // Initialize General settings
      setPharmacyName(response.data['pharmacy_name'] || '')
      setPharmacySlogan(response.data['pharmacy_slogan'] || '')
      setPharmacyEmail(response.data['pharmacy_email'] || '')
      setPharmacyPhone(response.data['pharmacy_phone'] || '')
      setPharmacyWhatsapp(response.data['pharmacy_whatsapp'] || '')
      setPharmacyAddress(response.data['pharmacy_address'] || '')
    } catch (err: any) {
      setError('Error al cargar configuraciones')
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = async (configKey: string, value: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/config/${configKey}`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setConfig({ ...config, [configKey]: value })
      setSuccess('Configuración guardada correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Error al guardar configuración')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSaveAdminLLM = async () => {
    try {
      setError('')
      setSuccess('')
      
      // Save provider
      await saveConfig('llm_provider', adminProvider)
      
      // Save model for selected provider
      await saveConfig(`llm_model_${adminProvider}`, adminModel)
      
      // Save API key
      if (adminProvider === 'groq') {
        await saveConfig('groq_api_key', groqKey)
      } else {
        await saveConfig('openai_api_key', openaiKey)
      }
      
      // Save system prompt
      await saveConfig('llm_system_prompt', adminSystemPrompt)
      
      setSuccess('Configuración de IA Administrativa guardada correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Error al guardar configuración de IA')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSaveWhatsappPrompt = async () => {
    try {
      setError('')
      await saveConfig('whatsapp_system_prompt', whatsappSystemPrompt)
      setSuccess('System prompt del chatbot cliente guardado correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Error al guardar system prompt')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSaveWhatsappProvider = async () => {
    try {
      setError('')
      setSuccess('')
      
      // Save provider
      await saveConfig('whatsapp_provider', whatsappProvider)
      
      // Save phone number
      await saveConfig('whatsapp_phone_number', whatsappPhoneNumber)
      
      // Save provider-specific credentials
      if (whatsappProvider === 'meta') {
        await saveConfig('meta_api_token', metaApiToken)
        await saveConfig('meta_phone_id', metaPhoneId)
        await saveConfig('meta_verify_token', metaVerifyToken)
      } else {
        await saveConfig('twilio_account_sid', twilioAccountSid)
        await saveConfig('twilio_auth_token', twilioAuthToken)
        await saveConfig('twilio_whatsapp_number', twilioWhatsappNumber)
      }
      
      setSuccess('Configuración de WhatsApp guardada correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Error al guardar configuración de WhatsApp')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSaveGeneralConfig = async () => {
    try {
      setError('')
      setSuccess('')
      
      // Save all general settings
      await saveConfig('pharmacy_name', pharmacyName)
      await saveConfig('pharmacy_slogan', pharmacySlogan)
      await saveConfig('pharmacy_email', pharmacyEmail)
      await saveConfig('pharmacy_phone', pharmacyPhone)
      await saveConfig('pharmacy_whatsapp', pharmacyWhatsapp)
      await saveConfig('pharmacy_address', pharmacyAddress)
      
      setSuccess('Configuraciones generales guardadas correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Error al guardar configuraciones generales')
      setTimeout(() => setError(''), 3000)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  const availableModels = MODELS[adminProvider];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuraciones del Sistema</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Admin Chatbot LLM Settings */}
      <div className="mb-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🤖 Configuración de IA - Chatbot Administrativo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor de IA
            </label>
            <select
              value={adminProvider}
              onChange={(e) => {
                const newProvider = e.target.value as 'groq' | 'openai'
                setAdminProvider(newProvider)
                setAdminModel(MODELS[newProvider][0].id)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="groq">Groq</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo
            </label>
            <select
              value={adminModel}
              onChange={(e) => setAdminModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {adminProvider === 'groq' ? 'Groq API Key' : 'OpenAI API Key'}
          </label>
          <input
            type="password"
            value={adminProvider === 'groq' ? groqKey : openaiKey}
            onChange={(e) => {
              if (adminProvider === 'groq') {
                setGroqKey(e.target.value)
              } else {
                setOpenaiKey(e.target.value)
              }
            }}
            placeholder={adminProvider === 'groq' ? 'gsk_...' : 'sk-...'}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {adminProvider === 'groq' 
              ? 'Obtén tu API Key en: https://console.groq.com'
              : 'Obtén tu API Key en: https://platform.openai.com'}
          </p>
        </div>

        {/* Admin System Prompt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt (Chatbot Administrativo)
          </label>
          <textarea
            value={adminSystemPrompt}
            onChange={(e) => setAdminSystemPrompt(e.target.value)}
            rows={5}
            placeholder="Define el comportamiento del asistente administrativo..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este prompt se usa solo para el chatbot administrativo interno
          </p>
        </div>

        <button
          onClick={handleSaveAdminLLM}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Guardar Configuración de IA Administrativa
        </button>
      </div>

      {/* WhatsApp Chatbot Settings */}
      <div className="mb-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💬 Configuración de WhatsApp
        </h2>
        
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> El chatbot WhatsApp utiliza el mismo proveedor de IA configurado arriba, pero con credenciales específicas de WhatsApp según el proveedor elegido.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor de WhatsApp
            </label>
            <select
              value={whatsappProvider}
              onChange={(e) => setWhatsappProvider(e.target.value as 'meta' | 'twilio')}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="meta">Meta (WhatsApp Cloud API)</option>
              <option value="twilio">Twilio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de WhatsApp de la Farmacia
            </label>
            <input
              type="text"
              value={whatsappPhoneNumber}
              onChange={(e) => setWhatsappPhoneNumber(e.target.value)}
              placeholder="+54911234567"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Número con código de país (ej: +54911234567)
            </p>
          </div>
        </div>

        {/* Meta Credentials */}
        {whatsappProvider === 'meta' && (
          <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Credenciales de Meta WhatsApp Cloud API
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Token (Access Token)
                </label>
                <input
                  type="password"
                  value={metaApiToken}
                  onChange={(e) => setMetaApiToken(e.target.value)}
                  placeholder="EAAxxxxxxxxxx..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Token permanente de tu app en Meta Business Manager
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={metaPhoneId}
                  onChange={(e) => setMetaPhoneId(e.target.value)}
                  placeholder="123456789012345"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ID del número de teléfono en WhatsApp Business Platform
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verify Token (para webhook)
                </label>
                <input
                  type="text"
                  value={metaVerifyToken}
                  onChange={(e) => setMetaVerifyToken(e.target.value)}
                  placeholder="mi_token_secreto_123"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Token que defines tú para verificar el webhook de Meta
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded">
              <p className="text-xs text-blue-900">
                <strong>📖 Documentación:</strong> <a href="https://developers.facebook.com/docs/whatsapp/cloud-api" target="_blank" className="underline">Meta WhatsApp Cloud API Docs</a>
              </p>
            </div>
          </div>
        )}

        {/* Twilio Credentials */}
        {whatsappProvider === 'twilio' && (
          <div className="mb-6 p-4 border-l-4 border-purple-500 bg-purple-50">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Credenciales de Twilio WhatsApp
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account SID
                </label>
                <input
                  type="text"
                  value={twilioAccountSid}
                  onChange={(e) => setTwilioAccountSid(e.target.value)}
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Account SID desde tu consola de Twilio
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auth Token
                </label>
                <input
                  type="password"
                  value={twilioAuthToken}
                  onChange={(e) => setTwilioAuthToken(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auth Token desde tu consola de Twilio
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de WhatsApp de Twilio
                </label>
                <input
                  type="text"
                  value={twilioWhatsappNumber}
                  onChange={(e) => setTwilioWhatsappNumber(e.target.value)}
                  placeholder="whatsapp:+14155238886"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número de WhatsApp de Twilio con prefijo "whatsapp:"
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-100 rounded">
              <p className="text-xs text-purple-900">
                <strong>📖 Documentación:</strong> <a href="https://www.twilio.com/docs/whatsapp" target="_blank" className="underline">Twilio WhatsApp API Docs</a>
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveWhatsappProvider}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mb-6"
        >
          Guardar Configuración de WhatsApp
        </button>

        <hr className="my-6 border-gray-200" />

        {/* WhatsApp System Prompt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt (Chatbot Cliente)
          </label>
          <textarea
            value={whatsappSystemPrompt}
            onChange={(e) => setWhatsappSystemPrompt(e.target.value)}
            rows={5}
            placeholder="Define el comportamiento del asistente de cliente para WhatsApp..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este prompt se usa para responder a clientes vía WhatsApp
          </p>
        </div>

        <button
          onClick={handleSaveWhatsappPrompt}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Guardar System Prompt del Cliente
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Configuraciones Generales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Comercio</label>
            <input value={pharmacyName} onChange={(e)=>setPharmacyName(e.target.value)} className="w-full px-3 py-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
            <input value={pharmacySlogan} onChange={(e)=>setPharmacySlogan(e.target.value)} className="w-full px-3 py-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={pharmacyEmail} onChange={(e)=>setPharmacyEmail(e.target.value)} className="w-full px-3 py-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input value={pharmacyPhone} onChange={(e)=>setPharmacyPhone(e.target.value)} className="w-full px-3 py-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
            <input value={pharmacyWhatsapp} onChange={(e)=>setPharmacyWhatsapp(e.target.value)} className="w-full px-3 py-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input value={pharmacyAddress} onChange={(e)=>setPharmacyAddress(e.target.value)} className="w-full px-3 py-2 border rounded"/>
          </div>
        </div>

        <button
          onClick={handleSaveGeneralConfig}
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          💾 Guardar Configuraciones Generales
        </button>
      </div>
    </div>
  )
}
