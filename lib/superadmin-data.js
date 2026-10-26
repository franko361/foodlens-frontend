import { Store, MessageSquare, HardDrive } from "lucide-react"

export const globalMetrics = [
  { label: "Restaurantes activos", value: "18", icon: Store },
  { label: "Consultas IA totales", value: "4,820", icon: MessageSquare },
  { label: "Almacenamiento usado", value: "2.1 GB", icon: HardDrive },
]

export const initialPendingTenants = [
  { id: "p1", name: "Sazón Andina", requestedAgo: "hace 2 días" },
]

export const registeredTenants = [
  { id: "t1", name: "Pardo's Chicken", plan: "Plan gratuito", since: "ene 2026", color: "bg-orange-700", status: "Activo" },
  { id: "t2", name: "La Choza Huancaína", plan: "Plan gratuito", since: "feb 2026", color: "bg-blue-700", status: "Activo" },
]