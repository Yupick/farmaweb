'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

interface Content {
  id: number
  type: string
  title: string
  description: string
  image_url: string
  position: number
  is_active: number
  data?: { slug?: string; body?: string }
  display_modal?: number
  display_footer?: number
  display_menu?: number
}

export default function ContentManagement() {
  const { token } = useAuth()
  const [content, setContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    type: 'hero',
    title: '',
    description: '',
    image_url: '',
    position: 0,
    is_active: 1,
    data: { slug: '', body: '' },
    display_modal: 0,
    display_footer: 0,
    display_menu: 0
  })

  const contentTypes = [
    { id: 'hero', label: 'Hero (encabezado principal)' },
    { id: 'banner', label: 'Banner (tarjetas destacadas)' },
    { id: 'featured', label: 'Destacado (sección productos)' },
    { id: 'carousel', label: 'Galería (imágenes)' },
    { id: 'page', label: 'Página (contenido interno con slug)' }
  ]
  const isPage = formData.type === 'page'

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content`)
      setContent(response.data)
    } catch (err: any) {
      setError('Error al cargar contenido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const payload = { ...formData, data: isPage ? formData.data : undefined }
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/content/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      } else {
        const payload = { ...formData, data: isPage ? formData.data : undefined }
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/content`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      }
      resetForm()
      await fetchContent()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar contenido')
    }
  }

  const handleEdit = (item: Content) => {
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      position: item.position,
      is_active: item.is_active,
      data: item.data || { slug: '', body: '' },
      display_modal: item.display_modal || 0,
      display_footer: item.display_footer || 0,
      display_menu: item.display_menu || 0
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/content/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await fetchContent()
      } catch (err: any) {
        setError('Error al eliminar contenido')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'hero',
      title: '',
      description: '',
      image_url: '',
      position: 0,
      is_active: 1,
      data: { slug: '', body: '' },
      display_modal: 0,
      display_footer: 0,
      display_menu: 0
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Contenido'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded shadow">
          {/* Asistencia IA para crear/editar páginas */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900 mb-2 font-semibold">Asistente IA (Chatbot Administrativo)</p>
            <p className="text-xs text-blue-800 mb-3">Describe el contenido que quieres crear o editar (por ejemplo: "Crear página de Políticas con secciones de privacidad y devoluciones").</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
              <textarea id="ia-prompt" className="md:col-span-3 w-full px-3 py-2 border rounded" rows={3} placeholder="Indica el contenido deseado..." />
              <button
                type="button"
                onClick={async ()=>{
                  const prompt = (document.getElementById('ia-prompt') as HTMLTextAreaElement)?.value || ''
                  if(!prompt) return
                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_API_URL}/chat/admin`,
                      { message: prompt },
                      { headers: { Authorization: `Bearer ${token}` } }
                    )
                    const txt = res.data?.response || ''
                    // Rellenar descripción/cuerpo con la respuesta IA
                    if (isPage) {
                      setFormData(prev => ({ ...prev, description: txt.substring(0, 160), data: { ...prev.data, body: txt } }))
                    } else {
                      setFormData(prev => ({ ...prev, description: txt }))
                    }
                  } catch (e) {
                    setError('No se pudo obtener asistencia de IA')
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generar con IA
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, data: { slug: '', body: '' } })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                {contentTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
              <input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              ></textarea>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {isPage && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.data.slug}
                    onChange={(e) => setFormData({ ...formData, data: { ...formData.data, slug: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="ej: politicas"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo (HTML simple)</label>
                  <textarea
                    value={formData.data.body}
                    onChange={(e) => setFormData({ ...formData, data: { ...formData.data, body: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    rows={8}
                    placeholder="<h2>Título</h2><p>Contenido...</p>"
                  />
                </div>
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!formData.display_modal}
                      onChange={(e) => setFormData({ ...formData, display_modal: e.target.checked ? 1 : 0 })}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Habilitar Modal</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!formData.display_footer}
                      onChange={(e) => setFormData({ ...formData, display_footer: e.target.checked ? 1 : 0 })}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Display en Footer</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!formData.display_menu}
                      onChange={(e) => setFormData({ ...formData, display_menu: e.target.checked ? 1 : 0 })}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Display en Menú</span>
                  </label>
                </div>
              </>
            )}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Activo</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Título</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descripción</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {content.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.description?.substring(0, 50)}...</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
