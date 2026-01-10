'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface ContentItem {
  id: number
  type: string
  title: string
  description: string
  image_url: string
  position: number
}

export default function Home() {
  const [content, setContent] = useState<{ [key: string]: ContentItem[] }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content`)
      
      // Organizar contenido por tipo
      const organized: { [key: string]: ContentItem[] } = {}
      response.data.forEach((item: ContentItem) => {
        if (!organized[item.type]) {
          organized[item.type] = []
        }
        organized[item.type].push(item)
      })
      
      setContent(organized)
    } catch (error) {
      console.error('Error al cargar contenido:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const hero = content.hero?.[0]
  const featured = content.featured?.[0]
  const banners = content.banner || []
  const carousel = content.carousel || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando landing page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Farmacia Científica</h1>
          <div className="flex space-x-4">
            <a href="#sobre" className="text-gray-600 hover:text-blue-600">Sobre</a>
            <a href="#productos" className="text-gray-600 hover:text-blue-600">Productos</a>
            <a href="#contacto" className="text-gray-600 hover:text-blue-600">Contacto</a>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Acceso
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {hero && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-5xl font-bold mb-4">{hero.title}</h2>
                <p className="text-xl mb-6">{hero.description}</p>
                <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded hover:bg-gray-100">
                  Conocer más
                </button>
              </div>
              {hero.image_url && (
                <img 
                  src={hero.image_url} 
                  alt={hero.title}
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Banner Section */}
      {banners.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  {banner.image_url && (
                    <img 
                      src={banner.image_url} 
                      alt={banner.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{banner.title}</h3>
                    <p className="text-gray-600">{banner.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Section */}
      {featured && (
        <section id="productos" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Productos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {featured.image_url && (
                <img 
                  src={featured.image_url} 
                  alt={featured.title}
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
              )}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{featured.title}</h3>
                <p className="text-lg text-gray-600 mb-6">{featured.description}</p>
                <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Carousel Section */}
      {carousel.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Galería</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {carousel.map((item) => (
                <div key={item.id} className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-50 transition flex items-end">
                    <div className="text-white p-4 w-full">
                      <h4 className="font-bold">{item.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contacto" className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Necesitas ayuda?</h2>
          <p className="text-xl mb-8">Contáctanos para más información</p>
          <form className="max-w-md mx-auto space-y-4">
            <input
              type="email"
              placeholder="Tu email"
              className="w-full px-4 py-2 rounded text-gray-900"
            />
            <textarea
              placeholder="Tu mensaje"
              rows={4}
              className="w-full px-4 py-2 rounded text-gray-900"
            ></textarea>
            <button
              type="submit"
              className="w-full px-8 py-3 bg-white text-blue-600 font-bold rounded hover:bg-gray-100"
            >
              Enviar
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Farmacia Científica</h3>
              <p className="text-gray-400">Tu farmacia de confianza en línea</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white">Productos</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Información</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@fciacientifica.com.ar</li>
                <li>Teléfono: +54 9 1234 5678</li>
                <li>Dirección: Buenos Aires, Argentina</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Farmacia Científica. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
