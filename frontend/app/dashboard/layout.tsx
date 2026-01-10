'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <Link href="/" className="text-xl font-bold text-blue-600">
                Farmacia
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/login')
                }}
                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Navegación</h3>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
              >
                Inicio
              </Link>

              {user.role === 'admin' && (
                <>
                  <Link
                    href="/dashboard/users"
                    className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                  >
                    Usuarios
                  </Link>
                  <Link
                    href="/dashboard/config"
                    className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                  >
                    Configuración
                  </Link>
                  <Link
                    href="/dashboard/audit"
                    className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                  >
                    Auditoría
                  </Link>
                </>
              )}

              <Link
                href="/dashboard/profile"
                className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
              >
                Mi Perfil
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
