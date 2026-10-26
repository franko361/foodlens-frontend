"use client"

import { useState } from "react"
import { X, Store, Sparkles, Layers, Box, History, StickyNote, Crown, Clock3, Check } from "lucide-react"
import { actualizarTenant } from "@/lib/api"

export function TenantDetalleModal({ detalle, onClose, onActualizado }) {
  const [notas, setNotas] = useState(detalle?.tenant?.notas_admin || "")
  const [plan, setPlan] = useState(detalle?.tenant?.plan || "gratis")
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  if (!detalle) return null
  const { tenant, total_platos, total_categorias, total_consultas_ia, ultima_actividad, archivos_subidos, historial } = detalle

  async function handleGuardar() {
    setGuardando(true)
    try {
      await actualizarTenant(tenant.id, { notas_admin: notas, plan })
      setGuardado(true)
      onActualizado?.()
      setTimeout(() => setGuardado(false), 2000)
    } catch (err) {
      alert("Error al guardar: " + err.message)
    } finally {
      setGuardando(false)
    }
  }


  async function handleCambiarEstado(nuevoEstado) {
    try {
      await actualizarTenant(tenant.id, { estado: nuevoEstado })
      onActualizado?.()
      onClose()
    } catch (err) {
      alert("Error al cambiar estado: " + err.message)
    }
  }



  function formatearFecha(fecha) {
    if (!fecha) return "Sin actividad registrada"
    return new Date(fecha).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{tenant.nombre}</h2>
            <p className="text-xs text-muted-foreground">{tenant.slug}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Métricas del tenant */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <Layers className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">{total_platos}</p>
            <p className="text-[11px] text-muted-foreground">Platos</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <Box className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">{total_categorias}</p>
            <p className="text-[11px] text-muted-foreground">Categorías</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <Sparkles className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">{total_consultas_ia}</p>
            <p className="text-[11px] text-muted-foreground">Consultas IA</p>
          </div>
        </div>

        {/* Datos generales */}
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Store className="h-4 w-4" />
            <span>{tenant.direccion || "Sin dirección registrada"}</span>
          </div>
          <p className="text-muted-foreground">Horario: {tenant.horario || "No especificado"}</p>
          <p className="text-muted-foreground">Teléfono: {tenant.telefono || "No especificado"}</p>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            Registrado: {formatearFecha(tenant.created_at)}
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Última actividad: {formatearFecha(ultima_actividad)}
          </p>
          <p className="text-muted-foreground">Archivos subidos (fotos + modelos 3D): {archivos_subidos}</p>
        </div>

        {tenant.historia_restaurante && (
          <div className="mb-4 rounded-lg bg-muted p-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Historia</p>
            <p className="text-sm text-foreground">{tenant.historia_restaurante}</p>
          </div>
        )}

        {/* Plan */}
        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Crown className="h-3.5 w-3.5" />
            Plan
          </label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="gratis">Gratis</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        {/* Notas internas */}
        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <StickyNote className="h-3.5 w-3.5" />
            Notas internas (solo visibles para ti)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Ej. Cliente moroso, pidió soporte el 3/09..."
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>


        <div className="mb-4 flex justify-end gap-3"> 
          {tenant.estado === "activo" ? (
            <button
              onClick={() => handleCambiarEstado("suspendido")}
              className="rounded-md border border-destructive px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              Suspender restaurante
            </button>
          ) : (
            <button
              onClick={() => handleCambiarEstado("activo")}
              className="rounded-md border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              Activar restaurante
            </button>
          )}
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {guardado ? (
              <>
                <Check className="h-4 w-4" /> Guardado
              </>
            ) : guardando ? (
              "Guardando..."
            ) : (
              "Guardar notas y plan"
            )}
          </button>
        </div>

        {/* Historial */}
        {historial?.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <History className="h-3.5 w-3.5" />
              Historial de estado
            </p>
            <div className="space-y-1.5">
              {historial.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {h.estado_anterior || "—"} → <span className="font-medium text-foreground">{h.estado_nuevo}</span>
                  </span>
                  <span className="text-muted-foreground">{formatearFecha(h.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}