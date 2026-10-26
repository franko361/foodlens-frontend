"use client"

import { Plus, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ onNuevoPlato, busqueda, onBusquedaChange }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-lg font-bold tracking-tight text-foreground">Menú digital</h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          Gestiona los platos, modelos 3D y su rendimiento
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar plato..."
            aria-label="Buscar plato"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="h-9 w-56 rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <Button variant="outline" size="icon" className="relative" aria-label="Notificaciones">
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <Button className="gap-1.5" onClick={onNuevoPlato}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo plato</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>
    </header>
  )
}