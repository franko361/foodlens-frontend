'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

function slugify(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function NuevoTenantModal({ open, onClose, onCrear }) {
  const [form, setForm] = useState({ nombre: '', direccion: '', horario: '', email: '', password: '' })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  function set(campo, valor) { setForm((p) => ({ ...p, [campo]: valor })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre || !form.email || form.password.length < 6) {
      setError('Nombre, correo y contraseña (mínimo 6 caracteres) son obligatorios.')
      return
    }
    setGuardando(true)
    setError('')
    try {
      await onCrear({ ...form, slug: slugify(form.nombre) })
      setForm({ nombre: '', direccion: '', horario: '', email: '', password: '' })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const input = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3 rounded-xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Nuevo negocio</h2>
          <button type="button" onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <input className={input} placeholder="Nombre del negocio *" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        <input className={input} placeholder="Dirección" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
        <input className={input} placeholder="Horario" value={form.horario} onChange={(e) => set('horario', e.target.value)} />
        <p className="pt-2 text-xs font-semibold text-muted-foreground">Cuenta del administrador</p>
        <input className={input} type="email" placeholder="Correo del admin *" value={form.email} onChange={(e) => set('email', e.target.value)} />
        <input className={input} type="password" placeholder="Contraseña inicial *" value={form.password} onChange={(e) => set('password', e.target.value)} />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" disabled={guardando} className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {guardando ? 'Creando...' : 'Crear negocio'}
        </button>
      </form>
    </div>
  )
}