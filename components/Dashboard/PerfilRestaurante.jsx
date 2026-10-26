'use client'

import { useEffect, useState } from 'react'
import { Store, MapPin, Clock, Phone, Mail, BookOpen, Check, AlertCircle } from 'lucide-react'
import { getMiTenant, actualizarTenant, getUsuarioActual } from '@/lib/api'

function Campo({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}

export function PerfilRestaurante({ tenantId }) {
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [horario, setHorario] = useState('')
  const [telefono, setTelefono] = useState('')
  const [historia, setHistoria] = useState('')
  const [emailCuenta, setEmailCuenta] = useState('')

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!tenantId) return
    getMiTenant(tenantId)
      .then((tenant) => {
        setNombre(tenant.nombre || '')
        setDireccion(tenant.direccion || '')
        setHorario(tenant.horario || '')
        setTelefono(tenant.telefono || '')
        setHistoria(tenant.historia_restaurante || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))

    const usuario = getUsuarioActual()
    setEmailCuenta(usuario?.email || '')
  }, [tenantId])

  async function handleGuardar(e) {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await actualizarTenant(tenantId, {
        nombre,
        direccion,
        horario,
        telefono,
        historia_restaurante: historia,
      })
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return <p className="text-sm text-muted-foreground">Cargando perfil...</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Perfil del restaurante</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Información de contacto y operación de tu negocio.
        </p>
      </header>

      <form onSubmit={handleGuardar} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <Campo
          icon={Store}
          label="Nombre del restaurante"
          value={nombre}
          onChange={setNombre}
          placeholder="Ej. Pardo's Chicken"
        />
        <Campo
          icon={MapPin}
          label="Dirección"
          value={direccion}
          onChange={setDireccion}
          placeholder="Ej. Av. Giráldez 456, Huancayo"
        />
        <Campo
          icon={Clock}
          label="Horario de atención"
          value={horario}
          onChange={setHorario}
          placeholder="Ej. Lun-Dom 12:00-22:00"
        />
        <Campo
          icon={Phone}
          label="Teléfono"
          value={telefono}
          onChange={setTelefono}
          placeholder="Ej. 964 123 456"
          type="tel"
        />

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Historia y reconocimientos
          </label>
          <textarea
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={6}
            placeholder="Cuéntanos sobre tu restaurante: cuándo abrió, su historia, premios o reconocimientos, filosofía del negocio, especialidades, etc. El asistente de IA usará esta información para responder preguntas de tus clientes sobre el restaurante."
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Esta información la usa el asistente de IA del menú para responder preguntas de tus clientes sobre el negocio.
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            Correo de la cuenta
          </label>
          <input
            type="email"
            value={emailCuenta}
            disabled
            className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Este es el correo con el que inicias sesión. Para cambiarlo, contacta al soporte.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          {error && (
            <span className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </span>
          )}
          {guardado && (
            <span className="flex items-center gap-1.5 text-sm text-primary">
              <Check className="h-4 w-4" />
              Cambios guardados
            </span>
          )}
          <button
            type="submit"
            disabled={guardando}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}