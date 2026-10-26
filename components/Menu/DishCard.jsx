'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Box, Flame, X } from 'lucide-react'
import { ModelViewer3D } from './ModelViewer3D'

export function DishCard({ dish, formaBoton = 'redondeado', textoVerEn3D = 'Ver en 3D', textoKcal = 'kcal', disposicion = 'lista', tamanoFoto = 'pequena' }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const radiusBoton = formaBoton === 'cuadrado' ? 'rounded-md' : 'rounded-full'
    const esCuadricula = disposicion === 'cuadricula'
  const grande = tamanoFoto === 'grande'

  const claseFoto = esCuadricula
    ? grande ? 'h-40 w-full' : 'h-28 w-full'
    : grande ? 'h-32 w-32 sm:h-36 sm:w-36' : 'h-24 w-24 sm:h-28 sm:w-28'

  const tamanosImagen = esCuadricula
    ? '(max-width: 640px) 50vw, 33vw'
    : grande ? '(max-width: 640px) 128px, 144px' : '(max-width: 640px) 96px, 112px'


  return (
    <>
      <article className={`flex rounded-3xl border border-border bg-card p-3 shadow-sm ${esCuadricula ? 'flex-col gap-3' : 'gap-4'}`}>
        <div className={`relative shrink-0 overflow-hidden rounded-2xl bg-muted ${claseFoto}`}>
          <Image
            src={dish.image || '/placeholder.svg'}
            alt={dish.name}
            fill
            sizes={tamanosImagen}
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className={esCuadricula ? 'flex flex-col gap-0.5' : 'flex items-start justify-between gap-2'}>
            <h3 className="text-base font-semibold leading-snug text-foreground text-balance">
              {dish.name}
            </h3>
            <span className="shrink-0 text-base font-bold tabular-nums text-primario">
              S/ {dish.price?.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {dish.description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className={`inline-flex items-center gap-1 bg-primario-suave px-2.5 py-1 text-xs font-medium text-primario ${radiusBoton}`}>
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              {dish.calories} {textoKcal}
            </span>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className={`inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent active:scale-[0.97] ${radiusBoton}`}
            >
              <Box className="h-3.5 w-3.5" aria-hidden="true" />
              {textoVerEn3D}
            </button>
          </div>
        </div>
      </article>

      {modalAbierto && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="w-full max-w-md rounded-2xl bg-card p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{dish.name}</h3>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ModelViewer3D modeloUrl={dish.modelo3d} nombre={dish.name} />
          </div>
        </div>
      )}
    </>
  )
}