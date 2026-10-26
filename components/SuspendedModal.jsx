'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { cerrarSesion } from '@/lib/api'

export function SuspendedModal() {
  const router = useRouter()
  const pathname = usePathname()
  const [mostrar, setMostrar] = useState(false)


  useEffect(() => {
    if (pathname === '/login') {
      setMostrar(false)
    }
  }, [pathname])

  useEffect(() => {
    function handleSuspendido() {
      setMostrar(true)
    }
    window.addEventListener('cuenta-suspendida', handleSuspendido)
    return () => window.removeEventListener('cuenta-suspendida', handleSuspendido)
  }, [])

  function handleAceptar() {
    setMostrar(false)
    cerrarSesion()
    router.push('/login')
  }

  if (!mostrar) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl bg-card p-6 text-center shadow-xl">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-destructive" />
        <h2 className="mb-1 text-lg font-semibold text-foreground">Cuenta suspendida</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Tu cuenta ha sido suspendida. Contacta al soporte de la plataforma para más información.
        </p>
        <button
          onClick={handleAceptar}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}