'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

interface Config {
  [key: string]: string
}

export default function Config() {
  const { token } = useAuth()
  const [config, setConfig] = useState<Config>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/config`)
      setConfig(response.data)
    } catch (err: any) {
      setError('Error al cargar configuraciones')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (key: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/config/${key}`,
        { value: editingValue },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setConfig({ ...config, [key]: editingValue })
      setEditingKey(null)
      setEditingValue('')
    } catch (err: any) {
      setError('Error al guardar configuración')
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuraciones del Sistema</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Parámetro</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(config).map(([key, value]) => (
              <tr key={key} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-900">{key}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingKey === key ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="font-mono">{value}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingKey === key ? (
                    <>
                      <button
                        onClick={() => handleSave(key)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setEditingKey(null)
                          setEditingValue('')
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingKey(key)
                        setEditingValue(value)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
