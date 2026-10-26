'use client'

import { useEffect, useState } from 'react'
import { Plus, X, MoreVertical, Trash2 } from 'lucide-react'

export function CategoryFilter({ categorias, categoriaActiva, onSeleccionar, onCrear, onEliminar }) {
  const [creando, setCreando] = useState(false)
  const [nombreNueva, setNombreNueva] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(null) // id de la categoría con menú abierto

  useEffect(() => {
    if (menuAbierto === null) return
    const cerrar = () => setMenuAbierto(null)
    document.addEventListener('click', cerrar)
    return () => document.removeEventListener('click', cerrar)
  }, [menuAbierto])

  async function handleCrear(e) {
    e.preventDefault()
    if (!nombreNueva.trim()) return
    await onCrear(nombreNueva.trim())
    setNombreNueva('')
    setCreando(false)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {/* Chip "Todas" */}
      <button
        type="button"
        onClick={() => onSeleccionar(null)}
        className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
          categoriaActiva === null
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-muted-foreground hover:bg-muted'
        }`}
      >
        Todas
      </button>

      {/* Chips de categorías reales */}
      {categorias.map((cat) => (
        <div key={cat.id} className="flex shrink-0 items-center gap-1.5">
          <div className="group relative">
            <button
              type="button"
              onClick={() => onSeleccionar(cat.id)}
              className={`rounded-full border px-3.5 py-1.5 pr-7 text-xs font-medium transition-colors ${
                categoriaActiva === cat.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.nombre}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setMenuAbierto(menuAbierto === cat.id ? null : cat.id)
              }}
              className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                categoriaActiva === cat.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {menuAbierto === cat.id && (
            <button
              type="button"
              onClick={() => {
                onEliminar(cat)
                setMenuAbierto(null)
              }}
              className="flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
          )}
        </div>
      ))}

      {/* Botón / input para crear nueva categoría */}
      {creando ? (
        <form onSubmit={handleCrear} className="flex shrink-0 items-center gap-1">
          <input
            autoFocus
            type="text"
            value={nombreNueva}
            onChange={(e) => setNombreNueva(e.target.value)}
            placeholder="Nombre..."
            className="h-7 w-28 rounded-full border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button type="submit" className="rounded-full bg-primary p-1 text-primary-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCreando(false)
              setNombreNueva('')
            }}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreando(true)}
          className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva
        </button>
      )}
    </div>
  )
}