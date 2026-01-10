'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

interface AuditLog {
  id: number
  user_id: number
  action: string
  resource: string
  created_at: string
  email: string
}

export default function Audit() {
  const { token } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/audit?limit=100&offset=0`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setLogs(response.data)
    } catch (err: any) {
      setError('Error al cargar logs')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Registro de Auditoría</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Fecha</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Usuario</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Acción</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Recurso</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-900">{log.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">{log.resource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
