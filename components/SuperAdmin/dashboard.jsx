"use client"

import { useEffect, useRef, useState } from "react"
import {
  Clock, MoreVertical, Store, CheckCircle2, Hourglass, XCircle,
  Search, Sparkles, Box, ImageIcon, TrendingUp, ArrowUpDown
} from "lucide-react"

const COLORES_AVATAR = ["bg-orange-600", "bg-emerald-600", "bg-blue-600", "bg-purple-600", "bg-pink-600"]
const ESTADOS_FILTRO = [
  { value: "", label: "Todos" },
  { value: "activo", label: "Activos" },
  { value: "pendiente", label: "Pendientes" },
  { value: "suspendido", label: "Suspendidos" },
]
const ORDENES = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
  { value: "mas_consultas", label: "Más consultas IA" },
]

function colorPorIndice(i) {
  return COLORES_AVATAR[i % COLORES_AVATAR.length]
}

export function SuperAdminDashboard({
  tenants,
  metricas,
  onNuevo,
  onAprobar,
  onRechazar,
  onBuscar,
  onVerDetalle,
}) {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [orden, setOrden] = useState("recientes")

  const pendientes = tenants.filter((t) => t.estado === "pendiente")
  const registrados = tenants.filter((t) => t.estado !== "pendiente")

  function handleBuscar(e) {
    e?.preventDefault()
    onBuscar(busqueda, filtroEstado, orden)
  }

  function handleFiltro(estado) {
    setFiltroEstado(estado)
    onBuscar(busqueda, estado, orden)
  }

  function handleOrden(nuevoOrden) {
    setOrden(nuevoOrden)
    onBuscar(busqueda, filtroEstado, nuevoOrden)
  }

  const primeraVez = useRef(true)

  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false
      return
    }
    const t = setTimeout(() => handleBuscar(), 400)
    return () => clearTimeout(t)
  }, [busqueda])

  const metricCards = [
    { label: "Restaurantes totales", value: metricas.total_tenants, icon: Store },
    { label: "Activos", value: metricas.tenants_activos, icon: CheckCircle2 },
    { label: "Pendientes", value: metricas.tenants_pendientes, icon: Hourglass },
    { label: "Suspendidos", value: metricas.tenants_suspendidos, icon: XCircle },
    { label: "Total de platos", value: metricas.total_platos, icon: ImageIcon },
    { label: "Fotos subidas", value: metricas.total_imagenes_subidas, icon: ImageIcon },
    { label: "Modelos 3D", value: metricas.total_modelos_3d, icon: Box },
    { label: "Consultas a la IA", value: metricas.total_consultas_ia, icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-foreground">FoodLens · Panel Global</h1>
          <p className="mt-1 text-sm text-muted-foreground">Super Administrador del SaaS</p>
          <button onClick={onNuevo} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            + Nuevo negocio
          </button>
        </div>

        {/* Métricas globales */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metricCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <Icon size={16} />
                <p className="text-xs font-medium">{label}</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{value ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Ranking de actividad */}
        {metricas.ranking_actividad?.length > 0 && (
          <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Restaurantes con más actividad (consultas a la IA)
            </p>
            <div className="space-y-2">
              {metricas.ranking_actividad.map((r, i) => (
                <div key={r.tenant_id} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-sm text-foreground">{r.nombre}</span>
                  <span className="text-xs font-medium text-muted-foreground">{r.consultas} consultas</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Búsqueda, filtros y orden */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleBuscar} className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar restaurante por nombre..."
              className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </form>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={orden}
              onChange={(e) => handleOrden(e.target.value)}
              className="h-10 border-none bg-transparent text-sm text-foreground outline-none"
            >
              {ORDENES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {ESTADOS_FILTRO.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFiltro(f.value)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filtroEstado === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Solicitudes pendientes */}
        {pendientes.length > 0 && (
          <div className="mb-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Solicitudes pendientes
            </p>
            {pendientes.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20"
              >
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{t.nombre}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">{t.direccion || "Sin dirección registrada"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAprobar(t.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onRechazar(t.id)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lista de restaurantes */}
        <p className="mb-2 text-sm font-semibold text-foreground">Restaurantes registrados</p>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {registrados.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No se encontraron restaurantes.</p>
          )}
          {registrados.map((t, i) => (
            <div
              key={t.id}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 ${
                i !== registrados.length - 1 ? "border-b border-border" : ""
              }`}
              onClick={() => onVerDetalle(t.id)}
            >
              <div className={`h-8 w-8 flex-shrink-0 rounded-full ${colorPorIndice(i)}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{t.nombre}</p>
                <p className="truncate text-xs text-muted-foreground">{t.slug}</p>
              </div>
              {t.plan === "premium" && (
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Premium
                </span>
              )}
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  t.estado === "activo"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                    : "border-red-500/20 bg-red-500/10 text-red-600"
                }`}
              >
                {t.estado}
              </span>
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded-md p-1 text-muted-foreground transition hover:text-foreground"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}