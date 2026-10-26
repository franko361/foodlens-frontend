'use client'

import { Sidebar } from '@/components/Dashboard/sidebar'
import { PerfilRestaurante } from '@/components/Dashboard/PerfilRestaurante'
import { useAuth } from '@/lib/useAuth'

export default function PerfilPage() {
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
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <PerfilRestaurante tenantId={usuario.tenant_id} />
      </main>
    </div>
  )
}