'use client'

import { useEffect, useState } from 'react'
import { MenuHeader } from '@/components/Menu/MenuHeader'
import { DishCard } from '@/components/Menu/DishCard'
import { CategoryTabs } from '@/components/Menu/CategoryTabs'
import { FloatingChat } from '@/components/Menu/FloatingChat'
import { getPlatosPorRestaurante, getTenants, traducirTextos } from '@/lib/api'
import { useAccessibility } from '@/lib/AccessibilityContext'
import { TEXTOS_UI_BASE } from '@/lib/uiTexts'
import { familiaDeFuente } from '@/lib/fuentes'

const TENANT_SLUG = 'pardos-chicken'
const CLAVES_UI = Object.keys(TEXTOS_UI_BASE)

export default function MenuPage() {
  const { idioma } = useAccessibility()

  const [dishesOriginal, setDishesOriginal] = useState([])
  const [tenantOriginal, setTenantOriginal] = useState({ nombre: '', direccion: '', horario: '' })

  const [dishes, setDishes] = useState([])
  const [tenantInfo, setTenantInfo] = useState({ nombre: '', logoUrl: null, direccion: '', horario: '' })
  const [textosUI, setTextosUI] = useState(TEXTOS_UI_BASE)

  const [tenantColor, setTenantColor] = useState(null)
  const [formaBoton, setFormaBoton] = useState('redondeado')
  const [fuente, setFuente] = useState('moderna')
  const [disposicion, setDisposicion] = useState('lista')
  const [tamanoFoto, setTamanoFoto] = useState('pequena')
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carga inicial (siempre en español, el idioma real de la base de datos)
  useEffect(() => {
    Promise.all([getPlatosPorRestaurante(TENANT_SLUG), getTenants()])
      .then(([platosData, tenantsData]) => {
        const adaptados = platosData.map((p) => ({
          id: p.id,
          name: p.nombre,
          description: p.descripcion,
          price: p.precio,
          calories: p.calorias_estimadas,
          image: p.imagen_url,
          modelo3d: p.modelo_3d_url,
          category: p.categoria_nombre || 'Otros',
        }))
        setDishesOriginal(adaptados)
        setDishes(adaptados)

        const primeraCategoria = adaptados[0]?.category
        if (primeraCategoria) setCategoriaActiva(primeraCategoria)

        const tenant = tenantsData.find((t) => t.slug === TENANT_SLUG)
        if (tenant) {
          const info = {
            nombre: tenant.nombre,
            logoUrl: tenant.logo_url,
            direccion: tenant.direccion || '',
            horario: tenant.horario || '',
          }
          setTenantOriginal(info)
          setTenantInfo(info)
          if (tenant.color_primario) setTenantColor(tenant.color_primario)
          if (tenant.forma_boton) setFormaBoton(tenant.forma_boton)
          if (tenant.fuente) setFuente(tenant.fuente)
          if (tenant.disposicion_tarjetas) setDisposicion(tenant.disposicion_tarjetas)
          if (tenant.tamano_foto) setTamanoFoto(tenant.tamano_foto)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Al cambiar el idioma, traducimos TODO en un solo grupo de llamadas:
  // textos fijos de la interfaz + datos del restaurante + platos.
  useEffect(() => {
    if (dishesOriginal.length === 0) return

    if (idioma === 'es') {
      setDishes(dishesOriginal)
      setTenantInfo(tenantOriginal)
      setTextosUI(TEXTOS_UI_BASE)
      return
    }

    async function traducirTodo() {
      const nombresPlatos = dishesOriginal.map((d) => d.name)
      const descripciones = dishesOriginal.map((d) => d.description || '')
      const categoriasUnicas = Array.from(new Set(dishesOriginal.map((d) => d.category)))
      const textosUIValores = CLAVES_UI.map((k) => TEXTOS_UI_BASE[k])
      const datosTenant = [tenantOriginal.nombre, tenantOriginal.direccion, tenantOriginal.horario]

      try {
        const [nombresTrad, descTrad, categoriasTrad, uiTrad, tenantTrad] = await Promise.all([
          traducirTextos(nombresPlatos, idioma),
          traducirTextos(descripciones, idioma),
          traducirTextos(categoriasUnicas, idioma),
          traducirTextos(textosUIValores, idioma),
          traducirTextos(datosTenant, idioma),
        ])

        const mapaCategorias = Object.fromEntries(
          categoriasUnicas.map((c, i) => [c, categoriasTrad[i]])
        )

        setDishes(
          dishesOriginal.map((d, i) => ({
            ...d,
            name: nombresTrad[i] || d.name,
            description: descTrad[i] || d.description,
            category: mapaCategorias[d.category] || d.category,
          }))
        )
        setCategoriaActiva((actual) => mapaCategorias[actual] || actual)

        const uiTraducido = {}
        CLAVES_UI.forEach((clave, i) => {
          uiTraducido[clave] = uiTrad[i] || TEXTOS_UI_BASE[clave]
        })
        setTextosUI(uiTraducido)

        setTenantInfo((prev) => ({
          ...prev,
          nombre: tenantTrad[0] || tenantOriginal.nombre,
          direccion: tenantTrad[1] || tenantOriginal.direccion,
          horario: tenantTrad[2] || tenantOriginal.horario,
        }))
      } catch (err) {
        console.error('Error al traducir el menú:', err)
        setDishes(dishesOriginal)
        setTenantInfo(tenantOriginal)
        setTextosUI(TEXTOS_UI_BASE)
      }
    }

    traducirTodo()
  }, [idioma, dishesOriginal, tenantOriginal])

  const categories = Array.from(new Set(dishes.map((d) => d.category)))
  const platosDeCategoria = dishes.filter((d) => d.category === categoriaActiva)

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center px-5">
        <p className="text-muted-foreground">Cargando menú...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center px-5">
        <p className="text-destructive">Error: {error}</p>
      </main>
    )
  }

  const estiloDinamico = {
    fontFamily: familiaDeFuente(fuente),
    ...(tenantColor
      ? { '--primario': tenantColor, '--primario-suave': `${tenantColor}1a` }
      : {}),
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-28 pt-4 sm:max-w-2xl" style={estiloDinamico}>
      <MenuHeader
        nombre={tenantInfo.nombre}
        logoUrl={tenantInfo.logoUrl}
        mesa={5}
        direccion={tenantInfo.direccion}
        horario={tenantInfo.horario}
        textoMenuDigital={textosUI.menuDigital}
        textoMesa={textosUI.mesa}
      />

      <div className="mt-6">
        <CategoryTabs
          categorias={categories}
          categoriaActiva={categoriaActiva}
          onSeleccionar={setCategoriaActiva}
          formaBoton={formaBoton}
        />
      </div>

      <div className={`mt-5 grid gap-3 ${disposicion === 'cuadricula' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {platosDeCategoria.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            {textosUI.sinPlatos}
          </p>
        ) : (
          platosDeCategoria.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              formaBoton={formaBoton}
              textoVerEn3D={textosUI.verEn3D}
              textoKcal={textosUI.kcal}
              disposicion={disposicion}
              tamanoFoto={tamanoFoto}
            />
          ))
        )}
      </div>

      <FloatingChat tenantSlug={TENANT_SLUG} nombreRestaurante={tenantInfo.nombre} />
    </main>
  )
}