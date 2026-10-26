'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, LogOut, LayoutDashboard, Menu } from 'lucide-react'
import { SuperAdminDashboard } from "@/components/SuperAdmin/dashboard"
import { TenantDetalleModal } from "@/components/SuperAdmin/TenantDetalleModal"
import { useAuth } from "@/lib/useAuth"
import { cerrarSesion, getTodosLosTenants, actualizarTenant, buscarTenants, getDetalleTenant, getMetricasGlobales, crearTenant, crearUsuario } from "@/lib/api"
import { NuevoTenantModal } from '@/components/SuperAdmin/NuevoTenantModal'

export default function SuperAdminPage() {
  const router = useRouter()
  const {usuario, verificando } = useAuth('super_admin')
  const [tenants, setTenants] = useState([])
  const [metricas, setMetricas] = useState({})
  const [detalle, setDetalle] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalNuevo, setModalNuevo] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (verificando) return
    cargarTodo()
  }, [verificando])

  function cargarTodo() {
    setCargando(true)
    Promise.all([getTodosLosTenants(), getMetricasGlobales()])
      .then(([tenantsData, metricasData]) => {
        setTenants(tenantsData)
        setMetricas(metricasData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }

  function handleLogout() {
    cerrarSesion()
    router.push('/login')
  }

  async function handleBuscar(query, estado, orden) {
    try {
      const resultados = await buscarTenants(query, estado, orden)
      setTenants(resultados)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAprobar(tenantId) {
    await actualizarTenant(tenantId, { estado: 'activo' })
    cargarTodo()
  }

  async function handleRechazar(tenantId) {
    await actualizarTenant(tenantId, { estado: 'suspendido' })
    cargarTodo()
  }

  async function handleVerDetalle(tenantId) {
    try {
      const data = await getDetalleTenant(tenantId)
      setDetalle(data)
    } catch (err) {
      alert('No se pudo cargar el detalle: ' + err.message)
    }
  }

  async function handleCrearNegocio({ nombre, slug, direccion, horario, email, password }) {
  const tenant = await crearTenant({ nombre, slug, direccion, horario })
  await crearUsuario({ email, password, rol: 'restaurant_admin', tenant_id: tenant.id })
  cargarTodo()
}

  if (verificando || cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando panel...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <button
        type="button"
        onClick={() => setMenuAbierto(true)}
        aria-label="Abrir menú"
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {menuAbierto && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMenuAbierto(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 md:static md:translate-x-0 ${
          menuAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">FoodLens</span>
            <span className="text-xs text-muted-foreground">Super Admin</span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Plataforma
          </p>
          <button
            type="button"
            onClick={() => setMenuAbierto(false)}
            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-foreground transition-colors"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            Tenants
          </button>
        </nav>

        {/* Sección de usuario y cerrar sesión */}
        <div className="border-t border-border p-4">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {usuario?.email?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{usuario?.email}</span>
              <span className="truncate text-xs text-muted-foreground">{usuario?.rol || "super_admin"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <SuperAdminDashboard
          tenants={tenants}
          metricas={metricas}
          onAprobar={handleAprobar}
          onRechazar={handleRechazar}
          onBuscar={handleBuscar}
          onVerDetalle={handleVerDetalle}
          onNuevo={() => setModalNuevo(true)}
        />
        <TenantDetalleModal
          detalle={detalle}
          onClose={() => setDetalle(null)}
          onActualizado={cargarTodo}
        />
        <NuevoTenantModal open={modalNuevo} onClose={() => setModalNuevo(false)} onCrear={handleCrearNegocio} />
      </main>
    </div>
  )
}