'use client'

import { ScanLine } from 'lucide-react'

export function ArButton({ formaBoton = 'redondeado' }) {
  const radius = formaBoton === 'cuadrado' ? 'rounded-md' : 'rounded-2xl'

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 bg-primario px-6 py-4 text-base font-semibold text-white shadow-sm transition-transform active:scale-[0.98] ${radius}`}
    >
      <ScanLine className="h-5 w-5" aria-hidden="true" />
      Ver en AR
    </button>
  )
}