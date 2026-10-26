import Image from 'next/image'
import { AccessibilityBar } from './AccessibilityBar'

export function MenuHeader({
  nombre,
  logoUrl,
  mesa = 1,
  direccion,
  horario,
  textoMenuDigital = 'Menú digital',
  textoMesa = 'Mesa',
}) {
  return (
    <header className="-mx-5 rounded-3xl bg-primario px-6 pb-8 pt-5 text-center">
      <AccessibilityBar variante="sobreColor" />

      <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-white/90 bg-white shadow-md">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`Logo de ${nombre}`}
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primario">
            {nombre?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold text-white">{nombre}</h1>

      <div className="mt-1 flex items-center justify-center gap-3 text-xs text-white/80">
        <span className="inline-flex items-center gap-1">★ 4.8</span>
        <span className="inline-flex items-center gap-1">
          📍 {direccion || 'Ubicación no especificada'}
        </span>
      </div>

      <p className="mt-1 text-xs uppercase tracking-wide text-white/70">
        {textoMesa} {String(mesa).padStart(2, '0')} · {textoMenuDigital}
        {horario ? ` · ${horario}` : ''}
      </p>
    </header>
  )
}