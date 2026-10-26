import { useEffect, useState } from "react"
import Image from "next/image"
import { Box, Pencil, Trash2, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

const ESTADOS = ["activo", "pendiente", "inactivo"]

const ESTILOS_ESTADO = {
  activo: { fondo: "bg-green-100 text-green-700", punto: "bg-green-500" },
  pendiente: { fondo: "bg-amber-100 text-amber-700", punto: "bg-amber-500" },
  inactivo: { fondo: "bg-muted text-muted-foreground", punto: "bg-muted-foreground/60" },
}

function StatusBadge({ status }) {
  const estilo = ESTILOS_ESTADO[status] || ESTILOS_ESTADO.inactivo
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize", estilo.fondo)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", estilo.punto)} />
      {status}
    </span>
  )
}


function StatusMenu({ plato, onCambiarEstado }) {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (!abierto) return
    const cerrar = () => setAbierto(false)
    document.addEventListener("click", cerrar)
    return () => document.removeEventListener("click", cerrar)
  }, [abierto])

  return (
    <div className="relative flex items-center gap-1">
      <StatusBadge status={plato.estado} />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setAbierto(!abierto)
        }}
        aria-label={`Cambiar estado de ${plato.nombre}`}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {abierto && (
        <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-lg">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => onCambiarEstado(plato, estado)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs capitalize hover:bg-muted",
                plato.estado === estado ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", ESTILOS_ESTADO[estado].punto)} />
              {estado}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ModelBadge({ hasModel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        hasModel ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Box className={cn("h-4 w-4", hasModel ? "text-primary" : "text-muted-foreground/60")} />
      {hasModel ? "Modelo 3D" : "Sin modelo"}
    </span>
  )
}

export function DishesTable({ platos, onEditar, onEliminar, onCambiarEstado }) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <p className="text-xs text-muted-foreground">{platos.length} platos en esta vista</p>
      </div>

      <div className="hidden grid-cols-[1fr_9rem_9rem_6rem] gap-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span>Plato</span>
        <span>Modelo 3D</span>
        <span>Estado</span>
        <span className="text-right">Acciones</span>
      </div>

      <ul className="divide-y divide-border">
        {platos.length === 0 && (
          <li className="px-5 py-6 text-sm text-muted-foreground">No hay platos en esta categoría.</li>
        )}
        {platos.map((dish) => (
          <li
            key={dish.id}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50 md:grid-cols-[1fr_9rem_8rem_6rem]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                <Image
                  src={dish.imagen_url || "/placeholder.svg"}
                  alt={dish.nombre}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{dish.nombre}</p>
                <p className="truncate text-xs text-muted-foreground">
                  S/ {Number(dish.precio).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="hidden md:block">
              <ModelBadge hasModel={!!dish.modelo_3d_url} />
            </div>

            <div className="hidden md:block">
              <StatusMenu plato={dish} onCambiarEstado={onCambiarEstado} />
            </div>

            <div className="flex items-center gap-1 md:justify-end">
              <div className="md:hidden">
                <StatusMenu plato={dish} onCambiarEstado={onCambiarEstado} />
              </div>
              <button
                type="button"
                onClick={() => onEditar(dish)}
                aria-label={`Editar ${dish.nombre}`}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onEliminar(dish)}
                aria-label={`Eliminar ${dish.nombre}`}
                className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}