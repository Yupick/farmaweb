'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

interface PageContent {
  id: number
  title: string
  description: string
  image_url: string
  data?: any
}

export default function DynamicPage() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const [page, setPage] = useState<PageContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      fetchPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchPage = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content/page/slug/${slug}`)
      const item: PageContent = res.data
      // parse data JSON if present
      if (item && (item as any).data && typeof (item as any).data === 'string') {
        try { (item as any).data = JSON.parse((item as any).data) } catch {}
      }
      setPage(item)
    } catch (err: any) {
      setError('Página no encontrada')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-6">Cargando...</div>
  if (error) return (
    <div className="p-6">
      <p className="text-red-600 mb-4">{error}</p>
      <Link href="/landing" className="text-blue-600 underline">Volver</Link>
    </div>
  )
  if (!page) return null

  const body = (page as any).data?.body || ''

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{page.title}</h1>
        {page.description && (
          <p className="text-gray-600 mb-6">{page.description}</p>
        )}
        {page.image_url && (
          <img src={page.image_url} alt={page.title} className="rounded mb-6" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: body }} />
        <div className="mt-10">
          <Link href="/landing" className="text-blue-600 underline">← Volver a inicio</Link>
        </div>
      </div>
    </div>
  )
}
