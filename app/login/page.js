'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scan, Lock, Mail, ShieldCheck, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const API_URL = 'http://127.0.0.1:8000'

export default function LoginPage() {
  const router = useRouter()
  const emailRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // 3. Autofocus en el primer campo al cargar
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const emailEsValido = email === '' || /\S+@\S+\.\S+/.test(email)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Completa ambos campos.')
      return
    }
    if (!emailEsValido) {
      setError('Ingresa un correo válido.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError('Correo o contraseña incorrectos.')
        setLoading(false)
        return
      }

      localStorage.setItem('foodlens_token', data.access_token)
      localStorage.setItem('foodlens_usuario', JSON.stringify(data.usuario))

      // 6. Feedback visual de éxito antes de redirigir
      setSuccess(true)
      setTimeout(() => {
        router.push(data.usuario.rol === 'super_admin' ? '/superadmin' : '/dashboard')
      }, 600)
    } catch (err) {
      setError('No se pudo conectar con el servidor.')
      setLoading(false)
    }
  }

  const bloqueado = loading || success

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#1a1a1a] px-4">
      {/* Fondo geométrico "low-poly" en blanco y negro, con más brillo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.06) 41%, transparent 42%),
            linear-gradient(45deg, transparent 60%, rgba(255,255,255,0.08) 61%, transparent 62%),
            linear-gradient(200deg, transparent 30%, rgba(0,0,0,0.5) 45%, transparent 55%),
            radial-gradient(circle at 20% 15%, rgba(255,255,255,0.12), transparent 42%),
            radial-gradient(circle at 85% 75%, rgba(0,0,0,0.55), transparent 45%),
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.06), transparent 55%)
          `,
          backgroundColor: '#161616',
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rotate-12 bg-white/[0.07]"
        style={{ clipPath: 'polygon(0 0, 100% 20%, 80% 100%, 0% 80%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 -rotate-12 bg-black/50"
        style={{ clipPath: 'polygon(20% 0, 100% 30%, 80% 100%, 0% 70%)' }}
      />
      {/* Glow superior para dar más brillo ambiental */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[100px]" />

      <div className="relative w-full max-w-sm animate-[fadeIn_0.5s_ease-out]">
        {/* Borde con brillo sutil */}
        <div className="rounded-2xl bg-gradient-to-b from-white/25 via-white/10 to-white/5 p-[1px] shadow-2xl shadow-black/60">
          <div className="rounded-2xl bg-white/[0.05] px-7 py-8 backdrop-blur-xl">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)] backdrop-blur-md">
                <Scan className="h-7 w-7 text-white" strokeWidth={1.75} />
              </div>
              <h1 className="text-lg font-bold tracking-wide text-white">
                FOOD<span className="font-normal text-white/90">LENS</span>
              </h1>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
                Panel de administración
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 7. Labels reales para accesibilidad (visibles, ya no solo placeholder) */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Correo electrónico
                </label>
                <div
                  className={`flex items-center gap-3 rounded border bg-black/30 px-4 py-3.5 backdrop-blur-md transition-all duration-300 ${
                    emailTouched && !emailEsValido
                      ? 'border-red-400/50 focus-within:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
                      : 'border-white/10 focus-within:border-white/40 focus-within:bg-black/40 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]'
                  }`}
                >
                  <Mail className="h-4.5 w-4.5 shrink-0 text-white/40" />
                  <input
                    id="email"
                    ref={emailRef}
                    type="email"
                    value={email}
                    disabled={bloqueado}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="Correo"
                    className="w-full bg-transparent text-sm text-white/90 outline-none placeholder:text-white/35 disabled:opacity-50"
                  />
                </div>
                {/* 1. Validación en tiempo real */}
                {emailTouched && !emailEsValido && (
                  <p className="mt-1.5 flex items-center gap-1 px-1 text-[11px] text-red-300/80">
                    <AlertCircle className="h-3 w-3" />
                    Formato de correo inválido
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <div className="flex items-center gap-3 rounded border border-white/10 bg-black/30 px-4 py-3.5 backdrop-blur-md transition-all duration-300 focus-within:border-white/40 focus-within:bg-black/40 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]">
                  <Lock className="h-4.5 w-4.5 shrink-0 text-white/40" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={bloqueado}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-transparent text-sm text-white/90 outline-none placeholder:text-white/35 disabled:opacity-50"
                  />
                  {/* 2. Mostrar/ocultar contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="shrink-0 text-white/40 transition-colors hover:text-white/70"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-1.5 px-1 text-xs text-white/70">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-white/60" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={bloqueado}
                className={`mt-2 flex items-center justify-center gap-2 rounded border py-3.5 text-sm font-semibold uppercase tracking-widest backdrop-blur-md transition-all duration-200 active:scale-[0.97] disabled:active:scale-100 ${
                  success
                    ? 'border-emerald-300/40 bg-emerald-400/90 text-black'
                    : 'border-white/30 bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:bg-white/90 disabled:opacity-60'
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    ¡Bienvenido!
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-wider text-white/35">
                Acceso seguro
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck className="h-3.5 w-3.5 text-white/50" />
              Exclusivo para restaurantes verificados
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  )
}