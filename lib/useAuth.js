'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsuarioActual } from '@/lib/api'

// Hook que protege una página: si no hay sesión, redirige a /login.
// rolRequerido (opcional): si se indica, además valida que el usuario tenga ese rol exacto.
export function useAuth(rolRequerido) {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('foodlens_token')
    const usuarioGuardado = getUsuarioActual()

    if (!token || !usuarioGuardado) {
      router.push('/login')
      return
    }

    if (rolRequerido && usuarioGuardado.rol !== rolRequerido) {
      router.push('/login')
      return
    }

    setUsuario(usuarioGuardado)
    setVerificando(false)
  }, [router, rolRequerido])

  return { usuario, verificando }
}