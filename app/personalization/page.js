'use client'

import { Sidebar } from "@/components/Dashboard/sidebar"
import { BrandSettings } from "@/components/Personalization/brand-settings"
import { useAuth } from "@/lib/useAuth"

export default function PersonalizationPage() {
  const { usuario, verificando } = useAuth('restaurant_admin')

  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar usuario={usuario} />
      <main className="flex-1">
        <BrandSettings tenantId={usuario.tenant_id} />
      </main>
    </div>
  )
}