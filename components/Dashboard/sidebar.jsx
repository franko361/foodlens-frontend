"use client"

import { LayoutDashboard, UtensilsCrossed, Palette, User, LogOut, Menu } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { cerrarSesion } from "@/lib/api"
import { useState } from "react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Personalización", icon: Palette, href: "/personalization" },
  { label: "Perfil", icon: User, href: "/perfil" },
]

export function Sidebar({ usuario }) {
  const router = useRouter()
  const pathname = usePathname()
  const [abierto, setAbierto] = useState(false)

  function handleLogout() {
    cerrarSesion()
    router.push("/login")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú"
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {abierto && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setAbierto(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 md:static md:translate-x-0",
          abierto ? "translate-x-0" : "-translate-x-full",
        )}>
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primario text-white">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">FoodLens</span>
            <span className="text-xs text-muted-foreground">Panel del restaurante</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            General
          </p>
          {navItems.map((item) => {
            const activo = pathname === item.href
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => {router.push(item.href) 
                setAbierto(false)}}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activo
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {usuario?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{usuario?.email}</span>
              <span className="truncate text-xs text-muted-foreground">{usuario?.rol}</span>
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
    </>
  )
}