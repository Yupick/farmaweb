'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardHome() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido al Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/users" className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Gestionar Usuarios</h3>
            <p className="text-blue-700">Crear, editar y eliminar usuarios</p>
          </Link>

          <Link href="/dashboard/content" className="p-6 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Contenido</h3>
            <p className="text-orange-700">Gestionar contenido de la landing page</p>
          </Link>

          <Link href="/dashboard/chat" className="p-6 bg-cyan-50 border border-cyan-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-cyan-900 mb-2">Chat WhatsApp</h3>
            <p className="text-cyan-700">Ver conversaciones de clientes</p>
          </Link>

          <Link href="/dashboard/admin-chat" className="p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">🤖 Chatbot Admin</h3>
            <p className="text-indigo-700">Asistente IA para consultas y gestión</p>
          </Link>

          <Link href="/dashboard/config" className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Configuraciones</h3>
            <p className="text-green-700">Parámetros del sistema</p>
          </Link>

          <Link href="/dashboard/audit" className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Auditoría</h3>
            <p className="text-purple-700">Registros de actividad</p>
          </Link>

          <Link href="/dashboard/profile" className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mi Perfil</h3>
            <p className="text-gray-700">Ver y editar tu perfil</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
