'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { Info } from 'lucide-react'

// Componente reutilizable para mostrar un plato en 3D / AR.
// modeloUrl: link al archivo .glb del plato
// nombre: usado como texto alternativo
export function ModelViewer3D({ 
  modeloUrl, 
  nombre,
  textoGuia = 'Para verlo en AR: apunta a una mesa con buena luz y mueve el celular despacio en círculo hasta que detecte la superficie.',
 }) {
  if (!modeloUrl) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
        Este plato aún no tiene modelo 3D disponible.
      </div>
    )
  }

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="afterInteractive"
      />
      {/* model-viewer es un web component; en JSX su nombre se escribe tal cual */}
      <model-viewer
        src={modeloUrl}
        alt={`Modelo 3D de ${nombre}`}
        ar
        ar-modes="scene-viewer webxr quick-look"
        ar-placement="floor"
        ar-scale="auto"
        loading="eager"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '320px', borderRadius: '16px', backgroundColor: 'var(--muted)' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primario px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
        >
          Ver en tu mesa (AR)
        </button>
      </model-viewer>
      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {textoGuia}
      </p>
    </>
  )
}