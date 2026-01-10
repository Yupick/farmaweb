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

  // General settings
  const [pharmacyName, setPharmacyName] = useState('')
  const [pharmacySlogan, setPharmacySlogan] = useState('')
  const [pharmacyEmail, setPharmacyEmail] = useState('')
  const [pharmacyPhone, setPharmacyPhone] = useState('')
  const [pharmacyWhatsapp, setPharmacyWhatsapp] = useState('')
  const [pharmacyAddress, setPharmacyAddress] = useState('')
  const [headerLinks, setHeaderLinks] = useState('')
  const [footerLinks, setFooterLinks] = useState('')

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

      // Initialize General settings
      setPharmacyName(response.data['pharmacy_name'] || '')
      setPharmacySlogan(response.data['pharmacy_slogan'] || '')
      setPharmacyEmail(response.data['pharmacy_email'] || '')
      setPharmacyPhone(response.data['pharmacy_phone'] || '')
      setPharmacyWhatsapp(response.data['pharmacy_whatsapp'] || '')
      setPharmacyAddress(response.data['pharmacy_address'] || '')
      setHeaderLinks(response.data['header_links'] || '')
      setFooterLinks(response.data['footer_links'] || '')
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
          💬 Configuración de Chatbot Cliente (WhatsApp)
        </h2>
        
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> El chatbot cliente utiliza el mismo proveedor de IA y modelo que la configuración administrativa, pero con su propio system prompt.
          </p>
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enlaces Cabecera (JSON)</label>
            <textarea rows={5} value={headerLinks} onChange={(e)=>setHeaderLinks(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder='[{"label":"Sobre","slug":"sobre"}]' />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enlaces Pie (JSON)</label>
            <textarea rows={5} value={footerLinks} onChange={(e)=>setFooterLinks(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder='[{"label":"Políticas","slug":"politicas"}]' />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={()=>saveConfig('pharmacy_name', pharmacyName)} className="px-4 py-2 bg-gray-800 text-white rounded">Guardar Nombre</button>
          <button onClick={()=>saveConfig('pharmacy_slogan', pharmacySlogan)} className="px-4 py-2 bg-gray-800 text-white rounded">Guardar Slogan</button>
          <button onClick={()=>saveConfig('pharmacy_email', pharmacyEmail)} className="px-4 py-2 bg-gray-800 text-white rounded">Guardar Email</button>
          <button onClick={()=>saveConfig('pharmacy_phone', pharmacyPhone)} className="px-4 py-2 bg-gray-800 text-white rounded">Guardar Teléfono</button>
          <button onClick={()=>saveConfig('pharmacy_whatsapp', pharmacyWhatsapp)} className="px-4 py-2 bg-gray-800 text-white rounded">Guardar WhatsApp</button>
          <button onClick={()=>saveConfig('pharmacy_address', pharmacyAddress)} className="px-4 py-2 bg-gray-800 text-white rounded">Guardar Dirección</button>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={()=>saveConfig('header_links', headerLinks)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar Enlaces Cabecera</button>
          <button onClick={()=>saveConfig('footer_links', footerLinks)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar Enlaces Pie</button>
        </div>
      </div>
    </div>
  )
}
