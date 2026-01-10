'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Farmacia Científica Malvinas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/login')
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bienvenido, {user.firstName || user.email}
            </h2>
            <p className="text-gray-600 mb-6">
              Rol: <span className="font-semibold">{user.role}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.role === 'admin' && (
                <>
                  <Link
                    href="/dashboard/users"
                    className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Gestionar Usuarios</h3>
                    <p className="text-blue-700">Crear, editar y eliminar usuarios del sistema</p>
                  </Link>

                  <Link
                    href="/dashboard/config"
                    className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Configuraciones</h3>
                    <p className="text-green-700">Administrar configuraciones del sistema</p>
                  </Link>

                  <Link
                    href="/dashboard/audit"
                    className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Auditoría</h3>
                    <p className="text-purple-700">Ver registros de actividad del sistema</p>
                  </Link>
                </>
              )}

              <Link
                href="/dashboard/profile"
                className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mi Perfil</h3>
                <p className="text-gray-700">Ver y editar tu perfil</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
