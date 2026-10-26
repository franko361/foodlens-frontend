import { UtensilsCrossed, Sparkles, View, TrendingUp } from "lucide-react"

export function MetricCards({ platos }) {
  const activos = platos.filter((p) => p.estado === "activo").length

  const cards = [
    {
      label: "Platos activos",
      value: activos.toString(),
      hint: "publicados en el menú",
      icon: UtensilsCrossed,
    },
    {
      label: "Total de platos",
      value: platos.length.toString(),
      hint: "incluye pendientes e inactivos",
      icon: Sparkles,
    },
    {
      label: "Con modelo 3D",
      value: platos.filter((p) => p.modelo_3d_url).length.toString(),
      hint: "listos para AR",
      icon: View,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
        </div>
      ))}
    </div>
  )
}