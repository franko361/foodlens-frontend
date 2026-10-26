'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Dashboard/sidebar'
import { Header } from '@/components/Dashboard/header'
import { MetricCards } from '@/components/Dashboard/metric-cards'
import { DishesTable } from '@/components/Dashboard/dishes-table'
import { PlatoForm } from '@/components/Dashboard/PlatoForm'
import { CategoryFilter } from '@/components/Dashboard/CategoryFilter'
import { useAuth } from '@/lib/useAuth'
import {
  getMisPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlato,
  cerrarSesion,
  getMisCategorias,
  crearCategoria,
  eliminarCategoria,
} from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const { usuario, verificando } = useAuth('restaurant_admin')
  const [platos, setPlatos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null) // null = "Todas"
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [platoEditando, setPlatoEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (verificando) return
    cargarDatos()
  }, [verificando])

  function cargarDatos() {
    setCargando(true)
    setError('')
    Promise.all([getMisPlatos(), getMisCategorias()])
      .then(([platosData, categoriasData]) => {
        setPlatos(platosData)
        setCategorias(categoriasData)
      })
      .catch((err) => {
        if (err.message?.includes('suspendida')) return
        setError(err.message)
        cerrarSesion()
        setTimeout(() => router.push('/login'), 1200)
      })
      .finally(() => {
        setCargando(false)
      })
  }

  function handleNuevoPlato() {
    setPlatoEditando(null)
    setFormAbierto(true)
  }

  function handleEditar(plato) {
    setPlatoEditando(plato)
    setFormAbierto(true)
  }

  async function handleGuardar(datos) {
    // Si hay una categoría activa (filtro), la asignamos por defecto al crear un plato nuevo
    const datosConCategoria =
      !platoEditando && categoriaActiva ? { ...datos, categoria_id: categoriaActiva } : datos

    let resultado
    if (platoEditando) {
      resultado = await actualizarPlato(platoEditando.id, datosConCategoria)
    } else {
      resultado = await crearPlato(datosConCategoria)
    }
    return resultado
  }

  async function handleEliminarPlato(plato) {
    const confirmar = window.confirm(`¿Eliminar "${plato.nombre}"? Esta acción no se puede deshacer.`)
    if (!confirmar) return
    try {
      await eliminarPlato(plato.id)
      cargarDatos()
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  async function handleCambiarEstado(plato, nuevoEstado) {
    if (plato.estado === nuevoEstado) return
    const anteriores = platos
    setPlatos((prev) => prev.map((p) => (p.id === plato.id ? { ...p, estado: nuevoEstado } : p)))
    try {
      await actualizarPlato(plato.id, { estado: nuevoEstado })
    } catch (err) {
      setPlatos(anteriores)
      alert('No se pudo cambiar el estado: ' + err.message)
    }
  }

  async function handleCrearCategoria(nombre) {
    try {
      const orden = categorias.length
      await crearCategoria({ nombre, orden })
      cargarDatos()
    } catch (err) {
      alert('Error al crear categoría: ' + err.message)
    }
  }

  async function handleEliminarCategoria(categoria) {
    const platosEnCategoria = platos.filter((p) => p.categoria_id === categoria.id)
    if (platosEnCategoria.length > 0) {
      alert(
        `No puedes eliminar "${categoria.nombre}" porque tiene ${platosEnCategoria.length} plato(s) asignado(s). Reasígnalos primero.`
      )
      return
    }
    const confirmar = window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)
    if (!confirmar) return
    try {
      await eliminarCategoria(categoria.id)
      if (categoriaActiva === categoria.id) setCategoriaActiva(null)
      cargarDatos()
    } catch (err) {
      alert('Error al eliminar categoría: ' + err.message)
    }
  }

  const normalizar = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const platosFiltrados = platos.filter((p) => {
    const coincideCategoria = !categoriaActiva || p.categoria_id === categoriaActiva
    const coincideBusqueda = normalizar(p.nombre).includes(normalizar(busqueda))
    return coincideCategoria && coincideBusqueda
  })

  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar usuario={usuario} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onNuevoPlato={handleNuevoPlato} busqueda={busqueda} onBusquedaChange={setBusqueda}/>
        <main className="flex-1 space-y-6 p-4 md:p-8">
          {cargando && <p className="text-sm text-muted-foreground">Cargando...</p>}
          {error && <p className="text-sm text-destructive">Error: {error}</p>}
          {!cargando && !error && (
            <>
              <MetricCards platos={platos} />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold text-foreground">Platos del menú</h2>
                <CategoryFilter
                  categorias={categorias}
                  categoriaActiva={categoriaActiva}
                  onSeleccionar={setCategoriaActiva}
                  onCrear={handleCrearCategoria}
                  onEliminar={handleEliminarCategoria}
                />
              </div>

              <DishesTable
                platos={platosFiltrados}
                onEditar={handleEditar}
                onEliminar={handleEliminarPlato}
                onCambiarEstado={handleCambiarEstado}
              />
            </>
          )}
        </main>
      </div>

      <PlatoForm
        open={formAbierto}
        onClose={() => setFormAbierto(false)}
        onGuardar={handleGuardar}
        onGuardado={cargarDatos}
        platoInicial={platoEditando}
        categorias={categorias}
      />
    </div>
  )
}
