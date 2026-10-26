'use client'

import { useState } from 'react'
import { Moon, Sun, Minus, Plus, Languages, Check } from 'lucide-react'
import { useAccessibility } from '@/lib/AccessibilityContext'
import { IDIOMAS_DISPONIBLES } from '@/lib/api'

export function AccessibilityBar({ variante = 'normal' }) {
  const { tema, alternarTema, tamano, cambiarTamano, idioma, setIdioma } = useAccessibility()
  const [selectorAbierto, setSelectorAbierto] = useState(false)

  const idiomaActual = IDIOMAS_DISPONIBLES.find((i) => i.codigo === idioma)
  const sobreColor = variante === 'sobreColor'

  const estiloBase = sobreColor
    ? 'border-white/25 bg-white/10 text-white backdrop-blur-sm'
    : 'border-border bg-card text-muted-foreground'

  return (
    <div className="mb-3 flex items-center justify-end gap-1.5">
      {/* Tamaño de texto */}
      <div className={`flex items-center gap-0.5 rounded-full border p-0.5 ${estiloBase}`}>
        <button
          type="button"
          onClick={() => cambiarTamano('reducir')}
          aria-label="Reducir tamaño de texto"
          className={`rounded-full p-1.5 ${sobreColor ? 'hover:bg-white/15' : 'hover:bg-muted'}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="px-1 text-[10px] font-medium">A</span>
        <button
          type="button"
          onClick={() => cambiarTamano('aumentar')}
          aria-label="Aumentar tamaño de texto"
          className={`rounded-full p-1.5 ${sobreColor ? 'hover:bg-white/15' : 'hover:bg-muted'}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Modo oscuro/claro */}
      <button
        type="button"
        onClick={alternarTema}
        aria-label="Cambiar tema"
        className={`rounded-full border p-2 ${estiloBase} ${sobreColor ? 'hover:bg-white/15' : 'hover:bg-muted'}`}
      >
        {tema === 'oscuro' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>

      {/* Selector de idioma */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setSelectorAbierto((v) => !v)}
          className={`flex items-center gap-1 rounded-full border px-2.5 py-2 text-xs font-medium ${estiloBase} ${sobreColor ? 'hover:bg-white/15' : 'hover:bg-muted'}`}
        >
          <Languages className="h-3.5 w-3.5" />
          {idiomaActual?.codigo.toUpperCase()}
        </button>

        {selectorAbierto && (
          <div className="absolute right-0 top-full z-20 mt-1 max-h-64 w-40 overflow-y-auto rounded-lg border border-border bg-card p-1 text-foreground shadow-lg">
            {IDIOMAS_DISPONIBLES.map((idi) => (
              <button
                key={idi.codigo}
                type="button"
                onClick={() => {
                  setIdioma(idi.codigo)
                  setSelectorAbierto(false)
                }}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs hover:bg-muted"
              >
                {idi.nombre}
                {idi.codigo === idioma && <Check className="h-3.5 w-3.5 text-primario" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}