"use client"

import { UtensilsCrossed, MapPin, Star } from "lucide-react"
import { familiaDeFuente } from "@/lib/fuentes"

const PLATOS_EJEMPLO = [
  { name: "Ensalada de la casa", price: "S/ 18.50", desc: "Verduras de temporada, vinagreta de cítricos" },
  { name: "Risotto de setas", price: "S/ 34.00", desc: "Arroz cremoso, parmesano y trufa" },
]

export function MenuPreview({ logo, color, shape, restaurantName, fuente, disposicion = "lista", tamanoFoto = "pequena" }) {
  const buttonRadius = shape === "rounded" ? "rounded-full" : "rounded-none"
  const esCuadricula = disposicion === "cuadricula"
  const claseFoto = esCuadricula
    ? tamanoFoto === "grande" ? "h-24 w-full" : "h-14 w-full"
    : tamanoFoto === "grande" ? "h-20 w-20" : "h-12 w-12"

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm" style={{ fontFamily: familiaDeFuente(fuente) }}>
      {/* Header con el color de marca */}
      <div className="relative px-6 pb-6 pt-10" style={{ backgroundColor: color }}>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-white shadow-md">
            {logo ? (
              <img src={logo || "/placeholder.svg"} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <UtensilsCrossed className="h-7 w-7" style={{ color }} aria-hidden="true" />
            )}
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {restaurantName || "Tu Restaurante"}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-white/80">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              4.8
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Centro histórico
            </span>
          </div>
        </div>
      </div>

      {/* Muestra de categorías del menú */}
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {["Entrantes", "Principales", "Postres", "Bebidas"].map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1.5 text-xs font-medium ${buttonRadius}`}
              style={
                i === 0
                  ? { backgroundColor: color, color: "#fff" }
                  : { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }
              }
            >
              {cat}
            </span>
          ))}
        </div>

        <div className={esCuadricula ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {PLATOS_EJEMPLO.map((dish) => (
            <div
              key={dish.name}
              className={`rounded-2xl border border-border p-2.5 ${esCuadricula ? "flex flex-col gap-2" : "flex gap-3"}`}
            >
              <div className={`shrink-0 rounded-xl bg-muted ${claseFoto}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="text-sm font-semibold text-foreground">{dish.name}</p>
                  <span className="shrink-0 text-sm font-bold" style={{ color }}>
                    {dish.price}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{dish.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`w-full py-2.5 text-sm font-semibold text-white ${buttonRadius}`}
          style={{ backgroundColor: color }}
        >
          Añadir al pedido
        </button>
      </div>
    </div>
  )
}