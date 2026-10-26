"use client"

import { useRef } from "react"
import { Upload, Trash2, UtensilsCrossed } from "lucide-react"
import { comprimirImagen } from "@/lib/comprimirImagen"

export function LogoUploader({ logo, onChange }) {
  const inputRef = useRef(null)

    async function handleFile(file) {
    if (!file) return
    const comprimido = await comprimirImagen(file, 400, 0.85, "image/png")
    onChange(URL.createObjectURL(comprimido), comprimido)
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
          {logo ? (
            <img src={logo || "/placeholder.svg"} alt="Logo del restaurante" className="h-full w-full object-cover" />
          ) : (
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {logo ? "Cambiar logo" : "Subir logo"}
          </button>
          {logo && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Quitar
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Formato PNG o JPG. Se mostrará en forma circular en la cabecera del menú.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}